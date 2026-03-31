"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { CATEGORIES } from "@/types/owner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function SearchFilters({
  initialQuery,
  initialCategory,
}: {
  initialQuery: string;
  initialCategory: string;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const updateFilters = (query: string, category: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "all") params.set("c", category);

    // Reset page to 1 on new searches
    router.push(`/?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilters(value, selectedCategory);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateFilters(searchQuery, value);
  };

  return (
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
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
  );
}
