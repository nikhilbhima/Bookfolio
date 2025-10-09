"use client";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
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

export function AddBookModal({ isOpen, onClose, bookToEdit }: AddBookModalProps) {
  const addBook = useBookStore((state) => state.addBook);
  const updateBook = useBookStore((state) => state.updateBook);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // Update existing book
        await updateBook(bookToEdit.id, bookData);
      } else {
        // Add new book
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
      onClose();
    } catch (error) {
      console.error('[MODAL] Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            {bookToEdit ? "Edit Book" : "Add Book"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Book Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter book title"
              required
              className="mt-1.5"
            />
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter author name"
              required
              className="mt-1.5"
            />
          </div>

          {/* Genre */}
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              placeholder="e.g. Fiction, Non-fiction, Mystery"
              className="mt-1.5"
            />
          </div>

          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            <div className="mt-1.5 space-y-3">
              {/* Cover Preview */}
              {(coverPreview || formData.cover) && (
                <div className="relative w-32 h-48 rounded-lg overflow-hidden bg-secondary/50 border border-border">
                  <Image
                    src={coverPreview || formData.cover}
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

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as "reading" | "completed" | "to-read" })
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

            {/* Rating */}
            <div>
              <Label>Rating</Label>
              <div className="mt-1.5">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) => setFormData({ ...formData, rating })}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes / Review</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Your thoughts about this book..."
              className="mt-1.5 min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : bookToEdit ? "Save Changes" : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
