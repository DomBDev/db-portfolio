import { listProjectSlugs, loadProjectMdx } from "@/lib/mdx";
import { generateMetadata as generateBaseMetadata } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { frontmatter } = await loadProjectMdx(resolvedParams.slug);
    return generateBaseMetadata({
      title: frontmatter?.title,
      description: frontmatter?.summary,
      image: frontmatter?.hero || frontmatter?.images?.[0]
    });
  } catch {
    return generateBaseMetadata({
      title: "Project Not Found",
      description: "The requested project could not be found.",
      noIndex: true
    });
  }
}

export async function generateStaticParams() {
  const slugs = await listProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: {slug: string} }) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const { content, frontmatter } = await loadProjectMdx(slug);

    return (
      <main className="min-h-screen bg-body">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          {frontmatter?.hero && (
            <div className="relative w-full h-[60vh] mb-8 rounded-lg overflow-hidden">
              <Image
                src={frontmatter.hero}
                alt={frontmatter?.title || 'Project hero image'}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Project Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-50">
              {frontmatter?.title ?? slug}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-muted mb-6">
              {frontmatter?.date && (
                <time className="flex items-center gap-2 bg-surface-50 px-3 py-1.5 rounded-md">
                  {new Date(frontmatter.date).toLocaleDateString()}
                </time>
              )}
              {frontmatter?.stack && frontmatter.stack.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {frontmatter.stack.map((tech) => (
                    <span key={tech} className="bg-surface-100 px-3 py-1.5 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Project Links */}
            <div className="flex gap-4">
              {frontmatter?.repo && (
                <Link 
                  href={frontmatter.repo} 
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-brand-50 px-4 py-2 rounded-md transition-colors"
                >
                  <span>GitHub</span>
                </Link>
              )}
              {frontmatter?.live && (
                <Link 
                  href={frontmatter.live} 
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-brand-50 px-4 py-2 rounded-md transition-colors"
                >
                  <span>Live Demo</span>
                </Link>
              )}
            </div>
          </header>

          {/* Project Content */}
          <div className="prose prose-lg dark:prose-invert prose-headings:text-brand-50 prose-a:text-brand-400 hover:prose-a:text-brand-300 prose-strong:text-brand-300 max-w-none">
            {content}
          </div>

          {/* Image Gallery */}
          {frontmatter?.images && frontmatter.images.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-brand-50">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {frontmatter.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-video rounded-lg overflow-hidden bg-surface-100">
                    <Image
                      src={image}
                      alt={`${frontmatter.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover hover:opacity-80 transition-opacity duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    );
  } catch (err) {
    return (
      <main className="min-h-screen bg-body flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-50 mb-4">Project Not Found</h1>
          <p className="text-muted mb-8">The requested project could not be found or failed to load.</p>
          <Link href="/projects" className="text-brand-400 hover:text-brand-300">
            ← Back to Projects
          </Link>
        </div>
      </main>
    );
  }
}