import { auth } from "@clerk/nextjs/server";

async function getRole() {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    return { userId, role };
}

export const { userId, role } = await getRole();

const currWeek = ()=>{
    const today = new Date()
    const dayOfWeek = today.getDay()

    const startOfWeek = new Date(today);

    if(dayOfWeek == 0){
startOfWeek.setDate(today.getDate() + 1)
    }
    if(dayOfWeek === 6){
        startOfWeek.setDate(today.getDate() + 2)

    }else{
        startOfWeek.setDate(today.getDate() + (dayOfWeek-1))
    }
    startOfWeek.setHours(0,0,0,0);


    return startOfWeek

}

export const scheduleForCurrentWeek = (lessons:{title:string; start:Date; end:Date}[]):{title:string; start:Date; end:Date}[] =>{
    const startOfWeek = currWeek()

    return lessons.map(l =>{
        const lessonDayOfWeek = l.start.getDay()

        const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

        const scheduleStartDate = new Date(startOfWeek)
        scheduleStartDate.setDate(startOfWeek.getDate() + daysFromMonday)
        scheduleStartDate.setHours(
            l.start.getHours(),
            l.start.getMinutes(),
            l.start.getSeconds()
          );
    

        const scheduleEndDate = new Date(scheduleStartDate);
        scheduleEndDate.setHours(
      l.end.getHours(),
      l.end.getMinutes(),
      l.end.getSeconds()
    );

    return {
      title: l.title,
      start: scheduleStartDate,
      end: scheduleEndDate,
    };
    })
}