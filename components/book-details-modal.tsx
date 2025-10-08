"use client";

import { Book } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { StarRating } from "./star-rating";
import { Calendar, BookOpen, Tag, Clock, X } from "lucide-react";
import Image from "next/image";

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  isPublic?: boolean;
}

export function BookDetailsModal({
  book,
  isOpen,
  onClose,
  onEdit,
  isPublic = false,
}: BookDetailsModalProps) {
  if (!book) return null;

  const statusColors = {
    reading: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    "to-read": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  const statusLabels = {
    reading: "Currently Reading",
    completed: "Completed",
    "to-read": "To Read",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }} modal={true}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        showCloseButton={true}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          onClose();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Book Details</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-[200px_1fr] gap-6 mt-2">
          {/* Book Cover */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-[120px] md:max-w-[200px] aspect-[2/3] rounded-lg overflow-hidden bg-secondary/50 border border-border">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Book Information */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
                {book.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {book.author}
              </p>
            </div>

            {/* Rating */}
            {book.rating > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={book.rating} readonly size="lg" />
                <span className="text-sm font-semibold text-muted-foreground">
                  {book.rating.toFixed(1)} / 5.0
                </span>
              </div>
            )}

            {/* Status Badge */}
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  statusColors[book.status]
                }`}
              >
                {statusLabels[book.status]}
              </span>
            </div>

            {/* Metadata Grid */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {book.genre && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{book.genre}</span>
                </div>
              )}

              {book.dateStarted && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium">
                    {new Date(book.dateStarted).toLocaleDateString()}
                  </span>
                </div>
              )}

              {book.dateFinished && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Finished:</span>
                  <span className="font-medium">
                    {new Date(book.dateFinished).toLocaleDateString()}
                  </span>
                </div>
              )}

              {book.pages && (
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Pages:</span>
                  <span className="font-medium">{book.pages}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {book.notes && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                  Notes
                </h3>
                <p className="text-sm leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border">
                  {book.notes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {onEdit && (
              <div className="flex flex-wrap gap-2 pt-4">
                <Button onClick={onEdit} variant="default">
                  Edit Book
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
