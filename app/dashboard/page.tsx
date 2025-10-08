"use client";

import { useEffect, useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { ProfileCard } from "@/components/profile-card";
import { StatsBoxes } from "@/components/stats-boxes";
import { FiltersBar } from "@/components/filters-bar";
import { BooksGrid } from "@/components/books-grid";
import { ShareButton } from "@/components/share-button";
import { SelectionActionBar } from "@/components/selection-action-bar";
import { StoreInitializer } from "@/components/store-initializer";
import { ProfileSkeleton, StatsBoxesSkeleton, BookGridSkeleton } from "@/components/skeleton-loader";
import { useBookStore } from "@/lib/store";

export default function Home() {
  const isLoading = useBookStore((state) => state.isLoading);
  const [showSkeletons, setShowSkeletons] = useState(true);

  // Show skeletons for at least 500ms for better UX
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowSkeletons(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen">
      <StoreInitializer />
      <DashboardNav />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Profile Section */}
        <div className="max-w-4xl mx-auto">
          {showSkeletons ? <ProfileSkeleton /> : <ProfileCard />}
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto">
          {showSkeletons ? <StatsBoxesSkeleton /> : <StatsBoxes />}
        </div>

        {/* Filters and Books Section */}
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {!showSkeletons && <FiltersBar />}
          {showSkeletons ? <BookGridSkeleton /> : <BooksGrid />}
        </div>

        {/* CTA Section */}
        {!showSkeletons && (
          <div className="max-w-4xl mx-auto pt-6 sm:pt-8 pb-8 sm:pb-12">
            <div className="text-center">
              <ShareButton />
            </div>
          </div>
        )}
      </main>

      {/* Selection Action Bar */}
      <SelectionActionBar />
    </div>
  );
}
