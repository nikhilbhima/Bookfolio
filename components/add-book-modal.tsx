"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Search, Loader2 } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { Book } from "@/lib/mock-data";
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

interface SearchResult {
  id: string;
  title: string;
  author: string;
  cover: string;
  coverLarge: string;
  genre: string;
  description: string;
  isbn: string;
  publishedDate: string;
  pageCount: number;
  source: string;
}

export function AddBookModal({ isOpen, onClose, bookToEdit }: AddBookModalProps) {
  const addBook = useBookStore((state) => state.addBook);
  const updateBook = useBookStore((state) => state.updateBook);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"search" | "manual">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(bookToEdit?.cover || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: bookToEdit?.title || "",
    author: bookToEdit?.author || "",
    cover: bookToEdit?.cover || "",
    genre: bookToEdit?.genre || "",
    rating: bookToEdit?.rating || 0,
    status: bookToEdit?.status || "to-read",
    notes: bookToEdit?.notes || "",
  });

  // Search books with debounce
  useEffect(() => {
    if (mode !== "search" || !searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, mode]);

  const handleSelectBook = (book: SearchResult) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      cover: book.coverLarge || book.cover,
      genre: book.genre,
      rating: 0,
      status: "to-read",
      notes: "",
    });
    setCoverPreview(book.coverLarge || book.cover);
    setSearchQuery("");
    setSearchResults([]);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        cover: formData.cover || "https://via.placeholder.com/300x450?text=No+Cover",
        genre: formData.genre?.trim() || "",
        rating: formData.rating,
        status: formData.status as "reading" | "completed" | "to-read",
        notes: formData.notes?.trim() || "",
        customOrder: 0,
      };

      if (bookToEdit) {
        await updateBook(bookToEdit.id, bookData);
      } else {
        await addBook(bookData);
      }

      // Reset and close
      setFormData({
        title: "",
        author: "",
        cover: "",
        genre: "",
        rating: 0,
        status: "to-read",
        notes: "",
      });
      setCoverPreview(null);
      setSelectedBook(null);
      setSearchQuery("");
      setSearchResults([]);
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Failed to save book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      author: "",
      cover: "",
      genre: "",
      rating: 0,
      status: "to-read",
      notes: "",
    });
    setCoverPreview(null);
    setSelectedBook(null);
    setSearchQuery("");
    setSearchResults([]);
    setMode("search");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bookToEdit ? "Edit Book" : "Add Book"}</DialogTitle>
        </DialogHeader>

        {!bookToEdit && (
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={mode === "search" ? "default" : "outline"}
              onClick={() => setMode("search")}
              className="flex-1"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Books
            </Button>
            <Button
              type="button"
              variant={mode === "manual" ? "default" : "outline"}
              onClick={() => setMode("manual")}
              className="flex-1"
            >
              Manual Entry
            </Button>
          </div>
        )}

        {mode === "search" && !bookToEdit && !selectedBook && (
          <div className="space-y-4">
            <div>
              <Label>Search for a book</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter book title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {searchResults.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleSelectBook(book)}
                    className="flex gap-3 p-3 border rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    {book.cover ? (
                      <Image
                        src={book.cover}
                        alt={book.title}
                        width={60}
                        height={90}
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-[60px] h-[90px] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        No Cover
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{book.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                      {book.genre && (
                        <p className="text-xs text-muted-foreground mt-1">{book.genre}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No books found. Try a different search or use manual entry.
              </div>
            )}
          </div>
        )}

        {(mode === "manual" || bookToEdit || selectedBook) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Cover */}
              <div className="space-y-4">
                <div>
                  <Label>Book Cover</Label>
                  <div className="mt-2 flex flex-col items-center gap-3">
                    {coverPreview ? (
                      <div className="relative">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          width={200}
                          height={300}
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveCover}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-[200px] h-[300px] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                        No cover
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Cover
                      </Button>
                      {selectedBook && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBook(null);
                            setFormData({
                              title: "",
                              author: "",
                              cover: "",
                              genre: "",
                              rating: 0,
                              status: "to-read",
                              notes: "",
                            });
                            setCoverPreview(null);
                          }}
                        >
                          Clear Selection
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="e.g., Fiction, Mystery, Biography"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-read">To Read</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Your Rating</Label>
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={(rating) => setFormData({ ...formData, rating })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Your thoughts, favorite quotes, or anything else..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{bookToEdit ? "Update" : "Add"} Book</>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
