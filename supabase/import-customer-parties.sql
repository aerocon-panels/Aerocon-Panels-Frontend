-- Import the 26 supplied party records into public.customer_enquiries.
-- Run in the Supabase SQL Editor for the same project as the website.
-- Exact name + phone matches are reported and skipped. No phone formatting
-- is changed, and no email, address, or message values are fabricated.

begin;

do $$
declare
  invalid_columns text;
  unmapped_required_columns text;
begin
  select string_agg(column_name || ' (' || data_type || ')', ', ')
  into invalid_columns
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'customer_enquiries'
    and (
      (column_name = 'name' and data_type not in ('text', 'character varying', 'character'))
      or
      (column_name = 'phone' and data_type not in ('text', 'character varying', 'character'))
    );

  if invalid_columns is not null then
    raise exception
      'Import stopped: name and phone must be text columns. Found: %',
      invalid_columns;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'customer_enquiries'
      and column_name = 'name'
  ) or not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'customer_enquiries'
      and column_name = 'phone'
  ) then
    raise exception
      'Import stopped: public.customer_enquiries must contain name and phone columns.';
  end if;

  select string_agg(quote_ident(column_name), ', ')
  into unmapped_required_columns
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'customer_enquiries'
    and is_nullable = 'NO'
    and column_default is null
    and is_identity = 'NO'
    and is_generated = 'NEVER'
    and column_name not in ('name', 'phone');

  if unmapped_required_columns is not null then
    raise exception
      'Import stopped: these required columns have no supplied values: %. Inspect the schema and map them before importing.',
      unmapped_required_columns;
  end if;
end
$$;

create temporary table supplied_customer_parties (
  name text not null,
  phone text not null,
  primary key (name, phone)
) on commit drop;

insert into supplied_customer_parties (name, phone) values
  ('Ravi Kondapur', '+919908787554'),
  ('Zubair Ahmed', '919966222091'),
  ('Naveen Chary Patancheru', '+919491228498'),
  ('*Billing details for BCKS Franchise Jubilee Hills*', '917008680032'),
  ('Mahboob, LB Nagar', '+91 95154 40641'),
  ('SRI R.B GUPTA ENTERPRISES', '9052224108'),
  ('TOT BEVERAGES AND FOODS PRIVATE LIMITED', '+91 90032 37442'),
  ('ULLAS SHIVASHANKAR', '+91 94949 94433'),
  ('Vijay, Lagan party', '919494994433'),
  ('ROMAN WOOD CRAFTS PRIVATE LIMITED', '+91 89195 32484'),
  ('Rouf Shareef', '918106652514'),
  ('NATIONAL PLASTER', '9985078655'),
  ('Raju, Aparna county', '919550235136'),
  ('HANUMAN ENGINEERING', '+91 79890 18725'),
  ('Jehovah’s Witnesses of India, The Arcade at Brig', '919618771056'),
  ('SURENDER VERMA INTERIORS', '+91 70137 28293'),
  ('Rehan - Indiamart', '+91-8519965163'),
  ('Mathew & Mittal Infra Solutions F 402 Grand Ajna', '+91 96508 55110'),
  ('SINEW ENGINEERING', '+91 91772 34383'),
  ('Dastagir machine pvt Ltd', '+91 92484 07568'),
  ('Ahmed, Hafeezpet', '918686466525'),
  ('Shabaz, Bachupally', '917093674267'),
  ('A3M contracts private Ltd', '+91 95994 98495'),
  ('ARMOOR KAMAKSHI', '+91 95025 00252'),
  ('SILRES ENERGY SOLUTIONS PRIVATE LIMITED', '+91 92473 76258'),
  ('BCKS Franchise LLP 1st Floor, Plot #769, Rd Nu', '7008680032');

create temporary table customer_party_import_results (
  status text not null,
  name text not null,
  phone text not null,
  existing_matches bigint not null
) on commit drop;

with matches as (
  select supplied.name, supplied.phone, count(existing.*) as existing_matches
  from supplied_customer_parties as supplied
  join public.customer_enquiries as existing
    on existing.name = supplied.name
   and existing.phone = supplied.phone
  group by supplied.name, supplied.phone
),
inserted as (
  insert into public.customer_enquiries (name, phone)
  select supplied.name, supplied.phone
  from supplied_customer_parties as supplied
  where not exists (
    select 1
    from matches
    where matches.name = supplied.name
      and matches.phone = supplied.phone
  )
  returning name, phone
)
insert into customer_party_import_results (status, name, phone, existing_matches)
select 'duplicate_skipped', name, phone, existing_matches
from matches
union all
select 'imported', name, phone, 0
from inserted;

select status, name, phone, existing_matches
from customer_party_import_results
order by status, name, phone;

select
  count(*) filter (where status = 'imported') as records_imported,
  count(*) filter (where status = 'duplicate_skipped') as duplicate_records_skipped
from customer_party_import_results;

commit;
