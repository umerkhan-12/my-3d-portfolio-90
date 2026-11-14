import {
  forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState,
  type HTMLAttributes, type PointerEvent as ReactPointerEvent, type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import {
  ArrowUpRight, CalendarPlus, Check, Clock, ChevronLeft, ChevronRight, FileDown, Github, Linkedin, Mail, PlayCircle, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageBody, Slot } from "@/lib/chat-script";
import { profile, type Project } from "@/data/profile";

export type ChatMessage = {
  id: string;
  from: "agent" | "visitor";
  body: MessageBody;
  time: Date;
  /** For `slots` messages: the slot the visitor picked. */
  chosenSlotId?: string;
  /** For streamed answers: still receiving tokens. */
  streaming?: boolean;
};

type Props = {
  message: ChatMessage;
  onPickSlot?: (slot: Slot, messageId: string) => void;
  /** Disables interactive parts (slot buttons). */
  disabled?: boolean;
  /** Position in a run of messages from the same sender, for corner shaping. */
  first?: boolean;
  last?: boolean;
};

const isExternal = (href: string) => /^https?:\/\//.test(href);
const isInternalRoute = (href: string) => href.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);

/** Bubble shell: rounded, with tighter corners on the sender's side so a run reads as one group. */
function Shell({
  from, first = true, last = true, className, children,
}: { from: ChatMessage["from"]; first?: boolean; last?: boolean; className?: string; children: ReactNode }) {
  const agent = from === "agent";
  return (
    <div
      className={cn(
        "relative max-w-[84%] break-words px-3.5 py-2 text-[14.5px] leading-[1.45] [overflow-wrap:anywhere]",
        "rounded-[20px]",
        agent
          ? cn("rounded-bl-[6px] bg-surface-2 text-foreground", !first && "rounded-tl-[6px]")
          : cn("rounded-br-[6px] bg-gradient-brand text-primary-foreground", !first && "rounded-tr-[6px]"),
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Panel for rich agent content (cards, chips, links): flatter, full width. */
function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("w-full max-w-[92%] rounded-[18px] border border-white/[0.06] bg-surface-2 p-3.5", className)}>
      {children}
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border-strong bg-surface-1/80 px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground">
      {children}
    </span>
  );
}

const DRAG_THRESHOLD = 5; // px of mouse travel before a press counts as a drag

/**
 * Horizontal scroller that a mouse can drag (touch and trackpads already
 * scroll natively). A press only becomes a drag after DRAG_THRESHOLD px, so
 * clicks on links and buttons inside still work; a real drag swallows its click.
 */
export const DragScroll = forwardRef<HTMLElement, HTMLAttributes<HTMLElement> & { as?: "div" | "ul" }>(
  function DragScroll({ as: Tag = "div", className, onKeyDown, children, ...rest }, ref) {
    const el = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => el.current as HTMLElement);
    const drag = useRef<{ id: number; x: number; left: number; active: boolean } | null>(null);
    const swallowClick = useRef(false);

    const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
      const node = el.current;
      if (e.pointerType !== "mouse" || e.button !== 0 || !node) return;
      drag.current = { id: e.pointerId, x: e.clientX, left: node.scrollLeft, active: false };
    };
    const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
      const node = el.current;
      const d = drag.current;
      if (!node || !d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      if (!d.active) {
        if (Math.abs(dx) < DRAG_THRESHOLD || node.scrollWidth <= node.clientWidth) return;
        d.active = true;
        node.setPointerCapture(e.pointerId);
        node.dataset.dragging = "true";
        node.style.scrollSnapType = "none"; // free movement while dragging, snaps again on release
      }
      node.scrollLeft = d.left - dx;
    };
    const end = (e: ReactPointerEvent<HTMLElement>) => {
      const node = el.current;
      const d = drag.current;
      if (!node || !d || d.id !== e.pointerId) return;
      drag.current = null;
      if (!d.active) return;
      swallowClick.current = true;
      window.setTimeout(() => (swallowClick.current = false), 0);
      delete node.dataset.dragging;
      node.style.scrollSnapType = "";
    };

    return (
      <Tag
        {...rest}
        ref={el as never}
        className={className}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (swallowClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onKeyDown={onKeyDown}
      >
        {children}
      </Tag>
    );
  },
);

