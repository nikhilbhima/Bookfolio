"use client";

import { useState, useRef } from "react";
import { Edit, Camera } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { UserProfile } from "@/lib/mock-data";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EditProfileModal } from "./edit-profile-modal";
import { ImageCropModal } from "./image-crop-modal";
import { getPlatformById, buildSocialUrl } from "@/lib/social-platforms";

interface ProfileCardProps {
  profile?: UserProfile;
  isPublic?: boolean;
}

export function ProfileCard({ profile: propProfile, isPublic = false }: ProfileCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeProfile = useBookStore((state) => state.profile);
  const updateProfile = useBookStore((state) => state.updateProfile);

  const profile = propProfile || storeProfile;

  const handleProfilePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    updateProfile({ profilePhoto: croppedImage });
  };

  return (
    <>
      <Card className="p-5 sm:p-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Profile Photo */}
          <div
            className={`relative ${!isPublic ? "cursor-pointer" : ""} group`}
            onMouseEnter={() => !isPublic && setIsAvatarHovered(true)}
            onMouseLeave={() => !isPublic && setIsAvatarHovered(false)}
            onClick={!isPublic ? handleProfilePhotoClick : undefined}
          >
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-border">
              <AvatarImage src={profile.profilePhoto || undefined} alt={profile.name} />
              <AvatarFallback>{profile.name?.charAt(0) || profile.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            {!isPublic && isAvatarHovered && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-all">
                <Camera className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Hidden file input */}
          {!isPublic && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          )}

          {/* Profile Info */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-serif font-semibold truncate">
                  {profile.name}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  @{profile.username}
                </p>
              </div>
              {!isPublic && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  className="gap-2 ml-2 shrink-0"
                >
                  <Edit className="w-3 h-3" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
              )}
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

      {!isPublic && (
        <>
          <EditProfileModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
          />

          <ImageCropModal
            isOpen={isCropModalOpen}
            onClose={() => setIsCropModalOpen(false)}
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
          />
        </>
      )}
    </>
  );
}
