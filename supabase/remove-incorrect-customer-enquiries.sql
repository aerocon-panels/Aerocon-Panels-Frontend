-- Inspect and remove only the two specifically identified incorrect records.
-- Run in the Supabase SQL Editor for the project containing customer_enquiries.
-- A target is deleted only when exactly one row matches both name and phone.

begin;

create temporary table requested_customer_removals (
  name text not null,
  phone text not null,
  primary key (name, phone)
) on commit drop;

insert into requested_customer_removals (name, phone) values
  ('DhanpalNikhil', '7981490543'),
  ('2401600018', '08341523158');

create temporary table exact_customer_matches (
  name text not null,
  phone text not null,
  match_count bigint not null,
  matched_ids bigint[] not null,
  primary key (name, phone)
) on commit drop;

insert into exact_customer_matches (name, phone, match_count, matched_ids)
select
  requested.name,
  requested.phone,
  count(enquiry.id),
  coalesce(
    array_agg(enquiry.id order by enquiry.id)
      filter (where enquiry.id is not null),
    array[]::bigint[]
  )
from requested_customer_removals as requested
left join public.customer_enquiries as enquiry
  on enquiry.name = requested.name
 and enquiry.phone = requested.phone
group by requested.name, requested.phone;

-- Review exact matches before the deletion statement runs.
select
  requested.name,
  requested.phone,
  matches.match_count as exact_match_count,
  matches.matched_ids
from requested_customer_removals as requested
join exact_customer_matches as matches
  using (name, phone)
order by requested.name;

with deleted as (
  delete from public.customer_enquiries as enquiry
  using exact_customer_matches as matches
  where matches.match_count = 1
    and enquiry.id = matches.matched_ids[1]
    and enquiry.name = matches.name
    and enquiry.phone = matches.phone
  returning enquiry.id, enquiry.name, enquiry.phone
)
select
  requested.name,
  requested.phone,
  matches.match_count as exact_match_count,
  case
    when matches.match_count = 0 then 'not found; nothing deleted'
    when matches.match_count > 1 then 'multiple exact matches; nothing deleted'
    when count(deleted.id) = 1 then 'deleted'
    else 'exact row changed before deletion; nothing deleted'
  end as result,
  array_agg(deleted.id order by deleted.id)
    filter (where deleted.id is not null) as deleted_ids
from requested_customer_removals as requested
join exact_customer_matches as matches
  using (name, phone)
left join deleted
  on deleted.name = requested.name
 and deleted.phone = requested.phone
group by requested.name, requested.phone, matches.match_count
order by requested.name;

select count(*) as remaining_customer_enquiries
from public.customer_enquiries;

commit;
