import fs from "fs/promises";
import path from "path";
import { z } from "zod"
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { ReactNode } from "react";


// Constants
const CONTENT_DIR = path.resolve(process.cwd(), "content", "projects");

const isoDate = z.string().refine((s) => !s || /^\d{4}-\d{2}-\d{2}$/.test(s), {
  message: "date must be in YYYY-MM-DD format",
});

const frontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  date: isoDate.optional(),
  stack: z.array(z.string()).optional(),
  summary: z.string().optional(),
  hero: z.string().optional(),
});
type Frontmatter = z.infer<typeof frontmatterSchema>;


// Helper Functions
function ensureSafeSlug(slug: string) {
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) throw new Error("Invalid slug.");
}

function ensureInsideContentDir(resolved: string) {
  const rel = path.relative(CONTENT_DIR, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) throw new Error("Resolved path outside content dir.");
}

  // Simple cache with mtime tracking
const cache = new Map<string, { mtimeMs: number; raw: string }>();

async function readFileWithCache(filePath: string): Promise<string> {
  const stat = await fs.stat(filePath);
  const cached = cache.get(filePath);
  if (cached && cached.mtimeMs === stat.mtimeMs) return cached.raw;
  const raw = await fs.readFile(filePath, "utf8");
  cache.set(filePath, { mtimeMs: stat.mtimeMs, raw });
  return raw;
}

// Export helpers for tests
export { ensureSafeSlug, ensureInsideContentDir, readFileWithCache };


// Main Functions
export async function listProjectSlugs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""));
}

export async function loadProjectMdx(slug: string): Promise<{ content: ReactNode; frontmatter: Frontmatter }> {
  ensureSafeSlug(slug);
  const filePath = path.resolve(CONTENT_DIR, `${slug}.mdx`);
  ensureInsideContentDir(filePath);

  const raw = await readFileWithCache(filePath);

  // compileMDX returns { content, frontmatter } where content is a react node
  const compiled = await compileMDX({
    source: raw,
    options: { parseFrontmatter: true },
  });

  const parseResult = frontmatterSchema.safeParse(compiled.frontmatter ?? {});
  if (!parseResult.success) {
    throw new Error("Invalid frontmatter for project: " + slug);
  }

  return { content: compiled.content as ReactNode, frontmatter: parseResult.data };
}

export async function readProjectFrontmatter( slug: string): Promise<Frontmatter> {
  ensureSafeSlug(slug);
  const filePath = path.resolve(CONTENT_DIR, `${slug}.mdx`);
  ensureInsideContentDir(filePath);

  const raw = await readFileWithCache(filePath);
  const { data } = matter(raw);

  const parseResult = frontmatterSchema.safeParse(data ?? {});
  if (!parseResult.success) {
    throw new Error("Invalid frontmatter for project: " + slug);
  }
  return parseResult.data;
}