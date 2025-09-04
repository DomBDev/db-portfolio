import Link from "next/link";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  noIndex: true
});

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="inline-block px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-700 transition-colors"
      >
        Return Home
      </Link>
    </main>
  );
}
