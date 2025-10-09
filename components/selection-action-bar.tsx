"use client";

import { useBookStore } from "@/lib/store";
import { Button } from "./ui/button";
import { X, Trash2, MoveRight, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SelectionActionBar() {
  const selectedBooks = useBookStore((state) => state.selectedBooks);
  const selectionMode = useBookStore((state) => state.selectionMode);
  const clearSelection = useBookStore((state) => state.clearSelection);
  const selectAll = useBookStore((state) => state.selectAll);
  const deleteSelected = useBookStore((state) => state.deleteSelected);
  const moveSelected = useBookStore((state) => state.moveSelected);
  const books = useBookStore((state) => state.books);
  const filter = useBookStore((state) => state.filter);

  if (!selectionMode || selectedBooks.size === 0) return null;

  // Calculate filtered books count
  const filteredBooksCount = filter === "all"
    ? books.length
    : books.filter((book) => book.status === filter).length;

  const allSelected = selectedBooks.size === filteredBooksCount;

  const handleDelete = async () => {
    if (confirm(`Delete ${selectedBooks.size} book${selectedBooks.size > 1 ? 's' : ''}?`)) {
      await deleteSelected();
    }
  };

  const handleMove = async (status: "reading" | "completed" | "to-read") => {
    await moveSelected(status);
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-background/95 backdrop-blur-xl rounded-2xl border-2 border-blue-500/50 dark:shadow-[0_0_30px_rgba(59,130,246,0.4)] shadow-[0_0_30px_rgba(59,130,246,0.2)] px-4 md:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="gap-2 border border-blue-500/30 hover:border-blue-500/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cancel</span>
            </Button>

            <div className="h-6 w-px bg-blue-500/30 dark:bg-blue-500/30" />

            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {selectedBooks.size} selected
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={allSelected ? clearSelection : selectAll}
              className="gap-2 border border-blue-500/30 hover:border-blue-500/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">{allSelected ? "Unselect All" : "Select All"}</span>
            </Button>
          </div>

          <div className="hidden md:block h-6 w-px bg-blue-500/30 dark:bg-blue-500/30" />

          {/* Right Section */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border border-blue-500/50 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-blue-500/10 hover:bg-blue-500/20"
                >
                  <MoveRight className="w-4 h-4" />
                  <span className="hidden sm:inline">Move to</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-blue-500/30">
                <DropdownMenuItem onClick={() => handleMove("reading")}>
                  Currently Reading
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMove("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMove("to-read")}>
                  To Read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="gap-2 border border-red-500/50 hover:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
