"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
    <div
      className="flex flex-col sm:flex-row"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Search input */}
      <div
        className="relative flex-1 flex items-center"
        style={{ borderRight: "1px solid var(--border)" }}
      >
        <Search
          className="absolute left-4 h-4 w-4 pointer-events-none"
          style={{ color: "var(--muted-foreground)" }}
        />
        <input
          type="text"
          placeholder="Search by name, business, or city…"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full py-3.5 pl-11 pr-4 bg-transparent text-sm outline-none placeholder:text-sm"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>

      {/* Category select */}
      <div className="w-full sm:w-52 shrink-0">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger
            className="w-full h-full min-h-[3.25rem] px-4 border-none rounded-none shadow-none text-sm font-medium focus:ring-0"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
              fontFamily: "var(--font-sans)",
            }}
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent
            className="rounded-none shadow-lg border"
            style={{ borderColor: "var(--border)" }}
          >
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
