-- Dummy data for building and testing. Safe to run more than once.
-- Prices are whole pounds. Slot times are written in UK time and stored in UTC.

-- The six services from the site's dummy data, plus Chrome powder switched off
-- (the public key must not see it). created_at is staggered to keep this order.
insert into services (name, description, duration_min, price_pounds, deposit_pounds, is_active, created_at)
select name, description, duration_min, price_pounds, 5, is_active, now() + make_interval(secs => n)
from (values
  (1, 'Gel manicure',     'Gel colour on your natural nails.',             45, 25, true),
  (2, 'BIAB overlay',     'Builder gel to strengthen your natural nails.', 60, 35, true),
  (3, 'BIAB infill',      'Infill for an existing BIAB set.',              60, 30, true),
  (4, 'Acrylic full set', 'A new set of acrylic extensions.',              90, 45, true),
  (5, 'Gel removal',      'Gentle removal of gel or BIAB.',                20, 10, true),
  (6, 'Nail art',         'Hand-painted designs on top of any set.',       15, 10, true),
  (7, 'Chrome powder',    'Mirror chrome finish.',                         15,  8, false)
) as s (n, name, description, duration_min, price_pounds, is_active)
where not exists (select 1 from services);

-- The single settings row, with the same dummy values as the site.
insert into settings (
  bank_account_name, bank_sort_code, bank_account_number,
  deposit_policy, address, hours_note, about_text
) values (
  '[Account name]', '[00-00-00]', '[00000000]',
  'Your £5 deposit secures your slot and comes off your total on the day. It is non-refundable if you cancel.',
  E'[Address line]\n[Town, Postcode]',
  'Weekday evenings from 5pm and weekends. Times vary, so check the booking calendar.',
  '[A couple of lines about her — training, style, what clients love about coming in.]'
)
on conflict (id) do nothing;

-- About 20 slots over the three weeks from tomorrow, in her usual pattern:
-- 17:00 on weekdays except Wednesday, 11:00 and 14:00 on Saturday, 12:00 on Sunday.
-- Written in UK time, so the 25 October clock change is handled.
insert into slots (starts_at)
select (d::date + t) at time zone 'Europe/London'
from generate_series((current_date + 1)::timestamp, (current_date + 21)::timestamp, interval '1 day') as d
cross join lateral (
  select unnest(case extract(isodow from d)
    when 3 then array[]::time[]
    when 6 then array[time '11:00', time '14:00']
    when 7 then array[time '12:00']
    else array[time '17:00']
  end) as t
) as times
on conflict (starts_at) do nothing;
