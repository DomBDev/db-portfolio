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
      // relaxed check: ensure the source contains the expected snippet
      if (!source.includes("Portfolio")) throw new Error("compileMDX received unexpected source");
      return { content: "<COMPILED_MDX_NODE>", frontmatter: { title: "Portfolio", date: "2025-08-31", stack: ["Next.js", "MDX"] } };
    }),
  };
});

// import after mocks so module uses the mocked versions
const { loadProjectMdx } = await import("../../src/lib/mdx");

describe("loadProjectMdx", () => {
  it("compiles MDX and returns content + validated frontmatter", async () => {
    const res = await loadProjectMdx("example");
    expect(res.frontmatter.title).toBe("Portfolio");
    expect(res.content).toBe("<COMPILED_MDX_NODE>");
  });
});
