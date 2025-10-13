"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PreviewDashboard } from "@/components/preview-dashboard";
import { createClient } from "@/lib/supabase";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // User is logged in, redirect to dashboard
        router.push("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs md:text-sm px-2 md:px-4">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-xs md:text-sm px-2 md:px-4">
                <span className="hidden sm:inline">Create Your Bookfolio</span>
                <span className="sm:hidden">Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Preview */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Neon Gradient Orbs - Dark Mode */}
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        </div>

        {/* Neon Gradient Orbs - Light Mode */}
        <div className="absolute inset-0 dark:hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/8 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>

        <div className="container mx-auto px-4 relative z-10 space-y-16">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight">
                <span className="block font-bold">Your BookShelf,</span>
                <span className="block font-serif">
                  Beautifully <span className="italic">Online</span>.
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track your books and share your reading journey with the world.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center items-center pt-1">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-base px-8 py-5 h-12 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 dark:from-blue-600 dark:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 text-white border-0 shadow-[0_8px_30px_rgb(29,78,216,0.4)] dark:shadow-[0_8px_30px_rgb(37,99,235,0.5)] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(29,78,216,0.5)] dark:hover:shadow-[0_12px_40px_rgb(37,99,235,0.6)] hover:scale-105 font-semibold"
                >
                  Create Your Bookfolio
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-base font-semibold mb-2">Track Your Books</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Keep a record of every book you&apos;ve read, are reading, or want to read.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className="text-base font-semibold mb-2">Share Your Journey</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Showcase your collection and reading progress with friends or the world.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-base font-semibold mb-2">Discover & Organize</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Easily organize your books by genre, status, or personal rating—your shelf, your way.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Preview Dashboard */}
          <div className="max-w-7xl mx-auto px-0 md:px-8 lg:px-16">
            <PreviewDashboard />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/feature-request" className="text-muted-foreground hover:text-foreground transition-colors">
                Feature Request
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Use
              </Link>
            </div>

            {/* Social */}
            <div className="flex justify-center mb-6">
              <a
                href="https://x.com/nikhilbhima"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                © 2025 Bookfolio. All rights reserved.
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70">
                <span>Built with</span>
                <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 509.64">
                  <path fill="#D77655" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.612-115.613 115.612H115.612C52.026 509.639 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/>
                  <path fill="#FCF2EE" fillRule="nonzero" d="M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z"/>
                </svg>
                <span>Claude Code</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
