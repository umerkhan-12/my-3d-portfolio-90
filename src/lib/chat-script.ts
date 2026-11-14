/**
 * The scripted half of the chat: quick replies, intent matching and the
 * booking flow. Pure TypeScript — no React, no DOM, no network — so it works
 * with no model and is easy to test. Every fact comes from `src/data/profile.ts`.
 */
import { profile, projects, skills, experience, education } from "@/data/profile";
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

export const QUICK_REPLIES: QuickReply[] = [
  { label: "Projects", intent: "projects" },
  { label: "Skills", intent: "skills" },
  { label: "Experience", intent: "experience" },
  { label: "Book a call", intent: "book" },
  { label: "Résumé", intent: "resume" },
  { label: "Contact", intent: "contact" },
];

export function introMessages(): MessageBody[] {
  const flagship = projects.find((p) => p.flagship) ?? projects[0];
  return [
    { kind: "text", text: "Hi 👋 I'm Umer's agent." },
    {
      kind: "text",
      text: `${profile.firstName} builds AI agents that book appointments. His main project is ${flagship.title}, a WhatsApp bot for dental clinics.`,
    },
    {
      kind: "text",
      text: "Tap a reply below, or type a question. I only answer from his portfolio data.",
    },
  ];
}

// ---------------------------------------------------------------------------
// Intent matching
// ---------------------------------------------------------------------------

