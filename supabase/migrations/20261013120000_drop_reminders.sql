-- The day-before reminder email was dropped (13 October 2026), so nothing records it.
alter table bookings drop column reminder_sent_at;
