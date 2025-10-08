"use client";

import { useBookStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  bookId,
  bookTitle,
}: DeleteConfirmDialogProps) {
  const deleteBook = useBookStore((state) => state.deleteBook);

  const handleDelete = () => {
    deleteBook(bookId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Book?</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete <strong>{bookTitle}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
