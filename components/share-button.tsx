"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ShareModal } from "./share-modal";
import { useBookStore } from "@/lib/store";

export function ShareButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profile = useBookStore((state) => state.profile);

  return (
    <>
      <Button
        size="lg"
        onClick={() => setIsModalOpen(true)}
        className="relative overflow-hidden font-serif text-lg px-8 py-6 bg-gradient-to-r from-blue-500/20 to-pink-500/20 dark:from-blue-500/20 dark:to-pink-500/20 border border-blue-500/40 hover:border-blue-400/60 hover:scale-105 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-pink-500/20"
      >
        <span className="relative z-10 font-semibold text-foreground dark:text-white">
          Share your Bookfolio
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 animate-shimmer" />
      </Button>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        username={profile.username}
      />
    </>
  );
}
