# Aerocon Panels Frontend

This is the complete frontend-only version of the Aerocon Panels website.

## Run locally

1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run:

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Build for deployment

```bash
npm run build
```

The production files will be in `dist/`.

## Private Super User dashboard

The public website remains available without signing in. The header's **Super User**
button opens a separate login and customer-enquiry dashboard. The dashboard uses
Supabase Auth and displays the dashboard only for the confirmed
`saas.agency2021@gmail.com` account. Row Level Security must be configured before
the dashboard can access customer records.

### Supabase setup

1. In Supabase Authentication, confirm the `saas.agency2021@gmail.com` user
   exists and its email is verified. Public sign-up is not required for this
   feature; this website has no public Super User registration flow.
2. Run [`supabase/super-user-dashboard.sql`](./supabase/super-user-dashboard.sql)
   in the SQL Editor for the same project as the frontend. The migration stops
   if that exact confirmed account is missing, then replaces
   `customer_enquiries` policies with Super User-only management plus the
   existing public enquiry insert behavior.
3. Sign in at `/#super-user` using that confirmed account.

The database RLS policy checks the exact email in Supabase's signed JWT. Only
that account can select, insert, update, or delete customer enquiry records.
Anonymous and regular authenticated visitors retain insert-only access needed
by the public enquiry form; they cannot read, update, or delete customer
records. The frontend email check is only a UI gate; RLS is the security
boundary. No service-role key is used in the frontend.

The dashboard selects the existing `name`, `email`, and `phone` enquiry columns.
It omits optional email display when all email values are blank and does not
assume an address column exists. No service-role key is used in the frontend.
To import the supplied party list, run
[`supabase/import-customer-parties.sql`](./supabase/import-customer-parties.sql)
in the same project's SQL Editor. It validates that the name and phone columns
are text, stops if another required column cannot be populated, skips and
reports exact name-and-phone matches, and returns import and duplicate counts.

### Public customer reviews

Run [`supabase/customer-reviews.sql`](./supabase/customer-reviews.sql) in the
Supabase SQL Editor to create the separate `reviews` table. Customers can submit
reviews with a pending status; only approved reviews are returned to the public
site. Review approval is manual in Supabase SQL Editor, for example:

```sql
update public.reviews
set status = 'approved'
where id = '<review-id>' and status = 'pending';
```

The public website can read only the display fields of approved reviews and
submit new pending reviews. The table's unique submission ID prevents retry
attempts from creating duplicate reviews. The migration grants no public access
to `customer_enquiries`.

## Business details already wired into the UI

WhatsApp: 8317666756

Shop:
Plot No. 19, H.No. 1-121/19, Sonata Lane, Miyapur, Allwyn X Roads, Hyderabad, Telangana.

Google Maps:
https://maps.app.goo.gl/531atkbHnKo6R56E8?g_st=awb
