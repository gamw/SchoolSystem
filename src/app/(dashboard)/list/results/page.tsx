import FormModal from "@/components/FormModal";
import Pages from "@/components/Pages";
import Searchbar from "@/components/Searchbar";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { role, userId } from "@/lib/utils";
import { Prisma, Result } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              { student: { name: { contains: value, mode: "insensitive" } } },
              {
                student: {
                  class: { name: { contains: value, mode: "insensitive" } },
                },
              },
              {
                assignment: { title: { contains: value, mode: "insensitive" } },
              },
              {
                student: { surname: { contains: value, mode: "insensitive" } },
              },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITION
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.OR = [
        { exam: { lesson: { teacherId: userId! } } },
        { assignment: { lesson: { teacherId: userId! } } },
      ];
      break;

    case "student":
      query.studentId = userId!;
      break;

    case "parent":
      query.student = {
        parentId: userId!,
      };
      break;
    default:
      break;
  }
  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                Teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                Teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  const data = dataRes.map((item) => {
    const task = item.exam || item.assignment;

    if (!task) {
      return null;
    }
    const isExam = "startTime" in task;

    return {
      id: item.id,
      title: task.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: task.lesson.Teacher.name,
      teacherSurname: task.lesson.Teacher.surname,
      score: item.score,
      className: task.lesson.class.name,
      startTime: isExam ? task.startTime : task.startDate,
    };
  });

  // RENDER ROW //
  const cols = [
    {
      header: "Назва",
      accessor: "info",
    },
    {
      header: "Студент",
      accessor: "student",
      className: "hidden md:table-cell",
    },
    {
      header: "Оцінка",
      accessor: "score",
    },
    {
      header: "Вчитель",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Клас",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Дата",
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

  const renderRow = (item: ResultList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightPurple"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {item.studentName + " " + item.studentSurname}
      </td>
      <td>{item.score}</td>
      <td className="hidden md:table-cell">
        {item.teacherName + " " + item.teacherSurname}
      </td>
      <td className="hidden md:table-cell">{item.className}</td>
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

  // RENDER  ROW //

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Результати</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full  md:w-auto">
          <Searchbar />
          <div className="flex items-center gap-4 sm:justify-start self-end">
            <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              <Image src="/filter.png" alt="" width={15} height={15} />
            </button>
            <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              <Image src="/sort.png" alt="" width={15} height={15} />
            </button>
            {role === "admin" && <FormModal table="result" type="create" />}
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

export default ResultListPage;
