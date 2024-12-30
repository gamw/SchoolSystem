import FormModal from "@/components/FormModal";
import Pages from "@/components/Pages";
import Searchbar from "@/components/Searchbar";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type LessonList = Lesson & { subject: Subject } & { Teacher: Teacher } & {
  class: Class;
};

const LessonsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.teacherId = value;
            break;
          case "classId":
            query.classId = parseInt(value);
            break;
          case "search":
            query.OR = [
              { subject: { name: { contains: value, mode: "insensitive" } } },
              { Teacher: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } },
        Teacher: { select: { name: true, surname: true } },
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.lesson.count({ where: query }),
  ]);

  //RENDER ROW //
  const renderRow = (item: LessonList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightPurple"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.subject.name}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.class.name}</td>
      <td className="hidden md:table-cell">
        {item.Teacher.name + " " + item.Teacher.surname}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="lesson" type="update" data={item} />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const cols = [
    {
      header: "Предмет",
      accessor: "info",
    },
    {
      header: "Клас",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Вчитель",
      accessor: "teacher",
      className: "hidden md:table-cell",
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
  //RENDER ROW //

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Всі уроки</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full  md:w-auto">
          <Searchbar />
          <div className="flex items-center gap-4 sm:justify-start self-end">
            <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              <Image src="/filter.png" alt="" width={15} height={15} />
            </button>
            <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              <Image src="/sort.png" alt="" width={15} height={15} />
            </button>
            {role === "admin" && <FormModal table="lesson" type="create" />}
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

export default LessonsListPage;
