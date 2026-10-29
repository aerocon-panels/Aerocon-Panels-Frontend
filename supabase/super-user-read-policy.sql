-- Add read access for the confirmed Super User without changing the existing
-- public enquiry INSERT policy or granting access to anon/public users.
-- Run in the Supabase SQL Editor for the same project as the frontend.

begin;

alter table public.customer_enquiries enable row level security;

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
      'The confirmed Supabase Auth user saas.agency2021@gmail.com was not found. Confirm that account before applying this migration.';
  end if;

  execute 'drop policy if exists "Super User can read customer enquiries" on public.customer_enquiries';
  execute format(
    'create policy "Super User can read customer enquiries"
      on public.customer_enquiries
      for select
      to authenticated
      using ((select auth.uid()) = %L::uuid)',
    authorized_user_id
  );
end
$$;

-- Supabase's table privilege is role-based; the SELECT policy above is what
-- limits returned rows to the single confirmed Auth user.
grant select on table public.customer_enquiries to authenticated;

notify pgrst, 'reload schema';

commit;
