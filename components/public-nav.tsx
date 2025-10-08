"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

interface PublicNavProps {
  username?: string;
}

export function PublicNav(_props: PublicNavProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo & Username */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <rect width="32" height="32" rx="7" fill="url(#logo-gradient)" />
                <rect x="6" y="10" width="11" height="15" rx="3.5" fill="white" opacity="0.95" />
                <rect x="18" y="7" width="8" height="8" rx="2.5" fill="#ff8a80" opacity="0.9" />
                <rect x="18" y="17" width="8" height="8" rx="2.5" fill="#69f0ae" opacity="0.85" />
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" />
                    <stop offset="0.5" stopColor="#2563eb" />
                    <stop offset="1" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-base sm:text-lg font-serif font-semibold">
              Bookfolio
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/"
              className="relative overflow-hidden px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-[#3b82f6]/20 to-pink-500/20 border border-[#3b82f6]/40 hover:border-[#3b82f6]/60 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">
                <span className="hidden sm:inline">Create Your Bookfolio</span>
                <span className="sm:hidden">Create</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/0 via-[#3b82f6]/20 to-[#3b82f6]/0 animate-shimmer" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
