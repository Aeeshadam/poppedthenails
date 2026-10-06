import { addMinutes } from "./dates";

// Builds a calendar (.ics) file for one appointment, attached to the
// "You're booked" email (email 4, step 8).

type CalendarEvent = {
  uid: string;
  start: Date;
  durationMin: number;
  title: string;
  location: string;
  description?: string;
};

/** 2026-10-09T11:30:00Z → "20261009T113000Z" */
function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escape text per RFC 5545: backslash, semicolon, comma and newlines. */
function icsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(event: CalendarEvent, now: Date = new Date()): string {
  const end = addMinutes(event.start, event.durationMin);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//poppedthenail//booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}@poppedthenail`,
    `DTSTAMP:${icsDate(now)}`,
    `DTSTART:${icsDate(event.start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(event.title)}`,
    `LOCATION:${icsText(event.location)}`,
    ...(event.description ? [`DESCRIPTION:${icsText(event.description)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}
