"use client";

import React, { useState } from "react";
import { Edit, Trash2, Maximize2 } from "lucide-react";
import { Book } from "@/lib/mock-data";
import { useBookStore } from "@/lib/store";
import { Card } from "./ui/card";
import { StarRating } from "./star-rating";
import { AddBookModal } from "./add-book-modal";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { BookDetailsModal } from "./book-details-modal";
import { Checkbox } from "./ui/checkbox";
import Image from "next/image";

interface BookCardProps {
  book: Book;
  view: "grid" | "list";
  isPublic?: boolean;
  isMoveMode?: boolean;
}

export function BookCard({ book, view, isPublic = false, isMoveMode = false }: BookCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<'edit' | 'delete' | null>(null);
  const filter = useBookStore((state) => state.filter);
  const selectionMode = useBookStore((state) => state.selectionMode);
  const selectedBooks = useBookStore((state) => state.selectedBooks);
  const toggleSelection = useBookStore((state) => state.toggleSelection);
  const setSelectionMode = useBookStore((state) => state.setSelectionMode);

  const isSelected = selectedBooks.has(book.id);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectionMode) {
      setSelectionMode(true);
    }
    toggleSelection(book.id);
  };

  // Add effect to close buttons when clicking outside on mobile
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (isHovered && window.innerWidth < 640) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-book-card-content]')) {
          setIsHovered(false);
        }
      }
    };

    if (isHovered) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isHovered]);

  const statusColors = {
    reading: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    "to-read": "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300",
  };

  const statusLabels = {
    reading: "Reading",
    completed: "Completed",
    "to-read": "To Read",
  };

  if (view === "list") {
    return (
      <>
        <Card
          className={`group relative overflow-hidden hover:shadow-md transition-all ${
            hoveredButton === 'edit' ? 'ring-2 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
            hoveredButton === 'delete' ? 'ring-2 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setHoveredButton(null);
          }}
        >
          <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 cursor-pointer" onClick={(e) => {
            if (!(e.target as HTMLElement).closest('button')) {
              setIsDetailsOpen(true);
            }
          }}>
            <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
              {!imageError ? (
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] sm:text-xs text-muted-foreground">
                  No Cover
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">{book.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {book.author}
              </p>
              {book.genre && (
                <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">
                  {book.genre}
                </p>
              )}
            </div>

            {book.rating > 0 && (
              <div className="hidden sm:flex flex-shrink-0">
                <StarRating rating={book.rating} readonly size="sm" />
              </div>
            )}

            {filter === "all" && (
              <div className="flex-shrink-0">
                <span
                  className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full border ${
                    statusColors[book.status]
                  }`}
                >
                  {statusLabels[book.status]}
                </span>
              </div>
            )}

            {isHovered && (
              <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setIsEditOpen(true)}
                  onMouseEnter={() => setHoveredButton('edit')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="p-1.5 sm:p-2 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-400 hover:bg-blue-500/25 hover:border-blue-500/60 transition-all glow-blue-hover"
                >
                  <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  onClick={() => setIsDeleteOpen(true)}
                  onMouseEnter={() => setHoveredButton('delete')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="p-1.5 sm:p-2 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25 hover:border-red-500/60 transition-all"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            )}
          </div>
        </Card>

        {isDetailsOpen && (
          <BookDetailsModal
            key={book.id}
            book={book}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            onEdit={!isPublic ? () => {
              setIsDetailsOpen(false);
              setIsEditOpen(true);
            } : undefined}
            isPublic={isPublic}
          />
        )}

        <AddBookModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          bookToEdit={book}
        />

        <DeleteConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          bookId={book.id}
          bookTitle={book.title}
        />
      </>
    );
  }

  // Grid View
  return (
    <>
      <Card
        data-book-card-content
        className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${
          hoveredButton === 'edit' ? 'ring-2 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
          hoveredButton === 'delete' ? 'ring-2 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''
        } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isMoveMode ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredButton(null);
        }}
      >
        {!isPublic && (isHovered || selectionMode || isSelected) && (
          <div
            className="absolute top-2 left-2 z-10"
            onClick={handleCheckboxClick}
          >
            <Checkbox
              checked={isSelected}
              className="bg-background/90 backdrop-blur-sm border-2"
            />
          </div>
        )}


        <div
          className="relative aspect-[2/3] bg-muted cursor-pointer overflow-hidden rounded-t-lg"
          onClick={(e) => {
            // Don't handle if clicking on a button - let button handle it
            const target = e.target as HTMLElement;
            if (target.closest('button') || target.closest('[role="checkbox"]')) {
              return;
            }
            // On mobile, first tap shows buttons, second tap opens details
            if (window.innerWidth < 640) { // sm breakpoint
              if (!isHovered) {
                setIsHovered(true);
                return;
              }
            }
            setIsDetailsOpen(true);
          }}
        >
          {!imageError ? (
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Cover
            </div>
          )}

          {isHovered && !isPublic && (
            <div className="absolute inset-0 bg-black/60 items-center justify-center gap-3 transition-all hidden sm:flex">
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
                onMouseEnter={() => setHoveredButton('edit')}
                onMouseLeave={() => setHoveredButton(null)}
                className="p-3 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-400 hover:bg-blue-500/25 hover:border-blue-500/60 transition-all glow-blue-hover pointer-events-auto"
              >
                <Edit className="w-4 h-4 pointer-events-none" />
              </button>
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteOpen(true);
                }}
                onMouseEnter={() => setHoveredButton('delete')}
                onMouseLeave={() => setHoveredButton(null)}
                className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25 hover:border-red-500/60 transition-all pointer-events-auto"
              >
                <Trash2 className="w-4 h-4 pointer-events-none" />
              </button>
            </div>
          )}

          {isHovered && !isPublic && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 sm:hidden">
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
                className="flex-1 p-2 rounded-lg bg-blue-500/90 backdrop-blur-sm border border-blue-400/60 text-white hover:bg-blue-600 transition-all shadow-lg pointer-events-auto"
              >
                <Edit className="w-3.5 h-3.5 mx-auto pointer-events-none" />
              </button>
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteOpen(true);
                }}
                className="flex-1 p-2 rounded-lg bg-red-500/90 backdrop-blur-sm border border-red-400/60 text-white hover:bg-red-600 transition-all shadow-lg pointer-events-auto"
              >
                <Trash2 className="w-3.5 h-3.5 mx-auto pointer-events-none" />
              </button>
            </div>
          )}

          {isHovered && isPublic && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all">
              <div className="p-4 rounded-full bg-white/20 border border-white/40 text-white">
                <Maximize2 className="w-6 h-6" />
              </div>
            </div>
          )}

          {filter === "all" && (
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-0.5 text-xs rounded-full border backdrop-blur-sm ${
                  statusColors[book.status]
                }`}
              >
                {statusLabels[book.status]}
              </span>
            </div>
          )}
        </div>

        <div className="p-3 cursor-pointer" onClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) {
            setIsDetailsOpen(true);
          }
        }}>
          <h3 className="font-semibold text-sm truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate" title={book.author}>
            {book.author}
          </p>
          {book.rating > 0 && (
            <div className="mt-2">
              <StarRating rating={book.rating} readonly size="sm" />
            </div>
          )}
        </div>
      </Card>

      {isDetailsOpen && (
        <BookDetailsModal
          key={book.id}
          book={book}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onEdit={!isPublic ? () => {
            setIsDetailsOpen(false);
            setIsEditOpen(true);
          } : undefined}
          isPublic={isPublic}
        />
      )}

      <AddBookModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        bookToEdit={book}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        bookId={book.id}
        bookTitle={book.title}
      />
    </>
  );
}
