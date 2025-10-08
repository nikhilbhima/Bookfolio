"use client";

import { useBookStore } from "@/lib/store";
import { Card } from "./ui/card";
import { BookOpen, BookMarked, CheckCircle2, Clock } from "lucide-react";

export function PublicStatsBoxes() {
  const books = useBookStore((state) => state.books);

  const stats = {
    all: books.length,
    reading: books.filter((b) => b.status === "reading").length,
    completed: books.filter((b) => b.status === "completed").length,
    toRead: books.filter((b) => b.status === "to-read").length,
  };

  const statItems = [
    {
      label: "All Books",
      value: stats.all,
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      label: "Currently Reading",
      value: stats.reading,
      icon: BookMarked,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
    {
      label: "To Read",
      value: stats.toRead,
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label} className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${item.bgColor} border ${item.borderColor}`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.label}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
