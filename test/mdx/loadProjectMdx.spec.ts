import { describe, it, expect, vi } from "vitest";

vi.resetModules();

vi.mock("fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs/promises")>();
  return {
    ...actual,
    stat: vi.fn(async () => ({ mtimeMs: 1 })),
    readFile: vi.fn(async () => `---
title: "Portfolio"
date: "2025-01-01"
stack: ["Next.js", "MDX"]
---
# Portfolio

This is a portfolio project.

- Create files
- Verify loader
- Rendered as MDX`),
    readdir: vi.fn(async () => [{ name: "example.mdx", isFile: () => true }]),
  };
});

vi.mock("next-mdx-remote/rsc", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-mdx-remote/rsc")>();
  return {
    ...actual,
    compileMDX: vi.fn(async ({ source }) => {
      if (!source.includes("Portfolio")) throw new Error("compileMDX received unexpected source");
      return { content: "<COMPILED_MDX_NODE>", frontmatter: { title: "Portfolio", date: "2025-08-31", stack: ["Next.js", "MDX"] } };
    }),
  };
});

// import after mocks so module uses the mocked versions
const { loadProjectMdx } = await import("../../src/lib/mdx");

describe("loadProjectMdx (optional fields conditional)", () => {
    it("returns compiled content and validates required frontmatter; optional fields validated only if present", async () => {
      const res = await loadProjectMdx("example");
  
      // required frontmatter check
      expect(res.frontmatter).toBeTruthy();
      expect(typeof res.frontmatter.title).toBe("string");
      expect(res.frontmatter.title.length).toBeGreaterThan(0);
  
      // optional checks
      if (res.frontmatter.date !== undefined && res.frontmatter.date !== null) {
        expect(/^\d{4}-\d{2}-\d{2}$/.test(res.frontmatter.date)).toBe(true);
      }
      if (res.frontmatter.stack !== undefined && res.frontmatter.stack !== null) {
        expect(Array.isArray(res.frontmatter.stack)).toBe(true);
      }
      if (res.frontmatter.summary !== undefined) {
        expect(typeof res.frontmatter.summary).toBe("string");
      }
      if (res.frontmatter.hero !== undefined) {
        expect(typeof res.frontmatter.hero).toBe("string");
      }
  
      // compiled content check
      expect(res.content).toBe("<COMPILED_MDX_NODE>");
    });
  });
