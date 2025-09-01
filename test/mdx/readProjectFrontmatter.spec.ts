import { describe, it, expect, vi } from "vitest";

vi.resetModules();

vi.mock("fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs/promises")>();
  return {
    ...actual,
    stat: vi.fn(async () => ({ mtimeMs: 1 })),
    readFile: vi.fn(async () => `---
title: "Portfolio"
date: "2025-08-31"
stack: ["Next.js", "MDX"]
---
# Body`),
  };
});

// import after mocks so module uses mocked fs
const { readProjectFrontmatter } = await import("../../src/lib/mdx");

describe("readProjectFrontmatter", () => {
  it("parses and validates frontmatter", async () => {
    const fm = await readProjectFrontmatter("example");
    expect(fm.title).toBe("Portfolio");
    expect(fm.date).toBe("2025-08-31");
    expect(fm.stack).toEqual(["Next.js", "MDX"]);
  });
});
