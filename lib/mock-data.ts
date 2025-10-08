export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  status: "reading" | "completed" | "to-read";
  notes?: string;
  genre?: string;
  dateStarted?: string;
  dateFinished?: string;
  pages?: number;
  customOrder?: number;
}

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    rating: 4.5,
    status: "completed",
    genre: "Classic Fiction",
    notes: "A masterpiece of American literature. The symbolism is incredible.",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/id/7222284-L.jpg",
    rating: 5,
    status: "completed",
    genre: "Dystopian Fiction",
    notes: "Chilling and prophetic. A must-read for everyone.",
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    rating: 4.5,
    status: "completed",
    genre: "Classic Fiction",
    notes: "Beautiful story about justice and morality.",
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
    rating: 4,
    status: "reading",
    genre: "Fantasy",
    notes: "Currently on chapter 8. Loving the world-building!",
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://covers.openlibrary.org/b/id/8453956-L.jpg",
    rating: 4.5,
    status: "reading",
    genre: "Romance",
    notes: "Elizabeth Bennet is such a great character.",
  },
  {
    id: "6",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://covers.openlibrary.org/b/id/8290457-L.jpg",
    rating: 3.5,
    status: "completed",
    genre: "Classic Fiction",
  },
  {
    id: "7",
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://covers.openlibrary.org/b/id/8486089-L.jpg",
    rating: 0,
    status: "to-read",
    genre: "Science Fiction",
    notes: "Been on my list forever. Starting next month!",
  },
  {
    id: "8",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    cover: "https://covers.openlibrary.org/b/id/9255566-L.jpg",
    rating: 0,
    status: "to-read",
    genre: "Fantasy",
  },
  {
    id: "9",
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://covers.openlibrary.org/b/id/8814794-L.jpg",
    rating: 5,
    status: "completed",
    genre: "Self-Help",
    notes: "Life-changing! Implemented several habits from this book.",
  },
  {
    id: "10",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: "https://covers.openlibrary.org/b/id/8494810-L.jpg",
    rating: 4.5,
    status: "completed",
    genre: "Non-Fiction",
    notes: "Fascinating perspective on human history.",
  },
  {
    id: "11",
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://covers.openlibrary.org/b/id/10451392-L.jpg",
    rating: 4,
    status: "reading",
    genre: "Contemporary Fiction",
  },
  {
    id: "12",
    title: "Educated",
    author: "Tara Westover",
    cover: "https://covers.openlibrary.org/b/id/8357277-L.jpg",
    rating: 0,
    status: "to-read",
    genre: "Memoir",
  },
];

export interface SocialLink {
  platform: string;
  value: string;
  id: string;
}

export interface UserProfile {
  username: string;
  name: string;
  bio: string;
  favoriteGenres: string[];
  profilePhoto: string;
  socialLinks: SocialLink[];
}

export const mockProfile: UserProfile = {
  username: "bookworm_jane",
  name: "Jane Doe",
  bio: "Avid reader | Book reviewer | Coffee enthusiast ☕ | Currently reading my way through the classics",
  favoriteGenres: ["Classic Fiction", "Fantasy", "Science Fiction"],
  profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  socialLinks: [
    { id: "1", platform: "twitter", value: "bookworm_jane" },
    { id: "2", platform: "instagram", value: "bookworm_jane" },
    { id: "3", platform: "goodreads", value: "bookworm_jane" },
  ],
};
