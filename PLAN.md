# PLAN — "Message from Umer": the portfolio as a phone on a desk

Self-contained handoff. Read this file top to bottom before touching code.

## 1. Why (discovery summary)

Reference: https://minhngo.space — a designer's portfolio built on one physical
metaphor: a cardboard box on a desk; press it, it opens, and each object inside
is a section. What makes it memorable is not the tech, it is that **the
metaphor is the person's craft** (a designer hands you a box of creative goods).

We do not copy the box. Umer's craft is agentic back ends, and his flagship
product is CliniBot — a WhatsApp bot that books clinic appointments. So:

> The landing page is a dark desk with a phone on it. The phone buzzes with a
> message from Umer. Tap it: the phone opens into a chat. **The chat is the
> portfolio** — quick replies show projects, skills and experience as rich
> message cards, free-typed questions go to the real RAG agent (`/api/ask`),
> and "Book a call" runs the same slot-picking flow CliniBot runs for clinics.

A recruiter experiences the product he builds instead of reading about it.

### Non-negotiables

1. **Escape hatch.** A reviewer with 30 seconds must reach the classic site
   and the résumé in one click, from the first screen, on every viewport.
2. **Nothing invented.** Every fact shown comes from `src/data/profile.ts`.
3. **Works with no model.** Quick replies and booking are deterministic and
   never call the network. Only free-typed questions call `/api/ask`, which
   already degrades to retrieval-only.
4. **Fast.** The landing route must not load three.js. No new npm dependencies.
5. **Accessible.** Keyboard operable; chat log is `role="log"` `aria-live="polite"`;
   `prefers-reduced-motion` disables buzz, zoom and typing delays.
6. **Own look.** Use the site's tokens (emerald/cyan/violet on near-black,
   `font-display`, `font-mono`). Do not use WhatsApp's logo, name in UI chrome,
   wallpaper or exact colours — it is "a chat", not a WhatsApp clone.
7. **Existing pages keep working**: `/about`, `/projects`, `/contact`, and the
   current home page moved to `/classic` unchanged.

### Existing code to know

- `src/data/profile.ts` — `profile`, `roles`, `experience`, `education`,
  `skills`, `projects` (type `Project`), `achievements`, `stats`.
- `api/ask.ts` — POST `{question}` → NDJSON stream of
  `{type:"trace"|"sources"|"token"|"done", ...}`. Do not change it.
- `src/components/AskAgent.tsx` — current hero console; contains the streaming
  client inline (to be extracted in M1).
- `src/App.tsx` — routes; `BackgroundLayers` (three.js) mounted globally.
- `src/components/Navbar.tsx` — `navLinks`, logo links to `/`.
- Tailwind tokens: `bg-background`, `bg-surface-1|2|3`, `border-border-subtle|strong`,
  `text-primary`, `text-muted-foreground`, `bg-gradient-brand`, `shadow-glow`.
- Tests: vitest (`npm test`), files in `src/test/*.test.ts`. Alias `@/` → `src/`.

## 2. Milestones

File ownership is exclusive: a milestone edits only the files it lists.

### M1 — Conversation logic (pure TS, no React)  · builder: sonnet

**Files:** `src/lib/chat-script.ts` (new), `src/lib/ask-client.ts` (new),
`src/test/chat-script.test.ts` (new), `src/components/AskAgent.tsx` (refactor only).

```ts
// src/lib/chat-script.ts
import type { Project } from "@/data/profile";

export type Intent =
  | "projects" | "skills" | "experience" | "education"
  | "contact" | "resume" | "book";

export type QuickReply = { label: string; intent: Intent };

/** A bookable 30-minute slot. `start` is an absolute instant. */
export type Slot = { id: string; start: Date; label: string };

export type MessageBody =
  | { kind: "text"; text: string; meta?: string }
  | { kind: "projects"; projects: Project[] }
  | { kind: "chips"; title: string; groups: { label: string; items: string[] }[] }
  | { kind: "card"; title: string; subtitle?: string; lines: string[]; tags?: string[] }
  | { kind: "links"; links: { label: string; href: string; download?: boolean }[] }
  | { kind: "slots"; prompt: string; slots: Slot[] }
  | { kind: "booking"; slot: Slot; calendarUrl: string; mailtoUrl: string };

export const QUICK_REPLIES: QuickReply[];          // Projects, Skills, Experience, Book a call, Résumé, Contact (this order)
export function introMessages(): MessageBody[];     // 2–3 short text messages, first-person as "Umer's agent"
export function replyFor(intent: Intent, now?: Date): MessageBody[];
export function matchIntent(text: string): Intent | null;
export function nextSlots(now: Date, count?: number): Slot[];
export function calendarUrl(slot: Slot): string;
export function mailtoUrl(slot: Slot): string;
export function confirmBooking(slot: Slot): MessageBody[];
```

