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
const { readProjectFrontmatter } = await import("@/lib/mdx");

describe("readProjectFrontmatter (optional fields conditional)", () => {
  it("ensures required fields and conditionally validates optional fields", async () => {
    const fm = await readProjectFrontmatter("example");

    // required fields
    expect(typeof fm.title).toBe("string");
    expect(fm.title.length).toBeGreaterThan(0);

    if (fm.date !== undefined && fm.date !== null) {
      expect(/^\d{4}-\d{2}-\d{2}$/.test(fm.date)).toBe(true);
    }

    if (fm.stack !== undefined && fm.stack !== null) {
      expect(Array.isArray(fm.stack)).toBe(true);
      for (const item of fm.stack) expect(typeof item).toBe("string");
    }

    if (fm.summary !== undefined) {
      expect(typeof fm.summary).toBe("string");
    }

    if (fm.hero !== undefined) {
      expect(typeof fm.hero).toBe("string");
    }

    if (fm.repo !== undefined) {
      expect(typeof fm.repo).toBe("string");
    }
    if (fm.live !== undefined) {
      expect(typeof fm.live).toBe("string");
    }
    if (fm.images !== undefined) {
      expect(Array.isArray(fm.images)).toBe(true);
    }
    
  });
});
