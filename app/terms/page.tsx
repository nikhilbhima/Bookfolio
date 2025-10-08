import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button} from "@/components/ui/button";

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using Bookfolio, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Use of Service</h2>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Permitted Use</h3>
            <p>You may use Bookfolio to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and maintain a personal digital bookshelf</li>
              <li>Track books you&apos;ve read, are reading, or want to read</li>
              <li>Share your reading journey via your public profile</li>
              <li>Rate and review books</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Prohibited Use</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to other user accounts</li>
              <li>Upload malicious code or attempt to harm the service</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Impersonate others or provide false information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must provide accurate and complete information</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">User Content</h2>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Your Responsibility</h3>
            <p>
              You retain ownership of the content you post on Bookfolio (reviews, ratings, notes, etc.). However, by posting content, you grant us a license to display and distribute that content on our platform.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Content Guidelines</h3>
            <p>Your content must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Contain harmful, offensive, or inappropriate material</li>
              <li>Include spam or unsolicited advertising</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Intellectual Property</h2>
            <p>
              The Bookfolio service, including its original content, features, and functionality, is owned by Bookfolio and is protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Disclaimer of Warranties</h2>
            <p>
              Bookfolio is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Bookfolio shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these Terms of Use or is harmful to other users or our service.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact</h2>
            <p>
              If you have questions about these Terms of Use, contact us at:{" "}
              <a
                href="https://x.com/nikhilbhima"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @nikhilbhima
              </a>
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
