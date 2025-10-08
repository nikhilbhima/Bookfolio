"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check, Copy } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export function ShareModal({ isOpen, onClose, username }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-2 border-blue-500/50 dark:shadow-[0_0_20px_rgba(59,130,246,0.3)] shadow-[0_0_15px_rgba(59,130,246,0.15)]">
        <DialogHeader>
          <DialogTitle>Share your Bookfolio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Your custom URL
            </label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopy}
                variant={copied ? "default" : "outline"}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Share this link with anyone to showcase your book collection
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
