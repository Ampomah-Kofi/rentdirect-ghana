# RentDirect Ghana

RentDirect Ghana is a Next.js marketplace prototype for helping tenants find rooms directly from landlords in Ghana without agent fees. It is designed for tenants, landlords, diaspora families helping from abroad, and an admin team that can review listings, reports, and payments.

## What Is Built

- Premium landing page for the RentDirect Ghana vision.
- Browse, compare, favorite, and inspect room listings.
- Landlord upload and dashboard flows.
- Admin review center for listings, payment records, and safety reports.
- Monetization model for free, standard, and featured listings.
- Safety, privacy, and terms pages for launch readiness.
- In-app demo and autopilot walkthrough for prototype testing.
- Unit tests, typechecking, Playwright browser tests, and GitHub Actions CI.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

Run these before pushing major changes:

```bash
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Deployment

The app is deployment-ready as a standard Next.js Node app. The project already includes the required scripts:

```json
{
  "build": "next build",
  "start": "next start"
}
```

Recommended first production host: Vercel.

Vercel settings:

- Framework preset: `Next.js`
- Build command: `npm run build`
- Install command: `npm ci`
- Output directory: leave empty/default
- Node version: `22.x`
- Environment variables: none required for the current prototype

After connecting the GitHub repo to Vercel, every push to `master` can create a fresh deployment.

## Prototype Limits

This is not yet a real backend product. Listing data, payment records, reports, and demo actions currently live in browser/local prototype state. Before public launch with real users, add:

- Real authentication for tenants, landlords, and admins.
- A database for listings, reports, payments, and user accounts.
- Secure file/image uploads.
- Real payment provider integration for Mobile Money/cards.
- Moderation workflows and legal review for Ghana rental compliance.

## Useful Routes

- `/` - homepage
- `/browse` - tenant marketplace
- `/landlord/upload` - landlord listing upload
- `/landlord/dashboard` - landlord dashboard
- `/admin` - admin review center
- `/demo` - prototype command center
- `/demo/autopilot` - guided walkthrough
- `/launch` - launch/pilot page
- `/safety` - safety center
- `/privacy` - privacy notice
- `/terms` - terms page
