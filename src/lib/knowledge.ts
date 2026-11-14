/**
 * The agent's knowledge base and retriever.
 *
 * Everything the agent can say comes from `src/data/profile.ts` — the same
 * file the pages render from — split into small chunks and ranked with BM25.
 * Shared by the serverless function (api/ask.ts) and the unit tests, so it
 * must stay free of browser and React imports.
 */
import {
  profile, experience, education, skills, projects, achievements, stats,
} from "../data/profile";

export type Chunk = {
  id: string;
  title: string;
  text: string;
  /** Section of the home page this chunk comes from. */
  href: string;
  /** Hero-graph nodes this chunk touches — they light up when it is retrieved. */
  nodes: string[];
};

/** Hero graph node → the words that mean "this chunk involves that tool". */
export const NODE_KEYWORDS: Record<string, RegExp> = {
  WhatsApp: /whatsapp|waha/i,
  "Claude API": /claude|openrouter|llm|langchain|langgraph|rag\b|prompt/i,
  PostgreSQL: /postgres|prisma|mysql|mongodb|database|sql\b/i,
  Calendar: /calendar/i,
  n8n: /n8n|agentic|workflow/i,
  Gmail: /gmail|nodemailer|email/i,
  NestJS: /nestjs|node\.js|express|backend|rest/i,
};

function nodesFor(text: string) {
  return Object.entries(NODE_KEYWORDS)
    .filter(([, re]) => re.test(text))
    .map(([label]) => label);
}

function chunk(id: string, title: string, text: string, href: string): Chunk {
  return { id, title, text, href, nodes: nodesFor(`${title} ${text}`) };
}

export function buildChunks(): Chunk[] {
  const out: Chunk[] = [];

  out.push(
    chunk(
      "profile",
      "About Umer Khan",
      `${profile.name} is a ${profile.tagline} based in ${profile.location}. ${profile.summary} ${profile.longSummary} Current status: ${profile.status}.`,
      "#about"
    ),
    chunk(
      "contact",
      "Contact and availability",
      `Umer is open to internships, freelance projects and collaboration. Email: ${profile.email}. GitHub: ${profile.github}. LinkedIn: ${profile.linkedin}. Location: ${profile.location}. To hire or contact him, use the contact page.`,
      "#contact"
    )
  );

  out.push(
    chunk(
      "agent",
      "About this agent",
      "This assistant is Umer's portfolio agent, built by Umer. It answers questions about his work by retrieving passages from his portfolio data (BM25 ranking) and asking a language model, served through OpenRouter, to answer from those passages only. It is the same retrieve-then-answer pattern he uses in his products. It can talk about his projects, skills, experience, education and how to contact or book a call with him.",
      "#home"
    )
  );

  for (const job of experience) {
    out.push(
      chunk(
        `exp-${job.company}`,
        `Experience: ${job.role} at ${job.company}`,
        `${job.role} at ${job.company} (${job.parent}), ${job.period}, ${job.mode}${job.current ? ", current role" : ""}. ${job.points.join(" ")} Stack: ${job.stack.join(", ")}.`,
        "#experience"
      )
    );
  }

  for (const ed of education) {
    out.push(
      chunk(
        `edu-${ed.school}`,
        `Education: ${ed.degree}`,
        `${ed.degree} at ${ed.school}, ${ed.year}, ${ed.detail}.${ed.coursework.length ? ` Coursework: ${ed.coursework.join(", ")}.` : ""}`,
        "#about"
      )
    );
  }

  for (const group of skills) {
    out.push(
      chunk(
        `skills-${group.category}`,
        `Skills: ${group.category}`,
        `${group.category} skills and tech stack: ${group.items.join(", ")}.`,
        "#skills"
      )
    );
  }

  for (const p of projects) {
    out.push(
      chunk(
        `project-${p.title}`,
        `Project: ${p.title}`,
        `${p.title} — ${p.subtitle}.${p.flagship ? " Flagship project." : ""} ${p.description} What was built: ${p.details.join("; ")}. Tech: ${p.tags.join(", ")}. Facts: ${p.plan.map((r) => `${r.label} ${r.value}`).join(", ")}.`,
        "#projects"
      )
    );
  }

  for (const a of achievements) {
    out.push(chunk(`ach-${a.title}`, `Achievement: ${a.title}`, `${a.title} (${a.context}). ${a.detail}`, "#about"));
  }

  out.push(
    chunk(
      "stats",
      "Headline numbers",
      `Headline results: ${stats.map((s) => `${s.label}: ${s.value}`).join("; ")}.`,
      "#home"
    )
  );

  return out;
}

const STOP = new Set(
  "a an and are as at be but by can did do does for from has have he her him his how i in is it its me my of on or our she so that the their them they this to was we were what when where which who why will with you your umer khan about tell".split(" ")
);

/** Query words → extra words that mean the same thing in this knowledge base. */
const SYNONYMS: Record<string, string[]> = {
  ai: ["agentic", "claude", "rag", "llm", "automation"],
  backend: ["nestjs", "node", "express", "api"],
  db: ["database", "postgresql", "mysql"],
  database: ["postgresql", "mysql", "prisma", "databases"],
  hire: ["contact", "email", "freelance", "internship", "open"],
  available: ["open", "internship", "freelance"],
  job: ["experience", "intern", "role"],
  interning: ["intern", "experience", "role"],
  internship: ["intern", "experience"],
  work: ["experience", "intern", "role"],
  study: ["education", "degree", "coursework"],
  university: ["education", "fast", "nuces"],
  stack: ["skills", "tech"],
  tenant: ["multi"],
  frontend: ["react", "next"],
};

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .split(" ")
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t));
}

export type Hit = { chunk: Chunk; score: number };

/**
 * What the agent reads when a question matches nothing specific — greetings,
 * "who are you", "why should I hire him" — so it can still give a useful,
 * grounded answer instead of a dead end.
 */
export function generalContext(chunks: Chunk[]): Chunk[] {
  const flagship = projects.find((p) => p.flagship) ?? projects[0];
  const ids = ["profile", "agent", `project-${flagship.title}`, "stats", "contact"];
  return ids.map((id) => chunks.find((c) => c.id === id)).filter((c): c is Chunk => Boolean(c));
}

/** Plain BM25 over the chunks, with the title counted twice. */
export function retrieve(query: string, chunks: Chunk[], k = 4): Hit[] {
  const base = tokenize(query);
  const terms = Array.from(
    new Set(base.flatMap((t) => [t, ...(SYNONYMS[t] ?? []).flatMap(tokenize)]))
  );
  if (terms.length === 0) return [];

  const docs = chunks.map((c) => tokenize(`${c.title} ${c.title} ${c.text}`));
  const avgLen = docs.reduce((n, d) => n + d.length, 0) / docs.length;
  const k1 = 1.4;
  const b = 0.6;

  const hits = chunks.map((c, i) => {
    let score = 0;
    for (const term of terms) {
      const tf = docs[i].filter((t) => t === term).length;
      if (tf === 0) continue;
      const df = docs.filter((d) => d.includes(term)).length;
      const idf = Math.log(1 + (docs.length - df + 0.5) / (df + 0.5));
      // Words the visitor actually typed count more than expanded synonyms.
      const weight = base.includes(term) ? 1 : 0.5;
      score += weight * idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * docs[i].length) / avgLen)));
    }
    return { chunk: c, score };
  });

  return hits
    .filter((h) => h.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, k);
}
