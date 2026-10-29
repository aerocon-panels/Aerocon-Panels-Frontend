-- Run this in the Supabase SQL Editor for the existing customer_enquiries table.

-- Confirm the specifically authorized account exists and has a verified email.
-- Authorization below uses the email claim in Supabase's signed JWT, not
-- user-editable metadata or a frontend-only check.
do $$
declare
  authorized_user_id uuid;
begin
  select id
  into authorized_user_id
  from auth.users
  where lower(email) = lower('saas.agency2021@gmail.com')
    and email_confirmed_at is not null;

  if authorized_user_id is null then
    raise exception
      'The confirmed Supabase Auth user saas.agency2021@gmail.com was not found. Create/confirm that user before applying this migration.';
  end if;
end
$$;

alter table public.customer_enquiries enable row level security;

-- Remove old policies so no earlier permissive policy can grant broader
-- access through PostgreSQL's permissive-policy OR behavior.
do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'customer_enquiries'
  loop
    execute format(
      'drop policy %I on public.customer_enquiries',
      existing_policy.policyname
    );
  end loop;
end
$$;

revoke all on table public.customer_enquiries from public, anon, authenticated;
grant select, insert, update, delete
  on table public.customer_enquiries to authenticated;
grant insert (name, email, phone, message)
  on table public.customer_enquiries to anon;

create policy "Super User can manage customer enquiries"
  on public.customer_enquiries
  for all
  to authenticated
  using (
    lower((select auth.jwt() ->> 'email')) = 'saas.agency2021@gmail.com'
  )
  with check (
    lower((select auth.jwt() ->> 'email')) = 'saas.agency2021@gmail.com'
  );

-- Preserve public enquiry form inserts. The anon role gets INSERT only; no
-- public read, update, or delete access is granted. Authenticated customers
-- can still use the existing public enquiry form.
create policy "Public can submit customer enquiries"
  on public.customer_enquiries
  for insert
  to anon, authenticated
  with check (true);

notify pgrst, 'reload schema';
