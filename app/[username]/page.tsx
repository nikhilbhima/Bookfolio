"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PublicProfileView } from "@/components/public-profile-view";
import { PublicNav } from "@/components/public-nav";
import { Book, UserProfile } from "@/lib/mock-data";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const loadPublicProfile = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/profile/${username}`);

        if (!response.ok) {
          throw new Error("Profile not found");
        }

        const data = await response.json();
        setProfileData(data.profile);
        setBooks(data.books);
      } catch (error) {
        console.error("Error loading public profile:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadPublicProfile();
    }
  }, [username, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <PublicNav />
      <PublicProfileView profile={profileData} books={books} />
    </div>
  );
}
