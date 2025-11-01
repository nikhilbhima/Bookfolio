import { z } from 'zod';

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens')
    .toLowerCase(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required').max(255),
  password: z.string().min(1, 'Password is required'),
});

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens')
    .toLowerCase(),
});

// Book validation schemas
export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  author: z.string().min(1, 'Author is required').max(200),
  cover: z.string().url().optional().or(z.literal('')),
  genre: z.string().max(50).optional(),
  rating: z.number().min(0).max(5).optional(),
  status: z.enum(['reading', 'completed', 'to-read']),
  notes: z.string().max(5000).optional(),
});

export const bookUpdateSchema = bookSchema.partial();

// Profile validation schemas
export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9_-]+$/)
    .toLowerCase()
    .optional(),
  name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  profilePhoto: z.string().url().max(2000).optional(),
  favoriteGenres: z.array(z.string().max(50)).max(20).optional(),
  socialLinks: z
    .array(
      z.object({
        id: z.string(),
        platform: z.string().max(50),
        value: z.string().max(200),
      })
    )
    .max(10)
    .optional(),
});

// Search validation
export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Query is required').max(200),
});

// Environment validation
export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GOOGLE_BOOKS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});
