import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

const Announcements = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleCondition = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId } } },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { publishDate: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleCondition[role as keyof typeof roleCondition] || {} },
        ],
      }),
    },
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className=" text-xs text-gray-400">View all</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className=" bg-lightSky p-4 rounded-md">
            <div className="flex justify-between  items-center">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {data[0].publishDate.toLocaleDateString("en-US")}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].desc}</p>
          </div>
        )}
        {data[1] && (
          <div className="  bg-lightPurple p-4 rounded-md">
            <div className="flex justify-between  items-center">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {data[1].publishDate.toLocaleDateString("en-US")}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].desc}</p>
          </div>
        )}
        {data[2] && (
          <div className=" bg-lightYellow p-4 rounded-md">
            <div className="flex justify-between  items-center">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {data[2].publishDate.toLocaleDateString("en-US")}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].desc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
