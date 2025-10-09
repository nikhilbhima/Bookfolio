// Book search API utilities for Google Books and OpenLibrary

export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  cover: string;
  coverLarge?: string;
  genre?: string;
  description?: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  source: "google" | "openlibrary";
  ratingsCount?: number;
  averageRating?: number;
}

interface GoogleBooksVolumeInfo {
  title?: string;
  authors?: string[];
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  categories?: string[];
  description?: string;
  industryIdentifiers?: Array<{ type: string; identifier: string }>;
  publishedDate?: string;
  pageCount?: number;
  ratingsCount?: number;
  averageRating?: number;
}

interface GoogleBooksItem {
  id: string;
  volumeInfo: GoogleBooksVolumeInfo;
}

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  subject?: string[];
  isbn?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
}

/**
 * Search Google Books API
 */
export async function searchGoogleBooks(
  query: string
): Promise<BookSearchResult[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const apiKeyParam = apiKey ? `&key=${apiKey}` : "";

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=40&printType=books&orderBy=relevance${apiKeyParam}`
    );

    if (!response.ok) {
      throw new Error("Google Books API request failed");
    }

    const data = await response.json();

    if (!data.items) {
      return [];
    }

    return data.items.map((item: GoogleBooksItem) => {
      const volumeInfo = item.volumeInfo;
      const imageLinks = volumeInfo.imageLinks || {};

      // Get the highest quality cover available
      const cover =
        imageLinks.extraLarge ||
        imageLinks.large ||
        imageLinks.medium ||
        imageLinks.thumbnail ||
        imageLinks.smallThumbnail ||
        "";

      // Replace http with https and increase size
      // Remove edge=curl parameter to get covers without the page fold
      const secureCover = cover.replace("http://", "https://");
      const largeCover = secureCover
        .replace("&zoom=1", "&zoom=2")
        .replace("&edge=curl", "");

      return {
        id: item.id,
        title: volumeInfo.title || "Unknown Title",
        author:
          volumeInfo.authors?.join(", ") ||
          "Unknown Author",
        cover: largeCover,
        coverLarge: largeCover,
        genre: volumeInfo.categories?.[0] || "",
        description: volumeInfo.description || "",
        isbn:
          volumeInfo.industryIdentifiers?.find(
            (id) => id.type === "ISBN_13"
          )?.identifier ||
          volumeInfo.industryIdentifiers?.find(
            (id) => id.type === "ISBN_10"
          )?.identifier ||
          "",
        publishedDate: volumeInfo.publishedDate || "",
        pageCount: volumeInfo.pageCount || 0,
        source: "google" as const,
        ratingsCount: volumeInfo.ratingsCount || 0,
        averageRating: volumeInfo.averageRating || 0,
      };
    });
  } catch (error) {
    console.error("Google Books API error:", error);
    return [];
  }
}

/**
 * Search OpenLibrary API
 */
export async function searchOpenLibrary(
  query: string
): Promise<BookSearchResult[]> {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        query
      )}&limit=40&sort=editions`
    );

    if (!response.ok) {
      throw new Error("OpenLibrary API request failed");
    }

    const data = await response.json();

    if (!data.docs) {
      return [];
    }

    return data.docs.map((doc: OpenLibraryDoc) => {
      const coverId = doc.cover_i;
      const cover = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : "";

      return {
        id: doc.key || "",
        title: doc.title || "Unknown Title",
        author:
          doc.author_name?.join(", ") ||
          "Unknown Author",
        cover,
        coverLarge: cover,
        genre: doc.subject?.[0] || "",
        description: "",
        isbn: doc.isbn?.[0] || "",
        publishedDate: doc.first_publish_year?.toString() || "",
        pageCount: doc.number_of_pages_median || 0,
        source: "openlibrary" as const,
      };
    });
  } catch (error) {
    console.error("OpenLibrary API error:", error);
    return [];
  }
}

/**
 * Search books using secure server-side API route
 * This protects the API key from client-side exposure
 */
export async function searchBooks(
  query: string
): Promise<BookSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `/api/books/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Book search API request failed");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error("Book search error:", error);
    return [];
  }
}

/**
 * Debounce utility for search input
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
