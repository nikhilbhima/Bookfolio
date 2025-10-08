"use client";

import { useBookStore } from "@/lib/store";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getPlatformById, buildSocialUrl } from "@/lib/social-platforms";

export function PublicProfileCard() {
  const profile = useBookStore((state) => state.profile);

  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        {/* Profile Photo */}
        <Avatar className="w-24 h-24 border-2 border-border">
          <AvatarImage src={profile.profilePhoto} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h2 className="text-2xl font-serif font-semibold">
              {profile.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              @{profile.username}
            </p>
          </div>

          <p className="text-sm text-foreground mb-3 leading-relaxed">
            {profile.bio}
          </p>

          {/* Favorite Genres */}
          {profile.favoriteGenres.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1.5">
                Favorite Genres
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2.5 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-3 flex-wrap">
            {profile.socialLinks.map((link) => {
              const platform = getPlatformById(link.platform);
              if (!platform || !link.value) return null;

              const Icon = platform.icon;
              const url = buildSocialUrl(platform, link.value);

              return (
                <a
                  key={link.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title={platform.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
