-- Booking references come from a sequence (POP-1001, POP-1002, ...), so they
-- can never clash and the app doesn't have to pick and retry random ones.
create sequence booking_reference_seq start 1001;

alter table bookings
  alter column reference set default 'POP-' || nextval('booking_reference_seq');
