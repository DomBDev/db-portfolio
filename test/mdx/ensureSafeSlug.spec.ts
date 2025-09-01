import { describe, it, expect } from "vitest";
import { ensureSafeSlug } from "../../src/lib/mdx";

describe("ensureSafeSlug", () => {
  it("accepts valid slugs", () => {
    expect(() => ensureSafeSlug("example-1_2")).not.toThrow();
  });
  it("rejects invalid slugs", () => {
    expect(() => ensureSafeSlug("../etc/passwd")).toThrow();
    expect(() => ensureSafeSlug("has space")).toThrow();
    expect(() => ensureSafeSlug("slash/ok")).toThrow();
  });
});
