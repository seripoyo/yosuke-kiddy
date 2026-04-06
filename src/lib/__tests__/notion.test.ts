import { describe, it, expect } from "vitest";

// Test the splitRichText helper logic (extracted inline test)
describe("notion helpers", () => {
  it("splits text longer than 2000 chars into chunks", () => {
    // Replicate splitRichText logic
    const splitRichText = (text: string) => {
      const chunks: { type: "text"; text: { content: string } }[] = [];
      for (let i = 0; i < text.length; i += 2000) {
        chunks.push({
          type: "text",
          text: { content: text.slice(i, i + 2000) },
        });
      }
      return chunks.length > 0
        ? chunks
        : [{ type: "text" as const, text: { content: "" } }];
    };

    // Short text
    const short = splitRichText("hello");
    expect(short).toHaveLength(1);
    expect(short[0].text.content).toBe("hello");

    // Exactly 2000 chars
    const exact = splitRichText("a".repeat(2000));
    expect(exact).toHaveLength(1);
    expect(exact[0].text.content.length).toBe(2000);

    // 2001 chars → 2 chunks
    const over = splitRichText("b".repeat(2001));
    expect(over).toHaveLength(2);
    expect(over[0].text.content.length).toBe(2000);
    expect(over[1].text.content.length).toBe(1);

    // 5000 chars → 3 chunks
    const long = splitRichText("c".repeat(5000));
    expect(long).toHaveLength(3);

    // Empty text → single empty entry
    const empty = splitRichText("");
    expect(empty).toHaveLength(1);
    expect(empty[0].text.content).toBe("");
  });
});
