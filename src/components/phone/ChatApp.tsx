import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ChevronLeft, LayoutGrid, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";
import {
  QUICK_REPLIES, confirmBooking, introMessages, matchIntent, replyFor,
  type Intent, type MessageBody, type Slot,
} from "@/lib/chat-script";
import { askAgent, type AskMode } from "@/lib/ask-client";
import MessageBubble, { DragScroll, type ChatMessage } from "./MessageBubble";

const TYPING_MS = 520;
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

let seq = 0;
const uid = () => `m${Date.now().toString(36)}${(seq++).toString(36)}`;
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Turns network/parse failures into something a visitor can read. */
function errorText(err: unknown): string {
  const e = err as Error;
  if (e instanceof TypeError || e instanceof SyntaxError || !e?.message) {
    return "I can't reach the agent right now, so I couldn't answer that. The quick replies above still work.";
  }
  return e.message;
}

type Session = { cancelled: boolean };

function TypingIndicator({ reduce }: { reduce: boolean }) {
  return (
    <div className="flex items-start">
      <span className="sr-only">Agent is typing</span>
      <div aria-hidden="true" className="relative flex h-[34px] items-center gap-1 rounded-[20px] rounded-bl-[6px] bg-surface-2 px-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-[7px] w-[7px] rounded-full bg-muted-foreground"
            animate={reduce ? { opacity: 0.7 } : { y: [0, -3, 0], opacity: [0.45, 1, 0.45] }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatApp({ onClose, autoFocus = false }: { onClose: () => void; autoFocus?: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const delay = reduce ? 0 : TYPING_MS;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");

  const session = useRef<Session>({ cancelled: false });
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const streamingRef = useRef(false);

  const append = useCallback((m: Omit<ChatMessage, "id" | "time"> & { id?: string }) => {
    const msg: ChatMessage = { ...m, id: m.id ?? uid(), time: new Date() };
    setMessages((prev) => [...prev, msg]);
    return msg.id;
  }, []);

  const patch = useCallback((id: string, fn: (m: ChatMessage) => ChatMessage) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? fn(m) : m)));
  }, []);

  /** Plays agent messages one by one with a typing indicator in between. */
  const playAgent = useCallback(
    async (bodies: MessageBody[], s: Session) => {
      for (const body of bodies) {
        if (delay) {
          setTyping(true);
          await sleep(delay);
        }
        if (s.cancelled) return;
        setTyping(false);
        append({ from: "agent", body });
      }
      setTyping(false);
    },
    [append, delay],
  );

  // Intro on mount; a fresh session per mount so a remount never doubles it.
  useEffect(() => {
    const s: Session = { cancelled: false };
    session.current = s;
    setMessages([]);
    setBusy(true);
    playAgent(introMessages(), s).finally(() => {
      if (!s.cancelled) setBusy(false);
    });
    return () => {
      s.cancelled = true;
      abortRef.current?.abort();
    };
    // Run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoFocus) headingRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce || streamingRef.current ? "auto" : "smooth" });
  }, [messages, typing, reduce]);

  const runIntent = async (intent: Intent, label: string) => {
    const s = session.current;
    setBusy(true);
    append({ from: "visitor", body: { kind: "text", text: label } });
    await playAgent(replyFor(intent), s);
    if (!s.cancelled) setBusy(false);
  };

  const ask = async (question: string) => {
    const s = session.current;
    setBusy(true);
    append({ from: "visitor", body: { kind: "text", text: question } });

    const controller = new AbortController();
    abortRef.current = controller;

    let id: string | null = null;
    let text = "";
    let passages = 0;
    let model: string | null = null;
    let mode: AskMode | null = null;

    setTyping(true);
    try {
      await askAgent(
        question,
        {
          onToken: (t) => {
            if (s.cancelled) return;
            text += t;
            if (!id) {
              setTyping(false);
              streamingRef.current = true;
              id = append({ from: "agent", body: { kind: "text", text }, streaming: true });
            } else {
              const current = text;
              patch(id, (m) => ({ ...m, body: { kind: "text", text: current } }));
            }
          },
          onSources: (list) => {
            passages = list.length;
          },
          onTrace: (t) => {
            if (t.step === "generate") model = t.detail;
          },
          onDone: (m) => {
            mode = m;
          },
        },
        controller.signal,
      );
      if (s.cancelled) return;
      setTyping(false);
      const meta = `retrieved ${passages} passage${passages === 1 ? "" : "s"} · ${
        mode === "generated" ? model ?? "model" : "retrieval only"
      }`;
      if (id) {
        const finalText = text;
        patch(id, (m) => ({ ...m, streaming: false, body: { kind: "text", text: finalText, meta } }));
      } else {
        append({ from: "agent", body: { kind: "text", text: "No answer came back. Try rephrasing, or tap a quick reply.", meta } });
      }
    } catch (err) {
      if (s.cancelled || (err as Error)?.name === "AbortError") return;
      setTyping(false);
      if (id) patch(id, (m) => ({ ...m, streaming: false }));
      append({ from: "agent", body: { kind: "text", text: errorText(err) } });
    } finally {
      streamingRef.current = false;
      if (abortRef.current === controller) abortRef.current = null;
      if (!s.cancelled) setBusy(false);
    }
  };

  const onQuickReply = (intent: Intent, label: string) => {
    if (busy) return;
    void runIntent(intent, label);
  };

  const onPickSlot = async (slot: Slot, messageId: string) => {
    if (busy) return;
    const s = session.current;
    setBusy(true);
    patch(messageId, (m) => ({ ...m, chosenSlotId: slot.id }));
    append({ from: "visitor", body: { kind: "text", text: slot.label } });
    await playAgent(confirmBooking(slot), s);
    if (!s.cancelled) setBusy(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const intent = matchIntent(text);
    if (intent) void runIntent(intent, text);
    else void ask(text);
  };

  const statusText = typing ? "typing…" : "agent · online";

  return (
    <div className="relative flex h-full flex-col bg-background text-foreground">
      {/* backdrop: faint dot grid + a glow from the top, in site colours */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(90% 35% at 50% 0%, hsl(var(--accent) / 0.08), transparent 70%)",
            "radial-gradient(70% 30% at 50% 100%, hsl(var(--primary) / 0.06), transparent 70%)",
            "radial-gradient(hsl(0 0% 100% / 0.035) 1px, transparent 1.2px)",
          ].join(", "),
          backgroundSize: "auto, auto, 18px 18px",
        }}
      />

      {/* header */}
      <header className="relative z-10 flex items-center gap-2 border-b border-white/[0.06] bg-surface-1/80 px-2 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] backdrop-blur-xl lg:pt-[44px]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to lock screen"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-3"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <span aria-hidden="true" className="relative shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand font-display text-[13px] font-bold text-primary-foreground">
            UK
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-1 bg-primary" />
        </span>
        <div className="min-w-0 flex-1 pl-1">
          <h1 ref={headingRef} tabIndex={-1} className="truncate font-display text-[15.5px] font-semibold leading-tight focus:outline-none">
            {profile.name}
          </h1>
          <p className={cn("truncate font-mono text-[11px] leading-tight", typing ? "text-primary" : "text-muted-foreground")}>
            {statusText}
          </p>
        </div>
        <Link
          to="/classic"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <LayoutGrid size={13} aria-hidden="true" />
          Classic<span className="sr-only"> site</span>
        </Link>
      </header>

      {/* conversation */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={`Conversation with ${profile.firstName}'s agent`}
        tabIndex={0}
        className="relative z-0 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60 lg:px-3.5"
      >
        <div className="mb-4 flex flex-col items-center gap-1.5 text-center">
          <span className="rounded-full bg-surface-2/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Today
          </span>
          <span className="max-w-[17rem] text-[11px] leading-snug text-muted-foreground/80">
            Answers come only from {profile.firstName}'s portfolio data.
          </span>
        </div>

        <ol className="flex flex-col">
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const next = messages[i + 1];
            const first = !prev || prev.from !== m.from;
            const last = (!next || next.from !== m.from) && !(typing && m.from === "agent" && !next);
            return (
              <motion.li
                key={m.id}
                initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: m.from === "agent" ? "0% 100%" : "100% 100%" }}
                className={cn(first && i > 0 ? "mt-3" : "mt-1")}
              >
                <MessageBubble
                  message={m}
                  first={first}
                  last={last}
                  disabled={busy}
                  onPickSlot={onPickSlot}
                />
                {last && !m.streaming && (
                  <p
                    className={cn(
                      "mt-1 px-2 font-mono text-[10px] text-muted-foreground/70",
                      m.from === "visitor" ? "text-right" : "text-left",
                    )}
                  >
                    <span className="sr-only">{m.from === "visitor" ? "You" : "Agent"}, </span>
                    {timeFmt.format(m.time)}
                  </p>
                )}
              </motion.li>
            );
          })}
          {typing && (
            <li className={cn(messages.length && messages[messages.length - 1].from === "agent" ? "mt-1" : "mt-3")}>
              <TypingIndicator reduce={reduce} />
            </li>
          )}
        </ol>
      </div>

      {/* composer: quick replies + input, pinned to the bottom */}
      <div className="sticky bottom-0 z-10 border-t border-white/[0.06] bg-surface-1/85 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl lg:pb-5">
        {/* a scroller below lg (drag-able with a mouse); wraps so all six show from lg up */}
        <DragScroll
          role="group"
          aria-label="Quick replies"
          className="flex gap-2 overflow-x-auto px-3 pb-2.5 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible [&::-webkit-scrollbar]:hidden [@media(hover:hover)]:cursor-grab [@media(hover:hover)]:data-[dragging]:cursor-grabbing lg:[@media(hover:hover)]:cursor-auto"
        >
          {QUICK_REPLIES.map((q) => (
            <button
              key={q.intent}
              type="button"
              onClick={() => onQuickReply(q.intent, q.label)}
              aria-disabled={busy}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border border-primary/30 bg-primary/[0.07] px-3.5 py-1.5 text-[13px] font-medium text-primary transition-colors",
                busy ? "cursor-default opacity-50" : "hover:border-primary/60 hover:bg-primary/15",
              )}
            >
              {q.label}
            </button>
          ))}
        </DragScroll>
        <form onSubmit={onSubmit} className="flex items-center gap-2 px-3">
          <label htmlFor="chat-input" className="sr-only">
            Ask a question about {profile.firstName}
          </label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={300}
            autoComplete="off"
            enterKeyHint="send"
            placeholder={`Ask about ${profile.firstName}'s work…`}
            className="h-11 min-w-0 flex-1 rounded-full border border-border-strong bg-surface-2 px-4 text-[16px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 lg:text-[14.5px]"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow transition-opacity disabled:opacity-40 disabled:shadow-none"
          >
            {busy ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <ArrowUp size={18} strokeWidth={2.4} aria-hidden="true" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
