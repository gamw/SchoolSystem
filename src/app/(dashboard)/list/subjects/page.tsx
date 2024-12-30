import FormModal from "@/components/FormModal";
import Pages from "@/components/Pages";
import Searchbar from "@/components/Searchbar";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { role } from "@/lib/utils";
import { Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type SubjectList = Subject & { teachers: Teacher[] };

const cols = [
  {
    header: "Назва предмету",
    accessor: "info",
  },
  {
    header: "Вчителі",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Дії",
    accessor: "action",
  },
];

const renderRow = (item: SubjectList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightPurple"
  >
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell">
      {item.teachers.map((t) => t.name).join(",")}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModal table="exam" type="update" data={item} />
            <FormModal table="exam" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Список предметів
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full  md:w-auto">
          <Searchbar />
          <div className="flex items-center gap-4 sm:justify-start self-end">
            <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              <Image src="/filter.png" alt="" width={15} height={15} />
            </button>
            <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              <Image src="/sort.png" alt="" width={15} height={15} />
            </button>
            {role === "admin" && <FormModal table="subject" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={cols} renderRow={renderRow} data={data} />
      {/* PAGES */}
      <Pages page={p} count={count} />
    </div>
  );
};

export default SubjectListPage;
