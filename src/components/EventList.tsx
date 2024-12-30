import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();
  const data = await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  if (data.length === 0) {
    return <h2>No events for today</h2>;
  } else {
    return data.map((event) => (
      <div
        className=" p-5 rounded-md border-2 border-gray-100  border-t-4 odd:border-t-sky even:border-t-purple "
        key={event.id}
      >
        <div className="flex items-center justify-between ">
          <h1 className=" font-semibold text-gray-600">{event.title}</h1>
          <span className=" text-gray-300 text-xs">
            {event.startDate.toLocaleTimeString("en-UK", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
        <p className="mt-2 text-gray-400 text-sm">{event.desc}</p>
      </div>
    ));
  }
};

export default EventList;