Rules:
- `replyFor("projects")` → one short text + one `projects` message with all
  `projects` (flagship first). `"skills"` → `chips` with one group per skills
  category. `"experience"` → one `card` per `experience` entry. `"education"`
  → one `card` per `education` entry. `"contact"` → text + `links` (email
  mailto, GitHub, LinkedIn, `/contact`). `"resume"` → text + `links` with
  `{label:"Download résumé", href:"/Umer_Khan_Resume.pdf", download:true}` and
  `{label:"Open classic site", href:"/classic"}`. `"book"` → text explaining
  this is the CliniBot flow + `slots` from `nextSlots(now)`.
- `matchIntent`: only for inputs of **≤ 3 words**; case-insensitive keyword
  match (`project(s)|work|built` → projects, `skill(s)|stack|tech` → skills,
  `experience|job|intern*` → experience, `education|study|degree|university` →
  education, `contact|email|hire|reach` → contact, `resume|résumé|cv` → resume,
  `book|call|meeting|interview|schedule` → book). Longer inputs → `null` (they
  go to the model).
- `nextSlots(now, count = 6)`: the next 3 weekdays (Mon–Fri) strictly after
  `now`'s calendar day **in Asia/Karachi (UTC+5, no DST)**, two slots each at
  11:00 and 16:00 Karachi time. `id` = ISO string of `start`. `label` like
  `"Mon 16 Nov · 11:00 AM PKT"`. Compute with UTC arithmetic (+5h), never the
  host timezone.
- `calendarUrl`: `https://calendar.google.com/calendar/render?action=TEMPLATE`
  with `text=Call with Umer Khan`, `dates=<start>/<start+30min>` in
  `YYYYMMDDTHHMMSSZ` UTC, `add=<profile.email>`, `details` one line. Use
  `URLSearchParams`.
- `mailtoUrl`: `mailto:<profile.email>?subject=…&body=…` naming the slot label.
- `confirmBooking(slot)` → a text ("Held — …, 30 minutes") + a `booking`
  message. Copy must say plainly that it opens an invite for Umer to confirm;
  nothing is auto-booked.
- Copy tone: short, concrete, no hype, no emoji except one ✅ in the booking
  confirmation and one 👋 in the intro.

```ts
// src/lib/ask-client.ts
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
export function askAgent(question: string, handlers: AskHandlers, signal?: AbortSignal): Promise<void>;
```

Refactor `AskAgent.tsx` to call `askAgent` — behaviour and markup unchanged.

**Acceptance (`src/test/chat-script.test.ts`):**
- `QUICK_REPLIES` intents are unique and each `replyFor(intent)` returns ≥ 1 message.
- `replyFor("projects")` includes every project title from `profile.ts`.
- `matchIntent("projects")==="projects"`, `matchIntent("your CV")==="resume"`,
  `matchIntent("book a call")==="book"`, `matchIntent("has he built multi-tenant backends")===null`.
- `nextSlots(new Date("2026-11-13T10:00:00Z"))` (a Friday) → 6 slots, none on
  Sat/Sun in Karachi, first is Mon 16 Nov 11:00 PKT = `2026-11-16T06:00:00.000Z`.
- `nextSlots(new Date("2026-11-13T20:30:00Z"))` (already Sat 14th in Karachi)
  → first slot is still `2026-11-16T06:00:00.000Z`.
- `calendarUrl` contains `dates=20261116T060000Z%2F20261116T063000Z` and the
  encoded email. `npm test` and `npx tsc -p tsconfig.app.json --noEmit` pass.

### M2 — Desk scene (presentational)  · builder: sonnet

**Files:** `src/components/desk/DeskScene.tsx` (new) only.

```tsx
export default function DeskScene(props: {
  opened: boolean;          // phone is open → props drift outward & dim
  children: React.ReactNode // the phone, centred
}): JSX.Element;
```

- Full-viewport (`min-h-[100dvh]`), `bg-background`, `overflow-hidden`,
  top-down view of a dark desk. Children centred with flex.
- Decorative props, all `aria-hidden`, drawn with inline SVG / CSS (no image
  files, no three.js), in the site palette, flat-illustration style, partly
  cropped by the viewport edges like the reference: mechanical keyboard edge
  (top), coffee mug with ring (top-right), notebook with a small system-diagram
  sketch — boxes and arrows (bottom-left), a pen, a sticky note reading
  `ship > perfect`, an ID/lanyard card "FAST NUCES · CS '27", earbuds or a
  USB-C cable. 5–7 props; composition must leave the centre clear.
