# Slot Machine Food Picker — Design

## Overview

A slot machine website where users randomly pick what to eat. Users manage a list of food items (name + optional image), spin a classic vertical reel, and share their list via a short URL.

## Tech Stack

- **Next.js 14+ (App Router)** — Vercel-optimized, SSR for link previews
- **Tailwind CSS** — styling
- **Framer Motion** — reel, lever, and casino animations
- **Supabase** — Postgres database + Storage for image uploads
- **Howler.js** — sound effects
- **canvas-confetti** — win celebration
- **nanoid** — short code generation

## Data Model (Supabase)

### `food_lists`
| Column       | Type      | Notes                        |
|--------------|-----------|------------------------------|
| id           | uuid (PK) | default gen_random_uuid()    |
| short_code   | varchar   | unique, indexed, e.g. abc123 |
| created_at   | timestamp | default now()                |
| updated_at   | timestamp | default now()                |

### `food_items`
| Column     | Type      | Notes                                  |
|------------|-----------|----------------------------------------|
| id         | uuid (PK) | default gen_random_uuid()              |
| list_id    | uuid (FK) | references food_lists.id, on delete cascade |
| name       | varchar   | required                               |
| image_url  | text      | optional — pasted URL or Storage URL   |
| sort_order | int       |                                        |
| created_at | timestamp | default now()                          |

Image uploads go to a Supabase Storage bucket (`food-images`). Max 5MB, formats: jpg/png/webp/gif.

## Routes

- **`/`** — Landing page, "Create New List" button
- **`/l/[shortCode]`** — Slot machine view + food management drawer
- **`/api/lists`** — POST: create new list, returns short code
- **`/api/upload`** — POST: upload image to Supabase Storage

## UX Flow

1. User visits `/` → clicks "Create New List" → new list created → redirect to `/l/abc123`
2. Empty state prompts adding food items
3. User adds items via slide-out drawer (name + optional image via URL or upload)
4. User pulls lever (desktop) or taps SPIN (mobile) → reel spins → result with fanfare
5. User shares URL → anyone with link can spin and edit the list

No authentication. Anyone with the link can view and edit.

## Slot Machine UI

- **Reel:** Single vertical reel, items show image (or placeholder icon) + name. Rapid scroll → decelerate → snap with bounce.
- **Lever:** Draggable pull lever on the left, spring-back animation triggers spin.
- **Casino lights:** Blinking colored dots around the machine frame (CSS animations).
- **Sounds:** Lever click, spinning ticks (loop), win fanfare (Howler.js).
- **Confetti:** canvas-confetti on result reveal.
- **Result:** Winning item zooms/glows with spotlight, "TODAY YOU EAT:" banner.
- **Theme:** Dark background, gold/red/neon accents, Vegas style. Responsive — mobile uses SPIN button.

## Food Item Management

- Slide-out drawer from right, triggered by gear/menu icon
- Item list with thumbnail + name + delete button (with confirmation)
- "Add Food" form: name input, toggle URL paste / file upload, image preview
- Items without image show a placeholder (fork/knife icon)
- Optimistic UI with toast on sync failure

## Project Structure

```
src/
  app/
    page.tsx                    # Landing
    layout.tsx                  # Root layout
    l/[shortCode]/page.tsx      # Slot machine
    api/lists/route.ts          # Create list
    api/upload/route.ts         # Image upload
  components/
    SlotMachine.tsx
    Reel.tsx
    Lever.tsx
    CasinoLights.tsx
    ResultDisplay.tsx
    FoodDrawer.tsx
    FoodItemForm.tsx
    FoodItemCard.tsx
  lib/
    supabase.ts
    sounds.ts
    shortcode.ts
  assets/sounds/
```
