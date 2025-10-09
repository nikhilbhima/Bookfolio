# 📚 Bookfolio

**Your BookShelf, Beautifully _Online_.**

Track your books and share your reading journey with the world.

🌐 **Live Site:** [bookfolio.me](https://www.bookfolio.me)

## ✨ Features

- 📖 **Track Your Books** - Keep a record of every book you've read, are reading, or want to read
- 🌐 **Share Your Journey** - Showcase your collection and reading progress with a public profile
- ✨ **Discover & Organize** - Organize by genre, status, or rating with powerful filters
- 🔍 **Book Search** - Search millions of books via Google Books API and OpenLibrary
- 🌓 **Dark Mode** - Beautiful dark and light themes
- 📱 **Mobile-First** - Fully responsive design with touch-optimized scrolling
- 👤 **User Profiles** - Customizable profiles with social links and favorite genres
- ⭐ **Book Ratings** - Rate and review your books with notes

## 🚀 Tech Stack

- **Framework:** [Next.js 15.5.4](https://nextjs.org) with App Router & Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth with Google OAuth
- **State Management:** Zustand
- **Deployment:** Vercel
- **APIs:** Google Books API, OpenLibrary API

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Books API key (optional, for book search)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nikhilbhima/bookfolio.git
cd bookfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Books API (optional)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key

# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

Create the following tables in your Supabase database:

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

## 📦 Build & Deploy

Build for production:
```bash
npm run build
```

Deploy to Vercel:
```bash
vercel --prod
```

## 🎨 Project Structure

```
bookfolio/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── [username]/       # Public profile pages
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Feature components
├── lib/                   # Utility functions
│   ├── database.ts       # Database operations
│   ├── supabase.ts       # Supabase client
│   └── store.ts          # Zustand store
└── public/               # Static assets
```

## 🔒 Security

- Row Level Security (RLS) policies configured in Supabase
- Server-side authentication checks
- Environment variables for sensitive data
- HTTPS-only in production

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Nikhil Bhima**
- Twitter: [@nikhilbhima](https://x.com/nikhilbhima)
- GitHub: [@nikhilbhima](https://github.com/nikhilbhima)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/nikhilbhima/bookfolio/issues).

---

Built with ❤️ using Next.js and Supabase
