"use client";

import { useEffect } from "react";
import { useBookStore } from "@/lib/store";

/**
 * Initializes the book store by loading user data and books
 * Note: Empty dependency array to run only once on mount
 */
export function StoreInitializer() {
  const initialize = useBookStore((state) => state.initialize);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
