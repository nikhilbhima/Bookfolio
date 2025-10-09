import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Information We Collect</h2>
              <p>
                When you create an account on Bookfolio, we collect information you provide such as
                your email address, username, and any profile information you choose to add. We also
                collect information about the books you add to your collection and your reading preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and maintain your Bookfolio account</li>
                <li>Display your book collection on your public profile</li>
                <li>Send you important updates about our service</li>
                <li>Improve our platform and develop new features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Data Sharing</h2>
              <p>
                We do not sell your personal information. Your profile information and book collection
                are only visible to others if you choose to make your profile public. We use Supabase
                for data storage and Google for authentication, both of which have their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time
                through your account settings. You can also request a copy of your data or permanently
                delete your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Cookies</h2>
              <p>
                We use essential cookies to maintain your session and provide authentication. These
                cookies are necessary for the service to function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us on{" "}
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
