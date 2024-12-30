import prisma from "@/lib/prisma";
import StudentCalendar from "./StudentCalendar";
import { title } from "process";
import { scheduleForCurrentWeek } from "@/lib/utils";

const CalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const responseData = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

  const data = responseData.map((l) => ({
    title: l.name,
    start: l.startTime,
    end: l.endTime,
  }));

  const schedule = scheduleForCurrentWeek(data);

  return (
    <div className="">
      <StudentCalendar data={data} />
    </div>
  );
};

export default CalendarContainer;
