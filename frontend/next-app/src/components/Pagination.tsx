"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  if (totalPages <= 1) return null;

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("p", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      <button
        onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
      >
        Previous
      </button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => navigateToPage(page)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigateToPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
