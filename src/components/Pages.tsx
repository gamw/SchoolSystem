"use client";
import { useRouter } from "next/navigation";

const Pages = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const hasPrevious = 10 * (page - 1) > 0;
  const hasNext = 10 * (page - 1) + 10 < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className=" p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrevious}
        onClick={() => changePage(page - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Попередня
      </button>

      <div className="flex items-center text-sm gap-2">
        {Array.from({ length: Math.ceil(count / 10) }, (_, index) => {
          const pageIndex = index + 1;

          return (
            <button
              key={pageIndex}
              className={`px-2 rounded-md ${
                page === pageIndex ? "bg-blue-200" : ""
              }`}
              onClick={() => {
                changePage(pageIndex);
              }}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => changePage(page + 1)}
        disabled={!hasNext}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Наступна
      </button>
    </div>
  );
};

export default Pages;
