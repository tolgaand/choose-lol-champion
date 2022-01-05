# Choose Lol Champion

Choose dec you think is the strongest among the two champions.

# Motivation

In a tutorial I watched, he was doing it according to the rolling of pokemon, so I adapted it for league of legends. [You can go to the tutorial here](https://www.twitch.tv/videos/1215014362), thank you Theo!

# Getting Started

Prerequisite:

- MySQL local database (or Planetscale connection using PScale CLI)
- npm

Setup

1. Clone repo
2. `npm install`
3. Change `example.env` to `.env`
4. Add connection URLs for both database and shadow db to .env
5. Initialize database - `npx prisma migrate dev`
6. Initialize base data set - `npm run ts-node ./scripts/fill-db.ts`
7. Run dev server `npm run dev`
