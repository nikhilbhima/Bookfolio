import Link from "next/link";
import { PublicNav } from "@/components/public-nav";
import { PublicProfileCard } from "@/components/public-profile-card";
import { PublicStatsBoxes } from "@/components/public-stats-boxes";
import { PublicBooksGrid } from "@/components/public-books-grid";

export default function PreviewPage() {
  return (
    <div className="min-h-screen">
      <PublicNav />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Profile Section */}
        <div className="max-w-4xl mx-auto">
          <PublicProfileCard />
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto">
          <PublicStatsBoxes />
        </div>

        {/* Books Section */}
        <div className="max-w-7xl mx-auto space-y-6">
          <PublicBooksGrid />
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto pt-8 pb-12">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 text-lg font-serif rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-400 hover:bg-blue-500/25 hover:border-blue-500/60 transition-all glow-blue-hover"
            >
              Create your Bookfolio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
