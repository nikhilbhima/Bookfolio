"use client";

import { Star } from "lucide-react";
import { useState, useRef } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || !onRatingChange) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const starWidth = rect.width / 5;
    const starIndex = Math.floor(x / starWidth);
    const positionInStar = (x % starWidth) / starWidth;

    // If in left half of star, use .5, if in right half use full star
    const newRating = starIndex + (positionInStar > 0.5 ? 1 : 0.5);
    const clampedRating = Math.max(0.5, Math.min(5, newRating));

    setHoverRating(clampedRating);
  };

  const handleClick = () => {
    if (readonly || !onRatingChange || hoverRating === null) return;
    onRatingChange(hoverRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-2">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`flex items-center gap-0.5 ${
          readonly ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = displayRating >= star;
          const isHalf = displayRating >= star - 0.5 && displayRating < star;

          return (
            <div
              key={star}
              className={`relative ${
                !readonly && "hover:scale-110"
              } transition-transform`}
            >
              <Star
                className={`${sizes[size]} ${
                  isFull || isHalf
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40"
                }`}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={`${sizes[size]} fill-amber-400 text-amber-400`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!readonly && hoverRating !== null && (
        <span className="text-xs text-muted-foreground font-medium min-w-[2rem]">
          {hoverRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