/** Project cards: swipe on touch; arrows, drag and arrow keys with a mouse or keyboard. */
function ProjectCarousel({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion() ?? false;
  const row = useRef<HTMLElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const node = row.current;
    if (!node) return;
    setEdge({
      start: node.scrollLeft <= 2,
      end: node.scrollLeft >= node.scrollWidth - node.clientWidth - 2,
    });
  }, []);

  useEffect(() => {
    measure();
    const node = row.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [measure]);

  /** One card plus the gap, read from the DOM so it follows the card width. */
  const step = (dir: 1 | -1) => {
    const node = row.current;
    const card = node?.querySelector("li");
    if (!node || !card) return;
    const gap = parseFloat(getComputedStyle(node).columnGap) || 0;
    node.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-surface-1/90 text-foreground shadow-md backdrop-blur " +
    "transition-opacity hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
    "disabled:pointer-events-none disabled:opacity-0 [@media(hover:hover)]:flex";

  return (
    <div className="-mx-3 lg:-mx-3.5">
      <div className="relative">
        <DragScroll
          as="ul"
          ref={row}
          tabIndex={0}
          aria-label={`${projects.length} projects`}
          onScroll={measure}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return; // keep arrow keys for focused controls inside
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              step(e.key === "ArrowRight" ? 1 : -1);
            }
          }}
          className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-3 px-3 pb-2 pt-1 [scrollbar-width:none] lg:scroll-px-3.5 lg:px-3.5 [&::-webkit-scrollbar]:hidden [@media(hover:hover)]:scroll-px-11 [@media(hover:hover)]:px-11 [@media(hover:hover)]:[mask-image:linear-gradient(to_right,transparent,#000_40px,#000_calc(100%-40px),transparent)] [@media(hover:hover)]:cursor-grab [@media(hover:hover)]:data-[dragging]:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
        >
          {projects.map((p) => (
            <li key={p.title} className="flex">
              <ProjectCard project={p} />
            </li>
          ))}
          <li aria-hidden="true" className="w-1 shrink-0" />
        </DragScroll>
        {/* arrows sit in the side gutters the row reserves, so they never cover card text */}
        <button
          type="button"
          aria-label="Previous project"
          disabled={edge.start}
          onClick={() => step(-1)}
          className={cn(arrow, "left-1.5")}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next project"
          disabled={edge.end}
          onClick={() => step(1)}
          className={cn(arrow, "right-1.5")}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
      <p aria-hidden="true" className="px-4 font-mono text-[10px] text-muted-foreground/70">
        <span className="[@media(hover:hover)]:hidden">swipe for more →</span>
        <span className="hidden [@media(hover:hover)]:inline">drag, or use the arrows, for more →</span>
      </p>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const shown = project.tags.slice(0, 4);
  const extra = project.tags.length - shown.length;
  return (
    <article
      className={cn(
        "relative flex w-[min(78vw,252px)] shrink-0 snap-start flex-col rounded-[18px] border bg-surface-2 p-3.5",
        project.flagship ? "border-primary/35 shadow-glow" : "border-white/[0.06]",
      )}
      aria-label={project.title}
    >
      {project.flagship && (
        <span className="ribbon absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-primary-foreground">
          <Star size={9} aria-hidden="true" className="fill-current" /> Flagship
        </span>
      )}
      <h3 className={cn("font-display text-[17px] font-bold leading-tight text-foreground", project.flagship && "pr-20")}>
        {project.title}
      </h3>
      <p className="mt-1 font-mono text-[10.5px] leading-snug text-primary">{project.subtitle}</p>
      <p className="mt-2.5 line-clamp-5 text-[12.5px] leading-[1.5] text-foreground/80">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {shown.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
        {extra > 0 && <Tag>+{extra}</Tag>}
      </div>
      <div className="mt-auto flex gap-2 pt-3.5">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Github size={13} aria-hidden="true" /> Code
          <span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <PlayCircle size={13} aria-hidden="true" /> Demo
            <span className="sr-only"> of {project.title} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}

function linkIcon(href: string, download?: boolean) {
  if (download) return FileDown;
  if (href.startsWith("mailto:")) return Mail;
  if (href.includes("github.com")) return Github;
  if (href.includes("linkedin.com")) return Linkedin;
  return ArrowUpRight;
}

function SmartLink({
  href, download, className, children,
}: { href: string; download?: boolean; className: string; children: ReactNode }) {
  if (isInternalRoute(href) && !download) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = isExternal(href);
  return (
    <a
      href={href}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/** "Mon 16 Nov · 11:00 AM PKT" → ["Mon 16 Nov", "11:00 AM PKT"] */
function splitSlotLabel(label: string) {
  const [day, time] = label.split(" · ");
  return { day, time: time ?? "" };
}

export default function MessageBubble({ message, onPickSlot, disabled = false, first = true, last = true }: Props) {
  const { body, from } = message;

  switch (body.kind) {
    case "text":
      return (
        <div className={cn("flex flex-col", from === "visitor" ? "items-end" : "items-start")}>
          <Shell from={from} first={first} last={last}>
            <p className="whitespace-pre-wrap">
              {body.text}
              {message.streaming && (
                <span aria-hidden="true" className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-primary align-middle" />
              )}
            </p>
          </Shell>
          {body.meta && (
            <p className="ml-2 mt-1 max-w-[84%] font-mono text-[10px] leading-snug text-muted-foreground">{body.meta}</p>
          )}
        </div>
      );

    case "projects":
      return <ProjectCarousel projects={body.projects} />;

    case "chips":
      return (
        <Panel>
          <p className="font-display text-[15px] font-semibold">{body.title}</p>
          <div className="mt-2.5 space-y-3">
            {body.groups.map((g) => (
              <div key={g.label}>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{g.label}</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border-strong bg-surface-1/80 px-2.5 py-1 text-[12px] leading-none text-foreground/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
      );

    case "card":
      return (
        <Panel>
          <p className="font-display text-[15.5px] font-semibold leading-tight">{body.title}</p>
          {body.subtitle && <p className="mt-1 font-mono text-[11px] leading-snug text-primary">{body.subtitle}</p>}
          <ul className="mt-2.5 space-y-1.5">
            {body.lines.map((line, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-[1.45] text-foreground/85">
                <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span className="min-w-0">{line}</span>
              </li>
            ))}
          </ul>
          {body.tags && body.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {body.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
        </Panel>
      );

    case "links":
      return (
        <Panel className="p-1.5">
          <ul className="divide-y divide-white/[0.06]">
            {body.links.map((l) => {
              const Icon = linkIcon(l.href, l.download);
              return (
                <li key={l.href}>
                  <SmartLink
                    href={l.href}
                    download={l.download}
                    className="group flex items-center gap-3 rounded-[12px] px-2.5 py-2.5 text-[13.5px] font-medium text-foreground transition-colors hover:bg-surface-3/70"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{l.label}</span>
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </SmartLink>
                </li>
              );
            })}
          </ul>
        </Panel>
      );

    case "slots": {
      const chosen = message.chosenSlotId;
      const locked = disabled || Boolean(chosen);
      return (
        <Panel>
          <p className="flex items-center gap-1.5 font-display text-[14.5px] font-semibold">
            <Clock size={14} aria-hidden="true" className="text-primary" />
            {body.prompt}
          </p>
          <div role="group" aria-label={body.prompt} className="mt-2.5 grid grid-cols-2 gap-2">
            {body.slots.map((slot) => {
              const { day, time } = splitSlotLabel(slot.label);
              const picked = chosen === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={locked}
                  aria-pressed={picked}
                  aria-label={slot.label}
                  onClick={() => onPickSlot?.(slot, message.id)}
                  className={cn(
                    "relative rounded-[12px] border px-2.5 py-2 text-left transition-colors",
                    picked
                      ? "border-primary bg-primary/15"
                      : "border-border-strong bg-surface-1/70 enabled:hover:border-primary/60 enabled:hover:bg-primary/5",
                    locked && !picked && "opacity-45",
                    "disabled:cursor-default",
                  )}
                >
                  <span className="block text-[12.5px] font-semibold leading-tight text-foreground">{day}</span>
                  <span className="mt-0.5 block font-mono text-[10.5px] leading-tight text-muted-foreground">{time}</span>
                  {picked && (
                    <Check size={13} aria-hidden="true" className="absolute right-2 top-2 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </Panel>
      );
    }

    case "booking":
      return (
        <Panel className="border-primary/25">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center overflow-hidden rounded-[10px] border border-border-strong bg-surface-1 text-center">
              <span className="w-full bg-primary/80 py-[1px] font-mono text-[8px] font-bold uppercase leading-none text-primary-foreground">
                {splitSlotLabel(body.slot.label).day.split(" ")[2] ?? ""}
              </span>
              <span className="font-display text-[15px] font-bold leading-tight">
                {splitSlotLabel(body.slot.label).day.split(" ")[1] ?? ""}
              </span>
            </span>
            <div className="min-w-0">
              <p className="font-display text-[14.5px] font-semibold leading-tight">Call with {profile.firstName}</p>
              <p className="mt-0.5 font-mono text-[11px] leading-snug text-muted-foreground">{body.slot.label}</p>
              <p className="font-mono text-[11px] leading-snug text-muted-foreground">30 min · awaiting {profile.firstName}'s confirmation</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={body.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <CalendarPlus size={15} aria-hidden="true" />
              Add to Google Calendar
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={body.mailtoUrl}
              className="flex items-center justify-center gap-2 rounded-full border border-border-strong px-4 py-2.5 text-[13.5px] font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Mail size={15} aria-hidden="true" />
              Email {profile.firstName} instead
            </a>
          </div>
        </Panel>
      );
  }
}
