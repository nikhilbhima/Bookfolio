"use client";

import { useState, useEffect } from "react";
import { X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstallInstructionsModal } from "@/components/install-instructions-modal";

export function InstallAppBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    if (!checkMobile) return;

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    // Check if banner was dismissed
    const dismissed = localStorage.getItem("installBannerDismissed");
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Show banner if never dismissed or dismissed more than 7 days ago
    if (!dismissed || (dismissedDate && dismissedDate < sevenDaysAgo)) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("installBannerDismissed", new Date().toISOString());
  };

  const handleGetApp = () => {
    setShowModal(true);
  };

  if (!isVisible || !isMobile) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-1">
            <Smartphone className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Get the Bookfolio app</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleGetApp}
              className="text-xs px-3 py-1 h-7"
            >
              Install
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add padding to body to prevent content from being hidden under banner */}
      <div className="h-[42px]" />

      <InstallInstructionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
