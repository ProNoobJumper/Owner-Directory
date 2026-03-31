import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, MapPin, Star, ChevronRight } from "lucide-react";
import { api } from "../lib/api";
import { Owner, CATEGORIES } from "../types/owner";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";

const ITEMS_PER_PAGE = 6;

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      try {
        const hasFilters = searchQuery || (selectedCategory && selectedCategory !== "all");
        const res = hasFilters
          ? await api.searchOwners(
              searchQuery,
              selectedCategory === "all" ? "" : selectedCategory,
              currentPage - 1,
              ITEMS_PER_PAGE,
            )
          : await api.getOwners(currentPage - 1, ITEMS_PER_PAGE);
        setOwners(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } catch (err) {
        console.error("Failed to fetch owners:", err);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce to avoid spamming the backend
    const timeoutId = setTimeout(fetchOwners, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

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

        {/* Search and Filter Section */}
        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto border border-slate-100">
          <div className="relative flex-1 flex items-center bg-slate-50 rounded-xl px-4 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="h-5 w-5 text-slate-400 mr-2" />
            <Input
              type="text"
              placeholder="Search by name, business, or city..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base"
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full h-full min-h-[3rem] px-4 rounded-xl border-none bg-slate-50 hover:bg-slate-100 transition-colors focus:ring-0">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-slate-100">
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Owner Cards Grid */}
      <div className="max-w-6xl mx-auto pb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Featured Enterprises
          </h2>
          <p className="text-sm font-medium text-slate-500">
            {loading
              ? "Searching..."
              : `Showing ${owners.length} of ${totalElements} listed`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-slate-100 rounded-3xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : owners.length === 0 ? (
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
                to={`/owner/${owner.id}`}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
