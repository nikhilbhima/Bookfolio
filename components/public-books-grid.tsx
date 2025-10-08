"use client";

import { useState } from "react";
import { useBookStore } from "@/lib/store";
import { PublicBookCard } from "./public-book-card";
import { BookDetailsModal } from "./book-details-modal";
import { Book } from "@/lib/mock-data";

export function PublicBooksGrid() {
  const books = useBookStore((state) => state.books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Book Collection</h3>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books in collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <PublicBookCard
                key={book.id}
                book={book}
                onClick={() => handleBookClick(book)}
              />
            ))}
          </div>
        )}
      </div>

      <BookDetailsModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </>
  );
}
