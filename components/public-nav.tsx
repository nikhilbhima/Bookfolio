"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

interface PublicNavProps {
  username?: string;
}

export function PublicNav(_props: PublicNavProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Logo className="text-base sm:text-lg" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/"
              className="relative overflow-hidden px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-[#3b82f6]/20 to-pink-500/20 border border-[#3b82f6]/40 hover:border-[#3b82f6]/60 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">
                Create Your Bookfolio
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/0 via-[#3b82f6]/20 to-[#3b82f6]/0 animate-shimmer" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
