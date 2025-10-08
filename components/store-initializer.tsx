"use client";

import { useEffect } from "react";
import { useBookStore } from "@/lib/store";

export function StoreInitializer() {
  const initialize = useBookStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
