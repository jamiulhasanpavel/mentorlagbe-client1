This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

The app exposes Better Auth at `/api/auth` and stores users and sessions in MongoDB. Configure `MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` using `.env.example`. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are both required to enable Google sign-in; the provider is omitted if either is missing. Profile photo uploads use the server-only `IMGBB_API_KEY`; uploads remain disabled until it is configured.

The signup role is stored as a validated `student` or `tutor` user field. Admin access is not available through public signup; provision administrator roles through a trusted server-side process. For a separate auth origin, set `NEXT_PUBLIC_AUTH_URL` to its full `/api/auth` endpoint and include the frontend origin in `BETTER_AUTH_TRUSTED_ORIGINS`.

Payments use SSLCOMMERZ hosted checkout in BDT. Configure `APP_BASE_URL` as a publicly reachable HTTPS origin in production, plus `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, and `SSLCOMMERZ_SANDBOX` from your merchant account. For local sandbox testing, expose the app through a public HTTPS tunnel and use that URL for `APP_BASE_URL`; SSLCOMMERZ cannot call `localhost`. Sandbox mode is enabled unless `SSLCOMMERZ_SANDBOX=false`. The monthly plan prices are one-time payments with manual renewal, not automatic subscriptions. Return callbacks and IPN notifications are verified against SSLCOMMERZ before payment status is updated. Validated payment transactions are stored in MongoDB; plan-feature entitlement checks are not yet connected to app features.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
