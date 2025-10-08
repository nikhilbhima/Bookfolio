"use client";

import { useState } from "react";
import { Book } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { StarRating } from "./star-rating";
import Image from "next/image";

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetailModal({
  book,
  isOpen,
  onClose,
}: BookDetailModalProps) {
  const [imageError, setImageError] = useState(false);

  if (!book) return null;

  const statusColors = {
    reading: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    "to-read": "border-blue-500/30 bg-blue-500/10 text-blue-300",
  };

  const statusLabels = {
    reading: "Currently Reading",
    completed: "Completed",
    "to-read": "To Read",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif sr-only">
            {book.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-[200px_1fr] gap-6 mt-4">
          {/* Book Cover */}
          <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mx-auto md:mx-0 w-full max-w-[200px]">
            {!imageError ? (
              <Image
                src={book.cover}
                alt={book.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Cover
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-1">
                {book.title}
              </h2>
              <p className="text-muted-foreground">by {book.author}</p>
            </div>

            {/* Status Badge */}
            <div>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full border ${
                  statusColors[book.status]
                }`}
              >
                {statusLabels[book.status]}
              </span>
            </div>

            {/* Genre */}
            {book.genre && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Genre
                </p>
                <p className="text-sm">{book.genre}</p>
              </div>
            )}

            {/* Rating */}
            {book.rating > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Rating
                </p>
                <StarRating rating={book.rating} readonly size="md" />
              </div>
            )}

            {/* Notes/Review */}
            {book.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Notes & Review
                </p>
                <p className="text-sm leading-relaxed">{book.notes}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
