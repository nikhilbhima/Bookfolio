# Bookfolio

**Your BookShelf, Beautifully Online.**

A web app for tracking your reading history and sharing your book collection with the world.

Live at [bookfolio.me](https://www.bookfolio.me)

## Features

- Track books you've read, are reading, or want to read
- Share your collection via a public profile page
- Search millions of books using Google Books and OpenLibrary APIs
- Organize books by genre, status, or rating
- Drag and drop to reorder your book collection (desktop: click & drag, mobile: 1.5s hold & drag)
- Dark and light theme support
- Fully responsive mobile design
- **Progressive Web App (PWA)** - Install on iOS and Android for app-like experience
- Customizable user profiles with social links

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Zustand for state management
- Native HTML5 drag-and-drop with touch support
- PWA with service worker and offline support
- Deployed on Vercel

## Setup

### Prerequisites

- Node.js 18+
- Supabase account
- Google Books API key (optional)

### Installation

```bash
git clone https://github.com/nikhilbhima/bookfolio.git
cd bookfolio
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### Database Schema

**profiles table:**
```sql
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  username text unique not null,
  name text,
  bio text,
  profile_photo text,
  favorite_genres text[],
  social_links jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**books table:**
```sql
create table books (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  author text not null,
  cover text,
  genre text,
  rating integer,
  status text not null,
  notes text,
  pages integer,
  date_started date,
  date_finished date,
  custom_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
```

## Project Structure

```
bookfolio/
├── app/                    # Next.js pages and routes
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Authentication pages
│   └── [username]/       # Public profile pages
├── components/            # React components
├── lib/                   # Database and utilities
└── public/               # Static assets
```

## Security

- Row Level Security enabled in Supabase
- Server-side authentication checks
- Environment variables for sensitive data
- HTTPS in production

## Author

Nikhil Bhima
- [Twitter/X](https://x.com/nikhilbhima)
- [GitHub](https://github.com/nikhilbhima)

## Contributing

Contributions and feature requests welcome. Open an issue or submit a PR.