- Props are `hidden` below `lg` (the phone is full-screen on mobile).
- **Real links** (not aria-hidden) styled as sticky notes / paper tabs, visible
  from `lg` up, placed where they don't overlap the phone: `Résumé`
  (`/Umer_Khan_Resume.pdf`, `download`), `GitHub`, `LinkedIn` (from `profile`),
  `Classic site →` (react-router `<Link to="/classic">`). External links get
  `target="_blank" rel="noopener noreferrer"`.
- When `opened`, props translate ~24–40px away from centre and drop to ~60%
  opacity (framer-motion; respect `useReducedMotion`).
- Subtle desk texture/vignette via CSS gradients only.

**Acceptance:** renders with a placeholder child at 1440×900 and 1024×768 with
no prop overlapping a centred 400×820 box; `tsc` passes; no new deps.

### M3 — Phone, chat and page  · builder: opus  (depends on M1 + M2)

**Files:** `src/components/phone/PhoneFrame.tsx`, `LockScreen.tsx`,
`ChatApp.tsx`, `MessageBubble.tsx` (all new), `src/pages/Experience.tsx` (new),
`src/App.tsx`, `src/components/Navbar.tsx`, `src/components/BackgroundLayers.tsx`.

- `PhoneFrame({ children, className })`: on `lg+` a phone bezel (rounded 3rem,
  dark body, notch pill) sized `h-[min(820px,calc(100dvh-4rem))]`
  `aspect-[9/19]`; below `lg` no bezel — children fill `100dvh` × full width.
- `LockScreen({ onOpen })`: live clock + date, a visible `<h1>` "Umer Khan"
  with tagline, one notification card that is a `<button>`: sender
  "Umer's agent", preview "Hi 👋 I build AI agents that book appointments.
  Want to see how?", hint "tap to open". The phone buzzes (2–3px shake, every
  ~4s) until opened. Enter/Space open it. Below the card, small text links:
  "Skip to classic site" (`/classic`) and "Résumé" — visible on all viewports.
- `ChatApp({ onClose })`: header (avatar initials "UK", "Umer Khan",
  status "agent · online", a back button calling `onClose`, a link to
  `/classic`); scrollable log (`role="log"`, `aria-live="polite"`,
  auto-scroll to newest); quick-reply row (horizontally scrollable buttons from
  `QUICK_REPLIES`); input + send. On mount, play `introMessages()` with a
  typing indicator (≈500 ms each; 0 under reduced motion).
  - Quick reply or `matchIntent` hit → visitor bubble + `replyFor(intent)`.
  - Otherwise → visitor bubble + agent bubble streamed via `askAgent`; when
    done show `meta` under it: `retrieved N passages · <model or "retrieval only">`.
    Errors render as an agent text bubble with the error message.
  - `slots` message: slot buttons; choosing one appends visitor bubble with the
    slot label then `confirmBooking(slot)`; a chosen `slots` message disables
    its buttons.
  - `booking` message: two links — "Add to Google Calendar" (`calendarUrl`,
    new tab) and "Email Umer instead" (`mailtoUrl`).
  - Disable send while a stream is in flight; abort the stream on unmount.
- `MessageBubble({ message, onPickSlot, disabled })`: renders every
  `MessageBody` kind. `projects` → horizontally scrollable cards (title,
  subtitle, description, tags, links). Visitor bubbles right-aligned with
  `bg-gradient-brand`; agent bubbles left, `bg-surface-2`.
- `Experience` page: `opened` state; `<SEO title="Home" …>`; skip link target
  `id="main"`; `<DeskScene opened>` → `<PhoneFrame>` → `LockScreen` or
  `ChatApp` with an `AnimatePresence` cross-fade/scale. `?chat=1` in the URL
  opens the chat directly.
- `App.tsx`: `/` → `Experience` (eager); `/classic` → `Index` (lazy). Others
  unchanged.
- `BackgroundLayers`: render nothing when `location.pathname === "/"` (so the
  landing route never loads three.js).
- `Navbar`: "Home" link → `/classic`; logo stays `/`.

**Acceptance:**
- `npm run build` passes; the entry chunk for `/` does not import `three`.
- At 1440×900 and 390×844: lock screen shows; tapping opens chat; "Projects"
  shows 4 project cards; typing "What is CliniBot?" streams an answer (or the
  retrieval-only fallback) with a meta line; "Book a call" → pick a slot →
  booking bubble with a working Google Calendar link.
- Keyboard only: Tab reaches the notification button, quick replies, input.
- `/classic`, `/about`, `/projects`, `/contact` render as before.

### M4 — Verification  · owner: lead

Run tests, typecheck, build; drive the flows above in a headless browser at
both viewports; review screenshots; fix or send back.

## 3. Escalation

If a builder fails its acceptance checks twice on the same step, stop and
report the failing check and output to the lead; do not widen file ownership.
