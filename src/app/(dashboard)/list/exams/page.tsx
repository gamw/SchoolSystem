import FormModal from "@/components/FormModal";
import Pages from "@/components/Pages";
import Searchbar from "@/components/Searchbar";
import Table from "@/components/Table";

import prisma from "@/lib/prisma";
import { role, userId } from "@/lib/utils";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    Teacher: Teacher;
    class: Class;
  };
};

const ExamsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AssignmentWhereInput = {};
  query.lesson = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "classId":
            query.lesson.classId = parseInt(value);
            break;
          case "search":
            query.lesson.subject = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITION
  const roleCondition = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  query.lesson = {
    class: roleCondition[role as keyof typeof roleCondition] || {},
  };

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            Teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.assignment.count({ where: query }),
  ]);

  const renderRow = (item: ExamList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightPurple"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.lesson.subject.name}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {item.lesson.Teacher.name + " " + item.lesson.Teacher.surname}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" ||
            (role === "teacher" && (
              <>
                <FormModal table="exam" type="update" data={item} />
                <FormModal table="exam" type="delete" id={item.id} />
              </>
            ))}
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
    {
      header: "Дата проведення",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Дії",
            accessor: "action",
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Контрольні роботи
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
            {role === "admin" && <FormModal table="exam" type="create" />}
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

export default ExamsListPage;
