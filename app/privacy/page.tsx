import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Introduction</h2>
            <p>
              At Bookfolio, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Account Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address</li>
              <li>Username</li>
              <li>Profile information (name, bio, profile photo)</li>
              <li>Social media links (if you choose to add them)</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Book Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Books you add to your collection</li>
              <li>Ratings and reviews</li>
              <li>Reading status and dates</li>
              <li>Personal notes about books</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain your Bookfolio account</li>
              <li>To display your public profile (if you choose to make it public)</li>
              <li>To improve our service and user experience</li>
              <li>To communicate with you about your account or service updates</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data Security</h2>
            <p>
              We use industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted connections (HTTPS)</li>
              <li>Secure authentication via Supabase</li>
              <li>Regular security updates and monitoring</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Update or correct your information</li>
              <li>Delete your account and associated data</li>
              <li>Control the visibility of your profile</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> For authentication and database storage</li>
              <li><strong>Open Library API:</strong> For book information and cover images</li>
              <li><strong>Google OAuth:</strong> For optional social login</li>
              <li><strong>Vercel:</strong> For hosting and deployment</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact</h2>
            <p>
              If you have questions about this privacy policy, contact us at:{" "}
              <a
                href="https://x.com/nikhilbhima"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @nikhilbhima
              </a>
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Bookfolio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