// Unicode-aware word edges: \b does not treat "é" as a letter.
const word = (alts: string) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${alts})(?![\\p{L}\\p{N}])`, "iu");

// Checked in this order; the first hit wins.
const INTENT_PATTERNS: [Intent, RegExp][] = [
  ["projects", word("projects?|work|built")],
  ["skills", word("skills?|stack|tech")],
  ["experience", word("experience|job|intern\\p{L}*")],
  ["education", word("education|study|degree|university")],
  ["contact", word("contact|email|hire|reach")],
  ["resume", word("resume|résumé|cv")],
  ["book", word("book|call|meeting|interview|schedule")],
];

/** Only short inputs are treated as commands; anything longer goes to the model. */
export function matchIntent(text: string): Intent | null {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 3) return null;
  for (const [intent, re] of INTENT_PATTERNS) {
    if (re.test(text)) return intent;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Slots (Asia/Karachi is UTC+5 with no DST, so a fixed offset is exact)
// ---------------------------------------------------------------------------

const PKT_OFFSET_MS = 5 * 3_600_000;
const DAY_MS = 86_400_000;
const SLOT_HOURS_PKT = [11, 16];
const SLOT_MINUTES = 30;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function slotLabel(start: Date): string {
  // Shift by +5h, then read the UTC fields: they are the Karachi wall clock.
  const k = new Date(start.getTime() + PKT_OFFSET_MS);
  const h24 = k.getUTCHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const mm = String(k.getUTCMinutes()).padStart(2, "0");
  const ampm = h24 < 12 ? "AM" : "PM";
  return `${WEEKDAYS[k.getUTCDay()]} ${k.getUTCDate()} ${MONTHS[k.getUTCMonth()]} · ${h12}:${mm} ${ampm} PKT`;
}

/** Two slots a day (11:00 and 16:00 PKT) on the next weekdays after `now`'s Karachi date. */
export function nextSlots(now: Date, count = 6): Slot[] {
  const shifted = now.getTime() + PKT_OFFSET_MS;
  // Midnight of the Karachi calendar day, expressed as a shifted-UTC timestamp.
  let dayStart = Math.floor(shifted / DAY_MS) * DAY_MS;
  const slots: Slot[] = [];

  while (slots.length < count) {
    dayStart += DAY_MS;
    const dow = new Date(dayStart).getUTCDay();
    if (dow === 0 || dow === 6) continue;
    for (const hour of SLOT_HOURS_PKT) {
      if (slots.length >= count) break;
      const start = new Date(dayStart + hour * 3_600_000 - PKT_OFFSET_MS);
      slots.push({ id: start.toISOString(), start, label: slotLabel(start) });
    }
  }
  return slots;
}

/** `YYYYMMDDTHHMMSSZ`, the UTC format Google Calendar expects. */
function calStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function calendarUrl(slot: Slot): string {
  const end = new Date(slot.start.getTime() + SLOT_MINUTES * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Call with ${profile.name}`,
    dates: `${calStamp(slot.start)}/${calStamp(end)}`,
    add: profile.email,
    details: `${SLOT_MINUTES}-minute call requested from ${profile.firstName}'s portfolio chat (${slot.label}).`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function mailtoUrl(slot: Slot): string {
  const params = new URLSearchParams({
    subject: `Call request: ${slot.label}`,
    body: `Hi ${profile.firstName},\n\nI'd like a ${SLOT_MINUTES}-minute call on ${slot.label}. Does that work for you?\n`,
  });
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${profile.email}?${params.toString().replace(/\+/g, "%20")}`;
}

export function confirmBooking(slot: Slot): MessageBody[] {
  return [
    {
      kind: "text",
      text: `✅ Held: ${slot.label}, ${SLOT_MINUTES} minutes. Nothing is booked automatically. The button below opens a calendar invite for ${profile.firstName} to confirm.`,
    },
    { kind: "booking", slot, calendarUrl: calendarUrl(slot), mailtoUrl: mailtoUrl(slot) },
  ];
}

// ---------------------------------------------------------------------------
// Replies
// ---------------------------------------------------------------------------

export function replyFor(intent: Intent, now: Date = new Date()): MessageBody[] {
  switch (intent) {
    case "projects": {
      // Flagship first; sort is stable so the rest keep their profile order.
      const ordered = [...projects].sort((a, b) => Number(Boolean(b.flagship)) - Number(Boolean(a.flagship)));
      return [
        { kind: "text", text: `Here are ${ordered.length} things ${profile.firstName} has built.` },
        { kind: "projects", projects: ordered },
      ];
    }
    case "skills":
      return [
        { kind: "text", text: "His stack, grouped by area." },
        {
          kind: "chips",
          title: "Skills",
          groups: skills.map((g) => ({ label: g.category, items: g.items })),
        },
      ];
    case "experience":
      return experience.map((e) => ({
        kind: "card" as const,
        title: e.role,
        subtitle: `${e.company} · ${e.period}`,
        lines: [`${e.mode}${e.parent ? `, part of ${e.parent}` : ""}`, ...e.points],
        tags: e.stack,
      }));
    case "education":
      return education.map((e) => ({
        kind: "card" as const,
        title: e.degree,
        subtitle: e.school,
        lines: [e.year, e.detail],
        tags: e.coursework.length ? e.coursework : undefined,
      }));
    case "contact":
      return [
        { kind: "text", text: `Email is the fastest way to reach ${profile.firstName}. He is based in ${profile.location}.` },
        {
          kind: "links",
          links: [
            { label: profile.email, href: `mailto:${profile.email}` },
            { label: "GitHub", href: profile.github },
            { label: "LinkedIn", href: profile.linkedin },
            { label: "Contact page", href: "/contact" },
          ],
        },
      ];
    case "resume":
      return [
        { kind: "text", text: "The résumé is a PDF. The classic site has the same content as regular pages." },
        {
          kind: "links",
          links: [
            { label: "Download résumé", href: "/Umer_Khan_Resume.pdf", download: true },
            { label: "Open classic site", href: "/classic" },
          ],
        },
      ];
    case "book":
      return [
        {
          kind: "text",
          text: "This is the same slot-picking flow CliniBot runs for clinics over WhatsApp. Pick a time (Karachi time) and I'll prepare an invite.",
        },
        { kind: "slots", prompt: "Pick a 30-minute slot", slots: nextSlots(now) },
      ];
  }
}
