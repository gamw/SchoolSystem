import FormModal from "@/components/FormModal";
import Pages from "@/components/Pages";
import Searchbar from "@/components/Searchbar";
import Table from "@/components/Table";

import prisma from "@/lib/prisma";
import { role, userId } from "@/lib/utils";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type EventList = Event & { class: Class };

const EventListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Pagination
  const { page, ...queryParams } = searchParams;
  //without param will be 1
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION

  const query: Prisma.EventWhereInput = {};
  // Захищаємо шляхи
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS //

  const roleCondition = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  query.OR = [
    { classId: null },
    {
      class: roleCondition[role as keyof typeof roleCondition] || {},
    },
  ];

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: 10,
      //skip this amount and show next 10(take)
      skip: 10 * (p - 1),
    }),

    prisma.event.count({ where: query }),
  ]);

  // RENDER ROW //
  const cols = [
    {
      header: "Подія",
      accessor: "info",
    },
    {
      header: "Клас",
      accessor: "class",
    },
    {
      header: "Дата",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Початок",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "Кінець",
      accessor: "endTime",
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
  const renderRow = (item: EventList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightPurple"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </td>
      <td>{item.class?.name || "Всі"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startDate)}
      </td>
      <td className="hidden md:table-cell">
        {item.startDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td className="hidden md:table-cell">
        {item.endDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="event" type="update" data={item} />
              <FormModal table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  //RENDER ROW //

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Події</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full  md:w-auto">
          <Searchbar />
          <div className="flex items-center gap-4 sm:justify-start self-end">
            <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              <Image src="/filter.png" alt="" width={15} height={15} />
            </button>
            <button className=" bg-purple  rounded-md w-9 h-9 flex items-center justify-center">
              <Image src="/sort.png" alt="" width={15} height={15} />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
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

export default EventListPage;
