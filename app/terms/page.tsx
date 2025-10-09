import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Acceptance of Terms</h2>
              <p>
                By accessing and using Bookfolio, you agree to be bound by these Terms of Use. If you
                do not agree with any part of these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">User Accounts</h2>
              <p className="mb-2">When you create an account, you agree to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not share your account with others</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Acceptable Use</h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Upload malicious code or attempt to compromise our systems</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Scrape or copy content without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Content Ownership</h2>
              <p>
                You retain ownership of the content you post on Bookfolio, including your book reviews
                and notes. By making your profile public, you grant us permission to display this
                content on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Service Availability</h2>
              <p>
                We strive to keep Bookfolio available at all times, but we do not guarantee
                uninterrupted access. We may modify, suspend, or discontinue any part of the service
                at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account if you violate these terms
                or engage in behavior that harms our service or other users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p>
                Bookfolio is provided as-is without warranties of any kind. We are not liable for any
                damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Changes to Terms</h2>
              <p>
                We may update these terms from time to time. We will notify users of significant
                changes through email or a notice on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact</h2>
              <p>
                Questions about these terms? Reach out to us on{" "}
                <a
                  href="https://x.com/nikhilbhima"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Twitter/X
                </a>.
              </p>
            </section>

            <section>
              <p className="text-sm">
                <strong>Last updated:</strong> October 2025
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Bookfolio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
