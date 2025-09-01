import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto">
        <h1 className="text-4xl font-semibold mb-4 w-full text-center">Dom, Software Engineer</h1>
        <p className="mb-6 w-full text-center">Dark-first portfolio, brown themed, minimal skeleton. Projects loaded from <code>content/projects</code>.</p>
        <div className="w-full text-center">
          <Link href="/projects" className="inline-block px-4 py-2 bg-sky-600 rounded text-center">View Projects</Link>
        </div>
      </div>
    </main>
  );
}
