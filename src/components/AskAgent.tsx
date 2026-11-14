import { useRef, useState, type FormEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { agentActivity } from "@/lib/agent-activity";
import { askAgent, type AskSource, type AskTrace, type AskMode } from "@/lib/ask-client";


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
  const [sources, setSources] = useState<AskSource[]>([]);
  const [trace, setTrace] = useState<AskTrace[]>([]);
  const [mode, setMode] = useState<AskMode | null>(null);
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
      await askAgent(
        text,
        {
          onTrace: (t) => setTrace((prev) => [...prev, t]),
          onToken: (t) => setAnswer((a) => a + t),
          onDone: (m) => setMode(m),
          onSources: (list) => {
            setSources(list);
            // Light the graph nodes the retrieved chunks involve.
            agentActivity.fire(list.flatMap((s) => s.nodes));
          },
        },
        controller.signal
      );
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
        <p className="flex items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-primary", busy && "animate-pulse")} />
          ask my agent
        </p>
        <p className="whitespace-nowrap font-mono text-[10px] text-muted-foreground">
          <span className="sm:hidden">portfolio data only</span>
          <span className="hidden sm:inline">answers only from this portfolio's data</span>
        </p>
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
