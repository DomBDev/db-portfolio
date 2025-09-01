/** MDX loader for content/projects */
import fs from "fs/promises";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { ReactNode } from "react";

const CONTENT_DIR = path.resolve(process.cwd(), "content", "projects");

function ensureSafeSlug(slug: string) {
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
    throw new Error("Invalid slug. Use only letters, numbers, hyphen and underscore.");
  }
}

export async function listProjectSlugs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""));
}

export async function loadProjectMdx(slug: string): Promise<{ content: ReactNode, frontmatter: { title?: string, date?: string, stack?: string[]} }> {
  ensureSafeSlug(slug);
  const filePath = path.resolve(CONTENT_DIR, `${slug}.mdx`);
  if (!filePath.startsWith(CONTENT_DIR)) throw new Error("Resolved path outside content dir.");

  const raw = await fs.readFile(filePath, "utf8");

  const { content, frontmatter } = await compileMDX({
    source: raw,
    options: { parseFrontmatter: true },
  });

  return { content, frontmatter };
}