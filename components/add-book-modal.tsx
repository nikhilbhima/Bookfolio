"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Upload, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { Book } from "@/lib/mock-data";
import { searchBooks, BookSearchResult } from "@/lib/book-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StarRating } from "./star-rating";
import Image from "next/image";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookToEdit?: Book;
}

export function AddBookModal({ isOpen, onClose, bookToEdit }: AddBookModalProps) {
  const addBook = useBookStore((state) => state.addBook);
  const updateBook = useBookStore((state) => state.updateBook);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showManualAdd, setShowManualAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12; // 4 per row × 3 rows
  const [formData, setFormData] = useState<Partial<Book>>({
    title: bookToEdit?.title || "",
    author: bookToEdit?.author || "",
    cover: bookToEdit?.cover || "",
    genre: bookToEdit?.genre || "",
    rating: bookToEdit?.rating || 0,
    status: bookToEdit?.status || "to-read",
    notes: bookToEdit?.notes || "",
  });

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverPreview(result);
        setFormData({ ...formData, cover: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setFormData({ ...formData, cover: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bookToEdit) {
      const bookData: Book = {
        id: bookToEdit.id,
        title: formData.title || "",
        author: formData.author || "",
        cover: formData.cover || "https://via.placeholder.com/300x450?text=No+Cover",
        genre: formData.genre,
        rating: formData.rating || 0,
        status: formData.status || "to-read",
        notes: formData.notes,
      };
      updateBook(bookToEdit.id, bookData);
    } else {
      const bookData: Omit<Book, 'id'> = {
        title: formData.title || "",
        author: formData.author || "",
        cover: formData.cover || "https://via.placeholder.com/300x450?text=No+Cover",
        genre: formData.genre,
        rating: formData.rating || 0,
        status: formData.status || "to-read",
        notes: formData.notes,
      };
      addBook(bookData);
    }

    // Reset form
    setFormData({
      title: "",
      author: "",
      cover: "",
      genre: "",
      rating: 0,
      status: "to-read",
      notes: "",
    });
    setSearchQuery("");
    setShowManualAdd(false);
    setCoverPreview(null);
    onClose();
  };

  // Effect to trigger search when query changes
  useEffect(() => {
    if (!searchQuery.trim() || bookToEdit) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setCurrentPage(1); // Reset to first page on new search
    setIsSearching(true);

    const timeoutId = setTimeout(async () => {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, bookToEdit]);

  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = searchResults.slice(startIndex, endIndex);

  // Handle selecting a book from search results
  const handleSelectBook = (book: BookSearchResult) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      cover: book.cover,
      genre: book.genre || "",
      rating: 0,
      status: "to-read",
      notes: "",
    });
    setSearchResults([]);
    setSearchQuery("");
    setShowManualAdd(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            {bookToEdit ? "Edit Book" : "Add Book"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search Bar */}
          {!bookToEdit && (
            <div>
              <Label>Search for a book</Label>
              <div className="relative mt-1.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                )}
              </div>

              {/* Search Results - Grid View */}
              {searchResults.length > 0 && (
                <div className="mt-3 border border-border rounded-lg p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {currentBooks.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => handleSelectBook(book)}
                        className="group relative flex flex-col gap-2 hover:scale-105 transition-transform text-left"
                      >
                        {/* Book Cover */}
                        <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-secondary/50 border border-border group-hover:border-primary/50 transition-colors">
                          {book.cover ? (
                            <Image
                              src={book.cover}
                              alt={book.title}
                              width={200}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No Cover
                            </div>
                          )}
                        </div>

                        {/* Book Info */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs line-clamp-2 leading-tight">
                            {book.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {book.author}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            type="button"
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="h-8 w-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Search Tip */}
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    💡 Add the book name along with author for best results
                  </p>
                </div>
              )}

              {/* No results message */}
              {searchQuery && !isSearching && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No books found. Try a different search or add manually.
                </p>
              )}
            </div>
          )}

          {/* Manual Add Collapsible */}
          {!bookToEdit && (
            <button
              type="button"
              onClick={() => setShowManualAdd(!showManualAdd)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showManualAdd ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Add manually
            </button>
          )}

          {/* Form */}
          {(showManualAdd || bookToEdit) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Book Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="The Great Gatsby"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="F. Scott Fitzgerald"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    placeholder="Classic Fiction"
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Cover Image</Label>
                  <div className="mt-1.5 space-y-3">
                    {/* Cover Preview */}
                    {(coverPreview || formData.cover) && (
                      <div className="relative w-32 h-48 rounded-lg overflow-hidden bg-secondary/50 border border-border">
                        <Image
                          src={coverPreview || formData.cover || ""}
                          alt="Book cover preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveCover}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </div>

                    {/* URL Input */}
                    <div className="text-sm text-muted-foreground">or</div>
                    <Input
                      id="cover"
                      value={coverPreview ? "" : formData.cover}
                      onChange={(e) => {
                        setCoverPreview(null);
                        setFormData({ ...formData, cover: e.target.value });
                      }}
                      placeholder="Paste image URL"
                      disabled={!!coverPreview}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, status: value as Book["status"] })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-read">To Read</SelectItem>
                      <SelectItem value="reading">Currently Reading</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rating</Label>
                  <div className="mt-1.5">
                    <StarRating
                      rating={formData.rating || 0}
                      onRatingChange={(rating) =>
                        setFormData({ ...formData, rating })
                      }
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">Notes / Review</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Your thoughts about this book..."
                    className="mt-1.5 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {bookToEdit ? "Save Changes" : "Add Book"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
