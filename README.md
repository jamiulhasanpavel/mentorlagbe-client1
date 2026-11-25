# MentorLagbe Client

The Next.js frontend for MentorLagbe. Browser API and Better Auth requests use
same-origin `/api` paths. Next.js proxies those requests to the Express backend,
so authentication cookies remain on the frontend domain.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `BACKEND_API_URL=http://localhost:5000`.
4. Set `IMGBB_API_KEY` if profile image uploads are needed.
5. Start the frontend with `npm run dev` and the backend with `npm run dev` in
   the server repository.

The frontend does not need MongoDB or Better Auth secrets; configure those only
on the backend. Do not set `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_AUTH_URL` to
the backend URL.

## Deploying to Vercel

Deploy the client and the Express backend as separate Vercel projects. Deploy
the backend first so its origin is available to the frontend.

### Backend project

Use the server repository and configure these Vercel environment variables:

- `MONGODB_URI` and `DB_NAME`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`: the canonical frontend origin, without a trailing slash
- `CLIENT_URL`: comma-separated exact frontend origins allowed by CORS
- `BETTER_AUTH_TRUSTED_ORIGINS`: comma-separated exact origins trusted by Better Auth
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` if Google sign-in is enabled
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the three Stripe return URLs
- `IMGBB_API_KEY` if the backend also uses it

Set origins separately for the Vercel Production and Preview environments. Do
not use a broad `*.vercel.app` wildcard. MongoDB Atlas must allow connections
from the backend deployment's network; prefer a restricted/static egress setup
where available.

After deployment, verify `https://<backend-domain>/api/health` returns a
healthy response.

### Frontend project

Use this repository with Vercel's Next.js defaults. Set:

- `BACKEND_API_URL`: the backend deployment origin, such as
  `https://<backend-domain>` (server-only; required at build time)
- `IMGBB_API_KEY`: optional, required for profile image uploads

Do not add backend credentials, MongoDB credentials, Stripe secrets, or
`NEXT_PUBLIC_*` API/auth URLs to the frontend project. The browser uses
same-origin requests and the Next.js rewrite/proxy handles backend routing.

### Authentication, payments, and admin setup

- In Google Cloud Console, register
  `https://<frontend-domain>/api/auth/callback/google` as the authorized
  redirect URI. Set `BETTER_AUTH_URL` to that frontend origin.
- Set Stripe success, cancel, and portal return URLs to the deployed frontend.
  Configure Stripe's webhook endpoint as
  `https://<backend-domain>/api/payments/webhook` and subscribe to checkout
  completion/expiration, invoice paid/payment failed, and subscription
  updated/deleted events.
- Create an administrator account through signup, then promote it from a
  trusted machine with database access using
  `npm run admin:promote -- admin@example.com --confirm` in the server
  repository. Do not expose production database credentials to the frontend.
- Seed sample tuition listings from a trusted environment with
  `npm run seed:tuitions` in the server repository, if needed.
- Demo sign-in is optional. Do not configure demo admin credentials for
  production.

After assigning custom domains, update the exact origin values, OAuth redirect
URI, and Stripe return URLs, then redeploy both projects. Production behavior
with live OAuth and Stripe credentials should be verified before opening the
site to users.

## Features

- Tuition discovery, applications, tutor posting, moderation, and role-based
  dashboards.
- Tutor/student private messaging.
- Student Pro at BDT ৳299/month and Tutor Pro at BDT ৳499/month through
  Stripe-hosted checkout.
- Profile fields and optional ImgBB profile image uploads.
