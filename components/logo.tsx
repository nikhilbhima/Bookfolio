export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background rounded square */}
          <rect
            width="32"
            height="32"
            rx="7"
            fill="url(#logo-gradient)"
          />

          {/* Large white book shape (left side) */}
          <rect
            x="6"
            y="10"
            width="11"
            height="15"
            rx="3.5"
            fill="white"
            opacity="0.95"
          />

          {/* Small coral bookmark (top right) */}
          <rect
            x="18"
            y="7"
            width="8"
            height="8"
            rx="2.5"
            fill="#ff8a80"
            opacity="0.9"
          />

          {/* Medium green accent (bottom right) */}
          <rect
            x="18"
            y="17"
            width="8"
            height="8"
            rx="2.5"
            fill="#69f0ae"
            opacity="0.85"
          />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="logo-gradient"
              x1="0"
              y1="0"
              x2="32"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3b82f6" />
              <stop offset="0.5" stopColor="#2563eb" />
              <stop offset="1" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-xl font-serif font-semibold">Bookfolio</span>
    </div>
  );
}
