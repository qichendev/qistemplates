import { describe, expect, test } from "bun:test";

import { greet } from "../src/index";

describe("greet", () => {
  test("uses default punctuation", () => {
    expect(greet("Bun")).toBe("Hello, Bun!");
  });

  test("supports custom punctuation", () => {
    expect(greet("Bun", { punctuation: "?" })).toBe("Hello, Bun?");
  });
});
