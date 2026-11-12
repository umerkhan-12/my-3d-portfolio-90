import { describe, it, expect } from "vitest";
import { buildChunks, retrieve } from "@/lib/knowledge";

const chunks = buildChunks();
const top = (q: string) => retrieve(q, chunks)[0]?.chunk.id;

describe("agent retrieval", () => {
  it("finds the right chunk for common questions", () => {
    expect(top("What is CliniBot?")).toBe("project-CliniBot");
    expect(top("Has he built multi-tenant backends?")).toBe("project-CliniBot");
    expect(top("Where does he study?")).toMatch(/^edu-/);
    expect(top("How can I hire him?")).toBe("contact");
    expect(top("Tell me about the NADRA portal")).toBe("project-NADRA Citizen Services Portal");
    expect(top("Where is he interning?")).toMatch(/^exp-/);
  });

  it("returns nothing for questions outside the knowledge base", () => {
    expect(retrieve("xyzzy quantum bananas", chunks)).toEqual([]);
    expect(retrieve("the and of", chunks)).toEqual([]);
  });

  it("tags chunks with the hero-graph nodes they involve", () => {
    const clinibot = chunks.find((c) => c.id === "project-CliniBot")!;
    expect(clinibot.nodes).toEqual(expect.arrayContaining(["WhatsApp", "PostgreSQL", "NestJS", "Calendar"]));
  });
});
