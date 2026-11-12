import { useRef, useState, type FormEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { agentActivity } from "@/lib/agent-activity";

type Source = { id: string; title: string; href: string; nodes: string[]; score: number };
type Trace = { step: string; ms: number; detail: string };
type Mode = "generated" | "retrieval-only";

const SUGGESTIONS = [
  "What is CliniBot?",
  "Has he built multi-tenant backends?",
  "What is his AI stack?",
];

/**
 * The hero console: ask a question, get an answer grounded in the portfolio
 * data, and watch the pipeline (retrieve → generate) as it runs. Retrieved
 * chunks light up the matching nodes in the 3D graph above.
 */
export default function AskAgent({ className }: { className?: string }) {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [trace, setTrace] = useState<Trace[]>([]);
  const [mode, setMode] = useState<Mode | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text || busy) return;

    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;

    setAsked(text);
    setQuestion("");
    setAnswer("");
    setSources([]);
    setTrace([]);
    setMode(null);
    setError("");
    setBusy(true);
    agentActivity.setBusy(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "The agent is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);
          if (event.type === "trace") setTrace((t) => [...t, event]);
          if (event.type === "token") setAnswer((a) => a + event.text);
          if (event.type === "done") setMode(event.mode);
          if (event.type === "sources") {
            setSources(event.sources);
            // Light the graph nodes the retrieved chunks involve.
            agentActivity.fire(event.sources.flatMap((s: Source) => s.nodes));
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message || "The agent is unavailable right now.");
      }
    } finally {
      setBusy(false);
      agentActivity.setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(question);
  };

  const started = Boolean(asked);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border-subtle bg-surface-1/85 p-4 text-left shadow-lg backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-primary", busy && "animate-pulse")} />
          ask my agent
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">answers only from this portfolio's data</p>
      </div>

      {/* Conversation */}
      {started && (
        <div className="mt-3 max-h-56 space-y-3 overflow-y-auto pr-1" aria-live="polite">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">&gt;</span> {asked}
          </p>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {answer}
              {busy && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />}
            </p>
          )}

          {sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {sources.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  className="rounded-md border border-border-strong bg-surface-2/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {s.title}
                </a>
              ))}
            </div>
          )}

          {trace.length > 0 && (
            <ol className="space-y-0.5 border-l border-border-strong pl-3 font-mono text-[10px] text-muted-foreground">
              {trace.map((t) => (
                <li key={t.step}>
                  <span className="text-primary">{t.step}</span> · {t.ms}ms · {t.detail}
                </li>
              ))}
              {mode === "retrieval-only" && (
                <li className="text-muted-foreground/80">answer is the top retrieved passage, not model-written</li>
              )}
            </ol>
          )}
        </div>
      )}

      {/* Suggestions */}
      {!started && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-border-strong bg-surface-2/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
        <label htmlFor="agent-question" className="sr-only">
          Ask a question about Umer
        </label>
        <input
          id="agent-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={300}
          autoComplete="off"
          placeholder={started ? "Ask another question…" : "Ask about my projects, skills or experience…"}
          className="h-10 min-w-0 flex-1 rounded-full border border-border-strong bg-surface-2/70 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !question.trim()}
          aria-label="Ask"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground transition-opacity disabled:opacity-40"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} />}
        </button>
      </form>
    </div>
  );
}
