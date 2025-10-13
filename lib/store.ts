import { create } from "zustand";
import { Book, UserProfile, mockProfile } from "./mock-data";
import * as db from "./database";

interface BookStore {
  books: Book[];
  profile: UserProfile;
  filter: "all" | "reading" | "completed" | "to-read";
  view: "grid" | "list";
  searchQuery: string;
  sortBy: "newest" | "a-z" | "z-a" | "rating-high" | "rating-low";
  isLoading: boolean;
  initialized: boolean;
  selectedBooks: Set<string>;
  selectionMode: boolean;

  // Data loading
  loadBooks: () => Promise<void>;
  loadProfile: () => Promise<void>;
  initialize: () => Promise<void>;

  // UI actions
  setFilter: (filter: "all" | "reading" | "completed" | "to-read") => void;
  setView: (view: "grid" | "list") => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: "newest" | "a-z" | "z-a" | "rating-high" | "rating-low") => void;

  // Selection actions
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setSelectionMode: (mode: boolean) => void;
  deleteSelected: () => Promise<void>;
  moveSelected: (status: "reading" | "completed" | "to-read") => Promise<void>;

  // Book actions (now async with database)
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  reorderBooks: (books: Book[]) => Promise<void>;

  getFilteredBooks: () => Book[];
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  profile: mockProfile, // Will be loaded from DB
  filter: "all",
  view: "grid",
  searchQuery: "",
  sortBy: "newest",
  isLoading: false,
  initialized: false,
  selectedBooks: new Set(),
  selectionMode: false,

  initialize: async () => {
    const { initialized } = get();
    if (initialized) return;

    set({ isLoading: true });

    try {
      // Load both profile and books, then update state once
      const [profile, books] = await Promise.all([
        db.getProfile(),
        db.getBooks()
      ]);

      set({
        profile: profile || get().profile,
        books,
        isLoading: false,
        initialized: true
      });
    } catch (error) {
      console.error('[STORE] Initialization error:', error);
      set({ isLoading: false, initialized: true });
    }
  },

  loadBooks: async () => {
    const books = await db.getBooks();
    set({ books });
  },

  loadProfile: async () => {
    const profile = await db.getProfile();
    if (profile) {
      set({ profile });
    }
  },

  setFilter: (filter) => set({ filter }),
  setView: (view) => set({ view }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),

  toggleSelection: (id) => set((state) => {
    const newSelected = new Set(state.selectedBooks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    return { selectedBooks: newSelected };
  }),

  selectAll: () => set((state) => ({
    selectedBooks: new Set(state.getFilteredBooks().map(b => b.id))
  })),

  clearSelection: () => set({ selectedBooks: new Set(), selectionMode: false }),

  setSelectionMode: (mode) => set({
    selectionMode: mode,
    selectedBooks: mode ? get().selectedBooks : new Set()
  }),

  deleteSelected: async () => {
    const { selectedBooks } = get();
    await Promise.all(
      Array.from(selectedBooks).map(id => db.deleteBook(id))
    );
    await get().loadBooks();
    set({ selectedBooks: new Set(), selectionMode: false });
  },

  moveSelected: async (status) => {
    const { selectedBooks } = get();
    await Promise.all(
      Array.from(selectedBooks).map(id => db.updateBook(id, { status }))
    );
    await get().loadBooks();
    set({ selectedBooks: new Set(), selectionMode: false });
  },

  addBook: async (book) => {
    try {
      const newBook = await db.createBook(book);
      set((state) => ({ books: [newBook, ...state.books] }));
    } catch (error) {
      console.error('[STORE] Failed to create book:', error);
      throw error; // Re-throw to let the UI handle it
    }
  },

  updateBook: async (id, updates) => {
    const updatedBook = await db.updateBook(id, updates);
    if (updatedBook) {
      set((state) => ({
        books: state.books.map((book) =>
          book.id === id ? updatedBook : book
        ),
      }));
    }
  },

  deleteBook: async (id) => {
    const success = await db.deleteBook(id);
    if (success) {
      set((state) => ({
        books: state.books.filter((book) => book.id !== id),
      }));
    }
  },

  updateProfile: async (updates) => {
    const updated = await db.updateProfile(updates);
    if (updated) {
      set({ profile: updated });
    }
  },

  reorderBooks: async (books) => {
    // Update local state immediately
    set({ books });

    // Update database with new order
    const updates = books.map((book, index) => ({
      id: book.id,
      customOrder: index,
    }));

    await db.updateBooksOrder(updates);
  },

  getFilteredBooks: () => {
    const { books, filter, searchQuery, sortBy } = get();

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
          book.genre?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  },
}));
