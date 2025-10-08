"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Logo } from "@/components/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex justify-center mb-2">
              <Logo />
            </Link>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
          </div>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-2">
            <Logo />
          </Link>
          <h1 className="text-2xl font-bold mt-4">Forgot Password?</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
