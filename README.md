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

## Supabase connection later

The UI is intentionally built without a backend. The future connection points are:

- `customer_enquiries` for the contact form
- `gallery_items` for the project gallery
- `reviews` for customer testimonials
- Supabase Auth + `user_roles` for the admin area

The current form is demo-only and does not store customer data yet.

## Business details already wired into the UI

WhatsApp: 8317666756

Shop:
Plot No. 19, H.No. 1-121/19, Sonata Lane, Miyapur, Allwyn X Roads, Hyderabad, Telangana.

Google Maps:
https://maps.app.goo.gl/531atkbHnKo6R56E8?g_st=awb
