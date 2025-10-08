"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface PublicFiltersBarProps {
  filter: "all" | "reading" | "completed" | "to-read";
  setFilter: (filter: "all" | "reading" | "completed" | "to-read") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "newest" | "a-z" | "z-a" | "rating-high" | "rating-low";
  setSortBy: (sortBy: "newest" | "a-z" | "z-a" | "rating-high" | "rating-low") => void;
}

export function PublicFiltersBar({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: PublicFiltersBarProps) {
  return (
    <div className="space-y-3">
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={`text-xs sm:text-sm ${
            filter === "all"
              ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
              : "border-blue-500/20 text-blue-500 hover:bg-blue-500/10 glow-blue-hover"
          }`}
        >
          All
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
          className={`text-xs sm:text-sm ${
            filter === "completed"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
              : "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 glow-emerald-hover"
          }`}
        >
          Completed
        </Button>
        <Button
          variant={filter === "reading" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("reading")}
          className={`text-xs sm:text-sm ${
            filter === "reading"
              ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
              : "border-amber-500/20 text-amber-500 hover:bg-amber-500/10 glow-amber-hover"
          }`}
        >
          Reading
        </Button>
        <Button
          variant={filter === "to-read" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("to-read")}
          className={`text-xs sm:text-sm ${
            filter === "to-read"
              ? "bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
              : "border-purple-500/20 text-purple-500 hover:bg-purple-500/10 glow-purple-hover"
          }`}
        >
          To Read
        </Button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as Parameters<typeof setSortBy>[0])}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="newest">Newest First</option>
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
          <option value="rating-high">Rating: High to Low</option>
          <option value="rating-low">Rating: Low to High</option>
        </select>
      </div>
    </div>
  );
}
