-- Run in the Supabase SQL Editor. This creates a separate public reviews
-- table; it does not grant public access to customer_enquiries.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name text not null check (char_length(btrim(name)) between 1 and 100),
  rating smallint not null check (rating between 1 and 5),
  review_text text not null check (
    char_length(btrim(review_text)) between 1 and 1000
  ),
  status text not null default 'pending'
    check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

revoke all on table public.reviews from public, anon, authenticated;
grant select (id, name, rating, review_text, status, created_at)
  on table public.reviews to anon, authenticated;
grant insert (submission_id, name, rating, review_text)
  on table public.reviews to anon, authenticated;

drop policy if exists "Anyone can read approved reviews"
  on public.reviews;
create policy "Anyone can read approved reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Anyone can submit pending reviews"
  on public.reviews;
create policy "Anyone can submit pending reviews"
  on public.reviews
  for insert
  to anon, authenticated
  with check (status = 'pending');

notify pgrst, 'reload schema';

-- Review each pending submission before making it public:
-- update public.reviews
-- set status = 'approved'
-- where id = '<review-id>' and status = 'pending';
