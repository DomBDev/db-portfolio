import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-semibold mb-4 w-full text-center text-brand-50">Dom, Software Engineer</h1>
        <p className="mb-8 w-full text-center text-brand-200">Dark-first portfolio, brown themed, minimal skeleton. Projects loaded from <code className="text-brand-100">content/projects</code>.</p>
        <div className="w-full text-center space-x-4">
          <Link 
            href="/projects" 
            className="inline-block px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            View Projects
          </Link>
          <Link 
            href="/contact" 
            className="inline-block px-6 py-3 bg-surface-100 text-brand-100 rounded-lg hover:bg-surface-200 hover:text-brand-50 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
