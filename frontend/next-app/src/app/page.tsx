import { MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { SearchFilters } from "@/components/SearchFilters";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

type Owner = Awaited<ReturnType<typeof api.getOwners>>["content"][number];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const c = typeof params.c === "string" ? params.c : "all";
  const p = typeof params.p === "string" ? parseInt(params.p, 10) : 1;

  const hasFilters = q || (c && c !== "all");
  let owners: Owner[] = [];
  let totalPages = 0;
  let totalElements = 0;

  try {
    const res = hasFilters
      ? await api.searchOwners(q, c === "all" ? "" : c, p - 1, 6)
      : await api.getOwners(p - 1, 6);
    owners = res.content;
    totalPages = res.totalPages;
    totalElements = res.totalElements;
  } catch {
    // Backend unavailable — render with empty data
  }

  const [featured, ...rest] = owners;

  return (
    <div>
      {/* Hero */}
      <section
        className="border-b"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-14">
          <div className="max-w-2xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: "var(--primary)" }}
            >
              India&apos;s Business Network
            </p>
            <h1
              className="font-display font-black leading-none mb-6"
              style={{ color: "var(--foreground)" }}
            >
              Discover{" "}
              <em
                className="not-italic"
                style={{ color: "var(--primary)", fontStyle: "italic" }}
              >
                Exceptional
              </em>
              <br />
              Local Professionals
            </h1>
            <p
              className="text-base leading-relaxed mb-10 max-w-xl"
              style={{ color: "var(--muted-foreground)", fontWeight: 400 }}
            >
              Connect with verified businesses and trusted proprietors
              across India. From artisans to enterprises — all in one place.
            </p>

            <SearchFilters initialQuery={q} initialCategory={c} />
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        {/* Section header */}
        <div className="flex items-baseline justify-between mb-10 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2
            className="font-display font-bold"
            style={{ color: "var(--foreground)", fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
          >
            {hasFilters ? "Search Results" : "Featured Enterprises"}
          </h2>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--muted-foreground)" }}
          >
            {totalElements} listed
          </span>
        </div>

        {owners.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Magazine layout: featured hero + grid */}
            {featured && !hasFilters && p === 1 && (
              <FeaturedCard owner={featured} />
            )}

            {/* Rest in asymmetric grid */}
            <div
              className="grid gap-px mt-px"
              style={{ backgroundColor: "var(--border)" }}
            >
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
                style={{ backgroundColor: "var(--border)" }}
              >
                {(hasFilters || p > 1 ? owners : rest).map((owner, i) => (
                  <DirectoryCard key={owner.id} owner={owner} index={i} />
                ))}
              </div>
            </div>
          </>
        )}

        <Pagination totalPages={totalPages} currentPage={p} />
      </section>
    </div>
  );
}

function FeaturedCard({ owner }: { owner: Owner }) {
  return (
    <Link
      href={`/owner/${owner.slug || owner.id}`}
      className="group block mb-px overflow-hidden"
      style={{ backgroundColor: "var(--card)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image — tall editorial crop */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", minHeight: "280px" }}>
          <img
            src={owner.image}
            alt={owner.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 60%, var(--card))" }}
          />
          {/* Category tag — bottom left */}
          <div className="absolute bottom-4 left-4">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {owner.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex flex-col justify-between p-8 lg:p-12"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-4"
              style={{ color: "var(--primary)" }}
            >
              Editor&apos;s Pick
            </p>
            <h3
              className="font-display font-bold mb-3 group-hover:opacity-80 transition-opacity"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "var(--foreground)", lineHeight: 1.1 }}
            >
              {owner.businessName}
            </h3>
            <p className="text-sm font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>
              by {owner.name}
            </p>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "var(--muted-foreground)" }}
            >
              {owner.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                <MapPin className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
                {owner.city}
              </div>
              <div
                className="flex items-center gap-1 text-sm font-bold"
                style={{ color: "var(--foreground)" }}
              >
                <Star className="h-3.5 w-3.5" style={{ color: "var(--primary)", fill: "var(--primary)" }} />
                {owner.rating}
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-opacity group-hover:opacity-60"
              style={{ color: "var(--primary)" }}
            >
              View Profile
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DirectoryCard({ owner, index }: { owner: Owner; index: number }) {
  /* Alternate: every 5th card (index 4) is wide — creates rhythm in the grid */
  return (
    <Link
      href={`/owner/${owner.slug || owner.id}`}
      className="group flex flex-col overflow-hidden transition-colors"
      style={{ backgroundColor: "var(--card)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--card)";
      }}
    >
      {/* Image */}
      <div className="overflow-hidden" style={{ aspectRatio: "3/2" }}>
        <img
          src={owner.image}
          alt={owner.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2"
          style={{ color: "var(--primary)" }}
        >
          {owner.category}
        </p>

        {/* Title */}
        <h3
          className="font-display font-bold mb-1 line-clamp-2 leading-tight"
          style={{ fontSize: "1.05rem", color: "var(--foreground)" }}
        >
          {owner.businessName}
        </h3>
        <p className="text-xs font-medium mb-3" style={{ color: "var(--muted-foreground)" }}>
          {owner.name}
        </p>

        <p
          className="text-xs leading-relaxed line-clamp-2 flex-1 mb-4"
          style={{ color: "var(--muted-foreground)" }}
        >
          {owner.description}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
            <MapPin className="h-3 w-3" style={{ color: "var(--primary)" }} />
            <span className="truncate max-w-[100px]">{owner.city}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--foreground)" }}>
            <Star className="h-3 w-3" style={{ color: "var(--primary)", fill: "var(--primary)" }} />
            {owner.rating}
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div
      className="py-24 text-center border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      <p
        className="font-display font-bold text-2xl mb-3"
        style={{ color: "var(--foreground)" }}
      >
        No results found
      </p>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        Try adjusting your search — or browse all categories.
      </p>
    </div>
  );
}
