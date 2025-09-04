import { listProjectSlugs, readProjectFrontmatter } from "@/lib/mdx";
import { ProjectCard } from "@/components/projects";

export default async function ProjectsPage() {
  const slugs = await listProjectSlugs();
  const projects = await Promise.all(slugs.map(async (slug) => ({
    slug,
    frontmatter: await readProjectFrontmatter(slug),
  })));
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-semibold mb-8">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects
          .filter((p): p is typeof p & { frontmatter: { title: string } } => !!p.frontmatter.title)
          .map((project) => (
            <ProjectCard key={project.slug} slug={project.slug} {...project.frontmatter} />
          ))}
      </div>
    </main>
  );
}