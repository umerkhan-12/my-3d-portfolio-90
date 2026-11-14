/**
 * Browser client for /api/ask. The endpoint streams NDJSON events
 * (trace → sources → token… → done); this parses them and calls back.
 * Kept free of React so the hero console and the chat can share it.
 */

export type AskSource = { id: string; title: string; href: string; nodes: string[]; score: number };
export type AskTrace = { step: string; ms: number; detail: string };
export type AskMode = "generated" | "retrieval-only";

export type AskHandlers = {
  onToken: (text: string) => void;
  onSources?: (sources: AskSource[]) => void;
  onTrace?: (trace: AskTrace) => void;
  onDone?: (mode: AskMode) => void;
};

/** Streams /api/ask. Rejects with Error(message) on HTTP errors; AbortError passes through. */
export async function askAgent(
  question: string,
  handlers: AskHandlers,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });

  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "The agent is unavailable right now.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const handle = (line: string) => {
    if (!line.trim()) return;
    const event = JSON.parse(line);
    if (event.type === "trace") handlers.onTrace?.(event);
    if (event.type === "token") handlers.onToken(event.text);
    if (event.type === "done") handlers.onDone?.(event.mode);
    if (event.type === "sources") handlers.onSources?.(event.sources);
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    // The last piece may be a half-received line; keep it for the next chunk.
    buffer = lines.pop() ?? "";
    lines.forEach(handle);
  }
}
