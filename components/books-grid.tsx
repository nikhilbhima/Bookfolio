"use client";

import React, { useState, useEffect } from "react";
import { Grid3x3, List, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { Button } from "./ui/button";
import { BookCard } from "./book-card";
import { AddBookModal } from "./add-book-modal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Book } from "@/lib/mock-data";

interface SortableBookCardProps {
  book: Book;
  view: "grid" | "list";
  isMobile: boolean;
}

function SortableBookCard({ book, view, isMobile }: SortableBookCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    visibility: isDragging ? ('hidden' as const) : ('visible' as const),
  };

  // Desktop: entire card is draggable, Mobile: only handle is draggable
  const desktopDragProps = !isMobile ? { ...attributes, ...listeners } : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
      {...desktopDragProps}
    >
      <BookCard
        book={book}
        view={view}
        isDragging={isDragging}
        dragAttributes={attributes}
        dragListeners={listeners}
        isMobile={isMobile}
      />
    </div>
  );
}

export function BooksGrid() {
  const view = useBookStore((state) => state.view);
  const setView = useBookStore((state) => state.setView);
  const books = useBookStore((state) => state.books);
  const reorderBooks = useBookStore((state) => state.reorderBooks);
  const filter = useBookStore((state) => state.filter);
  const searchQuery = useBookStore((state) => state.searchQuery);
  const sortBy = useBookStore((state) => state.sortBy);
  const isLoading = useBookStore((state) => state.isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if drag should be enabled (only when no filters/search/sort applied)
  useEffect(() => {
    const shouldEnableDrag = filter === "all" && !searchQuery && sortBy === "newest";
    setIsDragEnabled(shouldEnableDrag);
  }, [filter, searchQuery, sortBy]);

  // Configure sensors - desktop uses pointer, mobile will use handle only
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Measuring configuration for smoother dragging
  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  // Compute filtered books using useMemo to prevent infinite loops
  const filteredBooks = React.useMemo(() => {
    let filtered = books;

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((book) => book.status === filter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.genre && book.genre.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case "a-z":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-high":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-low":
        sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "newest":
      default:
        // Keep original order (newest first)
        break;
    }

    return sorted;
  }, [books, filter, searchQuery, sortBy]);

  // Pagination logic - 6 rows of 6 books = 36 books per page
  const booksPerPage = 36;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);
  const shouldShowPagination = filteredBooks.length > booksPerPage;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = currentBooks.findIndex((book) => book.id === active.id);
    const newIndex = currentBooks.findIndex((book) => book.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Find indices in the full books array
      const fullOldIndex = books.findIndex((book) => book.id === active.id);
      const fullNewIndex = books.findIndex((book) => book.id === over.id);

      if (fullOldIndex !== -1 && fullNewIndex !== -1) {
        const newBooks = arrayMove(books, fullOldIndex, fullNewIndex);
        reorderBooks(newBooks);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeBook = activeId ? books.find((book) => book.id === activeId) : null;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* View Switcher */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!isDragEnabled && view === "grid" && (
            <p className="text-xs text-muted-foreground">
              💡 Drag disabled when filters/search/sort are active
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("grid")}
            className={`gap-1 sm:gap-2 px-2 sm:px-3 ${
              view === "grid"
                ? "bg-background shadow-sm"
                : "hover:bg-background/50"
            }`}
          >
            <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Grid</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("list")}
            className={`gap-1 sm:gap-2 px-2 sm:px-3 ${
              view === "list"
                ? "bg-background shadow-sm"
                : "hover:bg-background/50"
            }`}
          >
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">List</span>
          </Button>
        </div>
      </div>

      {/* Books Display */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-sm sm:text-base text-muted-foreground">Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm sm:text-base text-muted-foreground">No books found</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-4">
            Try adjusting your filters or add a new book
          </p>
          <Button
            onClick={() => setIsAddBookOpen(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </div>
      ) : (
        <>
          {isDragEnabled && view === "grid" ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
              measuring={measuring}
            >
              <SortableContext items={currentBooks.map((b) => b.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {currentBooks.map((book) => (
                    <SortableBookCard key={book.id} book={book} view={view} isMobile={isMobile} />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay
                dropAnimation={{
                  duration: 200,
                  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}
              >
                {activeBook ? (
                  <div style={{ cursor: 'grabbing' }}>
                    <BookCard book={activeBook} view={view} isDragOverlay />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                  : "space-y-2"
              }
            >
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} view={view} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {shouldShowPagination && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-9 w-9 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Drag Instructions */}
          {isDragEnabled && view === "grid" && currentBooks.length > 0 && (
            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground hidden sm:block">
                💡 Drag any book to reorder your collection
              </p>
              <p className="text-xs text-muted-foreground sm:hidden">
                💡 Tap a book and use the move icon to reorder
              </p>
            </div>
          )}
        </>
      )}

      {/* Add Book Modal */}
      <AddBookModal isOpen={isAddBookOpen} onClose={() => setIsAddBookOpen(false)} />
    </div>
  );
}
