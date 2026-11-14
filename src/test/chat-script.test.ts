import { describe, it, expect } from "vitest";
import { profile, projects, skills, experience, education } from "@/data/profile";
import {
  QUICK_REPLIES, introMessages, replyFor, matchIntent, nextSlots, calendarUrl, mailtoUrl, confirmBooking,
} from "@/lib/chat-script";

const karachiDow = (d: Date) => new Date(d.getTime() + 5 * 3_600_000).getUTCDay();

describe("quick replies", () => {
  it("have unique intents and every reply returns messages", () => {
    const intents = QUICK_REPLIES.map((q) => q.intent);
    expect(new Set(intents).size).toBe(intents.length);
    for (const intent of intents) expect(replyFor(intent).length).toBeGreaterThanOrEqual(1);
  });

  it("keeps the specified order", () => {
    expect(QUICK_REPLIES.map((q) => q.label)).toEqual([
      "Projects", "Skills", "Experience", "Book a call", "Résumé", "Contact",
    ]);
  });

  it("intro is 2-3 text messages", () => {
    const intro = introMessages();
    expect(intro.length).toBeGreaterThanOrEqual(2);
    expect(intro.length).toBeLessThanOrEqual(3);
    expect(intro.every((m) => m.kind === "text")).toBe(true);
  });
});

describe("replyFor", () => {
  it("projects includes every project title, flagship first", () => {
    const msg = replyFor("projects").find((m) => m.kind === "projects");
    expect(msg?.kind === "projects" && msg.projects.map((p) => p.title)).toEqual(
      expect.arrayContaining(projects.map((p) => p.title))
    );
    expect(msg?.kind === "projects" && msg.projects[0].flagship).toBe(true);
  });

  it("skills has one group per category", () => {
    const msg = replyFor("skills").find((m) => m.kind === "chips");
    expect(msg?.kind === "chips" && msg.groups.map((g) => g.label)).toEqual(skills.map((s) => s.category));
  });

  it("experience and education give one card per entry", () => {
    expect(replyFor("experience").filter((m) => m.kind === "card")).toHaveLength(experience.length);
    expect(replyFor("education").filter((m) => m.kind === "card")).toHaveLength(education.length);
  });

  it("resume links to the PDF and the classic site", () => {
    const links = replyFor("resume").find((m) => m.kind === "links");
    expect(links?.kind === "links" && links.links).toEqual([
      { label: "Download résumé", href: "/Umer_Khan_Resume.pdf", download: true },
      { label: "Open classic site", href: "/classic" },
    ]);
  });

  it("book offers six slots", () => {
    const slots = replyFor("book", new Date("2026-11-13T10:00:00Z")).find((m) => m.kind === "slots");
    expect(slots?.kind === "slots" && slots.slots).toHaveLength(6);
  });
});

describe("matchIntent", () => {
  it("matches short keyword inputs", () => {
    expect(matchIntent("projects")).toBe("projects");
    expect(matchIntent("your CV")).toBe("resume");
    expect(matchIntent("book a call")).toBe("book");
    expect(matchIntent("Résumé")).toBe("resume");
    expect(matchIntent("internship")).toBe("experience");
  });

  it("leaves longer questions for the model", () => {
    expect(matchIntent("has he built multi-tenant backends")).toBeNull();
    expect(matchIntent("What is CliniBot?")).toBeNull();
    expect(matchIntent("")).toBeNull();
  });
});

describe("nextSlots", () => {
  it("starts on the next Karachi weekday and skips weekends", () => {
    const slots = nextSlots(new Date("2026-11-13T10:00:00Z"));
    expect(slots).toHaveLength(6);
    expect(slots[0].start.toISOString()).toBe("2026-11-16T06:00:00.000Z");
    expect(slots[0].id).toBe("2026-11-16T06:00:00.000Z");
    expect(slots[0].label).toBe("Mon 16 Nov · 11:00 AM PKT");
    expect(slots[1].label).toBe("Mon 16 Nov · 4:00 PM PKT");
    for (const s of slots) expect([0, 6]).not.toContain(karachiDow(s.start));
  });

  it("uses the Karachi date, not UTC", () => {
    // 20:30Z on Fri 13th is already Sat 14th in Karachi.
    expect(nextSlots(new Date("2026-11-13T20:30:00Z"))[0].start.toISOString()).toBe("2026-11-16T06:00:00.000Z");
  });

  it("is strictly after today and spans weekends", () => {
    const slots = nextSlots(new Date("2026-11-16T01:00:00Z"));
    expect(slots[0].label).toBe("Tue 17 Nov · 11:00 AM PKT");
    expect(slots[5].label).toBe("Thu 19 Nov · 4:00 PM PKT");
    const thu = nextSlots(new Date("2026-11-19T10:00:00Z"));
    expect(thu[2].label).toBe("Mon 23 Nov · 11:00 AM PKT");
  });
});

describe("booking links", () => {
  const slot = nextSlots(new Date("2026-11-13T10:00:00Z"))[0];

  it("calendarUrl has UTC dates and the encoded email", () => {
    const url = calendarUrl(slot);
    expect(url).toContain("https://calendar.google.com/calendar/render?action=TEMPLATE");
    expect(url).toContain("dates=20261116T060000Z%2F20261116T063000Z");
    expect(url).toContain(encodeURIComponent(profile.email));
  });

  it("mailtoUrl targets the profile email and names the slot", () => {
    const url = mailtoUrl(slot);
    expect(url.startsWith(`mailto:${profile.email}?`)).toBe(true);
    expect(decodeURIComponent(url)).toContain(slot.label);
  });

  it("confirmBooking says nothing is auto-booked and ends with a booking message", () => {
    const msgs = confirmBooking(slot);
    expect(msgs[0].kind === "text" && msgs[0].text).toMatch(/✅.*30 minutes.*Nothing is booked automatically/);
    expect(msgs[1].kind).toBe("booking");
  });
});
