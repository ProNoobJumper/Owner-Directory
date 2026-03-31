import { Search, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { SearchFilters } from "@/components/SearchFilters";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

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
  let owners: Awaited<ReturnType<typeof api.getOwners>>["content"] = [];
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
    // Backend unavailable — render page with empty data
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-16 md:py-24 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="mb-6 rounded-full px-4 py-1.5 shadow-sm text-blue-600 bg-blue-50 border-blue-200"
        >
          Trusted Business Network
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
          Discover Exceptional Local{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            Professionals
          </span>
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with verified businesses and exceptional proprietors in your
          community. Explore our premier directory today.
        </p>

        {/* Search and Filter Section (Client Component) */}
        <SearchFilters initialQuery={q} initialCategory={c} />
      </div>

      {/* Owner Cards Grid */}
      <div className="max-w-6xl mx-auto pb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Featured Enterprises
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Showing {owners.length} of {totalElements} listed
          </p>
        </div>

        {owners.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No professionals found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search criteria and explore again.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {owners.map((owner) => (
              <Link
                href={`/owner/${owner.slug || owner.id}`}
                key={owner.id}
                className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={owner.image}
                    alt={owner.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white border-none shadow-sm capitalize tracking-wide font-semibold text-xs">
                      {owner.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                        {owner.businessName}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        by {owner.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed mb-6 flex-1">
                    {owner.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="truncate max-w-[120px]">
                        {owner.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-sm font-bold">
                      <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
                      <span>{owner.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls (Client Component) */}
        <Pagination totalPages={totalPages} currentPage={p} />
      </div>
    </div>
  );
}
