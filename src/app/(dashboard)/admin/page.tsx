import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CalendarEvent from "@/components/CalendarEvent";
import CalendarEventContainer from "@/components/CalendarEventContainer";
import CountChartContainer from "@/components/CountChartContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col md:flex-row no-scrollbar">
      {/*LEFT*/}
      <div className="w-full lg:w-2/3 flex flex-col gap-8  ">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
        </div>
        {/* MIDDLE CHART */}
        <div className="flex gap-4 flex-col lg:flex-row ">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px] ">
          <FinanceChart />
        </div>
      </div>
      {/*RIGHT*/}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <CalendarEventContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;