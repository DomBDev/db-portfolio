import { listProjectSlugs, loadProjectMdx } from "@/lib/mdx";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  const slugs = await listProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: {slug: string} }) {
  try {
    const { slug } = await params;
    const { content, frontmatter } = await loadProjectMdx(slug);
    return (
      <main>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4">{frontmatter?.title ?? slug}</h1>
          <p className="mb-6">{frontmatter?.date}</p>
          <p className="mb-6">{(frontmatter?.stack || []).join(", ")}</p>
          <p className="mb-6">{frontmatter?.repo ? <Link href={frontmatter.repo} target="_blank">Repo</Link> : null}</p>
          <p className="mb-6">{frontmatter?.live ? <Link href={frontmatter.live} target="_blank">Live</Link> : null}</p>
          <p className="mb-6">{frontmatter?.images ? frontmatter.images.map((image) => <Image src={image} alt={frontmatter.title} width={1000} height={1000} />) : null}</p>
          <div className="prose dark:prose-invert">
            {content}
          </div>
        </div>
      </main>
    );
  } catch (err) {
    return <main><p>Project not found or failed to load.</p></main>;
  }
}