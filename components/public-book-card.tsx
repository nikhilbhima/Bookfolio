"use client";

import { useState } from "react";
import { Book } from "@/lib/mock-data";
import { Card } from "./ui/card";
import Image from "next/image";

interface PublicBookCardProps {
  book: Book;
  onClick: () => void;
}

export function PublicBookCard({ book, onClick }: PublicBookCardProps) {
  const [imageError, setImageError] = useState(false);

  const statusColors = {
    reading: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    "to-read": "border-blue-500/30 bg-blue-500/10 text-blue-300",
  };

  const statusLabels = {
    reading: "Reading",
    completed: "Completed",
    "to-read": "To Read",
  };

  return (
    <Card
      className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] bg-muted overflow-hidden">
        {!imageError ? (
          <>
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
            {/* Hide bottom-right fold from Google Books API */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-muted to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Cover
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-0.5 text-xs rounded-full border backdrop-blur-sm ${
              statusColors[book.status]
            }`}
          >
            {statusLabels[book.status]}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate" title={book.author}>
          {book.author}
        </p>
      </div>
    </Card>
  );
}
