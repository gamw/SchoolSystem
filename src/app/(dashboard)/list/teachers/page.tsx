import FormModal from "@/components/FormModal";
import Pages from "@/components/Pages";
import Searchbar from "@/components/Searchbar";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { role } from "@/lib/utils";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Pagination
  const { page, ...queryParams } = searchParams;
  //without param will be 1
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION

  const query: Prisma.TeacherWhereInput = {};
  // Захищаємо шляхи
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
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
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: 10,
      //skip this amount and show next 10(take)
      skip: 10 * (p - 1),
    }),

    prisma.teacher.count({ where: query }),
  ]);

  // RENDER ROW //
  const cols = [
    {
      header: "ПІБ",
      accessor: "info",
    },
    {
      header: "ID",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "Предмети",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: "Класи",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Телефон",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Адреса",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Дії",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: TeacherList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightPurple"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img || "/avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">
        {item.subjects.map((s) => s.name).join(",")}
      </td>
      <td className="hidden md:table-cell">
        {item.classes.map((c) => c.name).join(",")}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-200">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-md bg-purple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="teacher" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );
  // RENDER ROW //

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Список вчителів
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

            {role === "admin" && (
              // <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              //   <Image src="/create.png" alt="" width={15} height={15} />
              // </button>

              <FormModal table="teacher" type="create" />
            )}
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

export default TeacherListPage;
