# What To Eat Today? 🎰

[中文版](./README.zh-CN.md)

> Can't decide what to eat? Pull the lever and let the slot machine choose for you.

**What To Eat Today?** is a casino-themed slot machine web app that turns the daily "what should I eat" dilemma into a fun, shareable game. Create a food list, add your favorites, and spin the reels. The center reel picks your meal — unless all three match, then it's a jackpot!

## Live Demo

[whattoday-ten.vercel.app](https://whattoday-ten.vercel.app)

## Screenshots

<!-- Add screenshots here -->

## Features

**Slot Machine**
- Photorealistic skeuomorphic design with brushed steel cabinet, chrome bezels, and backlit paytable
- Three independent reels with staggered spin timing and mechanical bounce-back animation
- Spring-physics lever with damped oscillation
- Jackpot celebration with confetti when all three reels match
- Sound effects for lever pull, reel spin, and win

**Food Management**
- Add food items with custom names and optional images (URL or upload)
- Delete items with confirmation
- Guided onboarding — food drawer opens automatically for new lists

**Sharing**
- Each list gets a unique short link
- Share button appears in the result overlay after each spin
- Recipients see the same food list and can spin themselves

**Internationalization**
- Auto-detects browser language
- English and Chinese (Simplified) supported

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, TypeScript) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Storage | [Supabase Storage](https://supabase.com/docs/guides/storage) |
| Sound | [Howler.js](https://howlerjs.com) |
| Effects | [canvas-confetti](https://github.com/catdad/canvas-confetti) |
| Fonts | Press Start 2P, Abril Fatface (Google Fonts) |
| Deployment | [Vercel](https://vercel.com) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/ehowang/whattoday.git
cd whattoday
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. Go to **Storage** → create a bucket named `food-images` → set to **Public**
4. Go to **Settings** → **API** and copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Push to GitHub and import the repository on [Vercel](https://vercel.com). Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings. Vercel auto-detects Next.js and handles the rest.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout with fonts
│   ├── globals.css               # Casino theme CSS
│   ├── api/
│   │   ├── lists/route.ts        # POST: create new food list
│   │   └── upload/route.ts       # POST: upload food image
│   └── l/[shortCode]/
│       ├── page.tsx              # SSR list page
│       └── SlotMachineClient.tsx # Client-side slot machine wrapper
├── components/
│   ├── SlotMachine.tsx           # Main cabinet with paytable, reels, controls
│   ├── Reel.tsx                  # Single reel with bounce-back animation
│   ├── Lever.tsx                 # Spring-physics pull lever
│   ├── ResultDisplay.tsx         # Win overlay with share button
│   ├── FoodDrawer.tsx            # Slide-in food management panel
│   ├── FoodItemForm.tsx          # Add food form (name + image)
│   ├── FoodItemCard.tsx          # Food item with delete
│   └── CasinoLights.tsx         # Decorative indicator lights
└── lib/
    ├── supabase.ts               # Supabase client (lazy singleton)
    ├── i18n.ts                   # Browser language detection + translations
    ├── sounds.ts                 # Sound effect manager (Howler.js)
    ├── shortcode.ts              # nanoid-based short code generator
    └── types.ts                  # TypeScript interfaces
```

## License

MIT
