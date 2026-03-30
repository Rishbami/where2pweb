This is the web version of `where2p`, built with Next.js and wired to use Firebase as its first backend layer.

## Firebase setup

1. Create a Firebase project in the Firebase console.
2. Add a Web App inside that project.
3. Copy `.env.example` to `.env.local`.
4. Paste your Firebase Web App config values into the `NEXT_PUBLIC_FIREBASE_*` variables.

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If your Firebase keys are present, the homepage will confirm that the Firebase SDK initialized successfully.

## Current stack

- Next.js 16 App Router
- React 19
- Firebase Web SDK
- Tailwind CSS 4

## Next steps

- Firebase Auth
- Firestore data model
- Portfolio-ready landing page content
- Deployed preview for LinkedIn and startup demos
