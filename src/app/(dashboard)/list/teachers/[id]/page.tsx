import Announcements from "@/components/Announcements";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import StudentCalendar from "@/components/StudentCalendar";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const SingleTeacherPage = () => {
  return (
    <div className="flex-1 p-4 flex  flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className=" w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USERCARD */}
          <div className="bg-lightPurple py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className=":w-1/3">
              <Image
                src="/profile_icon.png"
                alt=""
                width={140}
                height={140}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className=" text-xl font-semibold">Name Name</h1>
                {role === "admin" && (
                  <FormModal
                    table="teacher"
                    type="update"
                    data={{
                      id: 1,
                      username: "deanguerrero",
                      email: "deanguerrero@gmail.com",
                      password: "password",
                      firstName: "Dean",
                      lastName: "Guerrero",
                      phone: "+1 234 567 89",
                      address: "1234 Main St, Anytown, USA",
                      bloodType: "A+",
                      birthday: "2000-01-01",
                      sex: "male",
                      img: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    }}
                  />
                )}
              </div>
              <p className=" text-sm text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>1+</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>September 2024</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>example@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>+380121212121</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="w-full bg-white p-4 rounded-md flex md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Відвідуваність</span>
              </div>
            </div>
            {/* CARD */}
            <div className="w-full bg-white p-4 rounded-md flex md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Уроки</span>
              </div>
            </div>
            {/* CARD */}
            <div className="w-full bg-white p-4 rounded-md flex md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Класи</span>
              </div>
            </div>
            {/* CARD */}
            <div className="w-full bg-white p-4 rounded-md flex md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">2</h1>
                <span className="text-sm text-gray-400">Гілки</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="">
          <div className=" mt-4 bg-white rounded-md p-4 h-[800px]">
            <h1>Розклад вчителя</h1>
            <StudentCalendar />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className=" w-full xl:w-1/3 flex flex-col gap-4">
        <div className=" bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Швидкі дії</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-lightYellow"
              href={`/list/classes?supervisorId=${"teacher2"}`}
            >
              Класи вчителя
            </Link>
            <Link
              className="p-3 rounded-md bg-lightPurple"
              href={`/list/students?teacherId=${"teacher2"}`}
            >
              Студенти вчителя
            </Link>
            <Link
              className="p-3 rounded-md bg-lightYellow"
              href={`/list/exams?teacherId=${"teacher2"}`}
            >
              Контольні роботи вчителя
            </Link>
            <Link
              className="p-3 rounded-md bg-lightPurple"
              href={`/list/lessons?teacherId=${"teacher2"}`}
            >
              Уроки вчителя
            </Link>
            <Link
              className="p-3 rounded-md bg-lightYellow"
              href={`/list/assignments?teacherId=${"teacher2"}`}
            >
              Завдання вчителя
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
