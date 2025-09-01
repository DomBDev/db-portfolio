import { listProjectSlugs, readProjectFrontmatter } from "@/lib/mdx";
import { ProjectCard } from "@/components/projects";

export default async function ProjectsPage() {
  const slugs = await listProjectSlugs();
  const projects = await Promise.all(slugs.map(async (slug) => ({
    slug,
    frontmatter: await readProjectFrontmatter(slug),
  })));
  return <div>{projects.filter((p): p is typeof p & { frontmatter: { title: string } } => !!p.frontmatter.title).map((project) => (
    <ProjectCard key={project.slug} slug={project.slug} {...project.frontmatter} />
  ))}</div>;
}