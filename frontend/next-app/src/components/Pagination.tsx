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
    <div
      className="mt-16 pt-6 flex justify-center items-center gap-0"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <PagBtn
        onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        ← Prev
      </PagBtn>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PagBtn
          key={page}
          onClick={() => navigateToPage(page)}
          active={currentPage === page}
        >
          {page}
        </PagBtn>
      ))}

      <PagBtn
        onClick={() => navigateToPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next →
      </PagBtn>
    </div>
  );
}

function PagBtn({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="min-w-[2.75rem] h-10 px-3 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        backgroundColor: active ? "var(--primary)" : "transparent",
        color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
        border: "1px solid var(--border)",
        marginLeft: "-1px",
        fontFamily: "var(--font-sans)",
      }}
      onMouseEnter={(e) => {
        if (!active && !disabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)";
          (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
        }
      }}
    >
      {children}
    </button>
  );
}
