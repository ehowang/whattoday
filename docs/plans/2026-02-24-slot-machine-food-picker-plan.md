# Slot Machine Food Picker — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a casino-themed slot machine web app where users spin a reel to randomly pick what to eat, with CRUD for food items and shareable lists.

**Architecture:** Next.js App Router with server-side rendering for shareable link previews. Supabase Postgres stores food lists and items; Supabase Storage handles image uploads. Framer Motion powers all animations (reel, lever, lights). Client-side sound via Howler.js, confetti via canvas-confetti.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion, Supabase (Postgres + Storage), Howler.js, canvas-confetti, nanoid

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `.env.local.example`, `.gitignore`

**Step 1: Initialize Next.js project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Project scaffolded with Next.js, TypeScript, Tailwind, App Router in `src/` directory.

**Step 2: Install dependencies**

Run:
```bash
npm install framer-motion howler canvas-confetti @supabase/supabase-js nanoid@3
npm install -D @types/howler @types/canvas-confetti
```

**Step 3: Create `.env.local.example`**

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Step 4: Update Tailwind config for casino theme**

In `tailwind.config.ts`, extend the theme with custom colors:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        casino: {
          gold: "#FFD700",
          red: "#DC143C",
          dark: "#1a0a2e",
          darker: "#0d0519",
          neon: "#ff6b35",
          green: "#00ff88",
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 5: Set up root layout with dark theme and Google Font**

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "What To Eat Today? | Slot Machine Food Picker",
  description: "Spin the slot machine to decide what to eat! Add your favorite foods and let fate choose.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-casino-darker text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
```

**Step 6: Placeholder landing page**

`src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="font-display text-casino-gold text-2xl">
        What To Eat Today?
      </h1>
    </main>
  );
}
```

**Step 7: Verify dev server**

Run: `npm run dev`
Expected: Page renders at localhost:3000 with gold title text on dark background.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with casino theme"
```

---

### Task 2: Supabase Client & Schema

**Files:**
- Create: `src/lib/supabase.ts`, `supabase/schema.sql`
- Create: `src/lib/types.ts`

**Step 1: Create Supabase SQL schema file**

`supabase/schema.sql` — for reference and manual execution in Supabase dashboard:

```sql
-- Food Lists
create table food_lists (
  id uuid primary key default gen_random_uuid(),
  short_code varchar(10) unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_food_lists_short_code on food_lists(short_code);

-- Food Items
create table food_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references food_lists(id) on delete cascade not null,
  name varchar(100) not null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index idx_food_items_list_id on food_items(list_id);

-- Storage bucket (run in Supabase dashboard > Storage)
-- Create bucket: food-images (public)

-- RLS policies: allow all operations (no auth)
alter table food_lists enable row level security;
alter table food_items enable row level security;

create policy "Allow all on food_lists" on food_lists for all using (true) with check (true);
create policy "Allow all on food_items" on food_items for all using (true) with check (true);
```

**Step 2: Create TypeScript types**

`src/lib/types.ts`:

```ts
export interface FoodList {
  id: string;
  short_code: string;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string;
  list_id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}
```

**Step 3: Create Supabase client**

`src/lib/supabase.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 4: Commit**

```bash
git add src/lib/supabase.ts src/lib/types.ts supabase/schema.sql
git commit -m "feat: add Supabase client, types, and schema"
```

---

### Task 3: Short Code Generation & API Route — Create List

**Files:**
- Create: `src/lib/shortcode.ts`
- Create: `src/app/api/lists/route.ts`

**Step 1: Create short code generator**

`src/lib/shortcode.ts`:

```ts
import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
export const generateShortCode = customAlphabet(alphabet, 6);
```

**Step 2: Create API route to create a new list**

`src/app/api/lists/route.ts`:

```ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateShortCode } from "@/lib/shortcode";

export async function POST() {
  const shortCode = generateShortCode();

  const { data, error } = await supabase
    .from("food_lists")
    .insert({ short_code: shortCode })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ shortCode: data.short_code });
}
```

**Step 3: Verify endpoint**

Run: `curl -X POST http://localhost:3000/api/lists`
Expected: `{"shortCode":"abc123"}` (random 6-char code)

**Step 4: Commit**

```bash
git add src/lib/shortcode.ts src/app/api/lists/route.ts
git commit -m "feat: add list creation API with short code generation"
```

---

### Task 4: Image Upload API Route

**Files:**
- Create: `src/app/api/upload/route.ts`

**Step 1: Create upload API route**

`src/app/api/upload/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const fileName = `${nanoid()}.${ext}`;

  const { error } = await supabase.storage
    .from("food-images")
    .upload(fileName, file, {
      contentType: file.type,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("food-images")
    .getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}
```

**Step 2: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: add image upload API with validation"
```

---

### Task 5: Landing Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Build the landing page with "Create New List" flow**

`src/app/page.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/lists", { method: "POST" });
      const data = await res.json();
      if (data.shortCode) {
        router.push(`/l/${data.shortCode}`);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="font-display text-casino-gold text-3xl md:text-5xl mb-4 leading-relaxed">
          WHAT TO EAT
        </h1>
        <h2 className="font-display text-casino-gold text-2xl md:text-4xl mb-6">
          TODAY?
        </h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Can&apos;t decide what to eat? Let the slot machine decide for you!
          Add your favorite foods and spin the reel.
        </p>
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-casino-red hover:bg-red-700 text-white font-display text-sm
                   px-8 py-4 rounded-lg transition-all hover:scale-105
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-casino-red/30"
      >
        {loading ? "CREATING..." : "CREATE NEW LIST"}
      </button>
    </main>
  );
}
```

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Dark page with gold title, red "CREATE NEW LIST" button. Clicking creates a list and redirects.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add landing page with create list button"
```

---

### Task 6: Slot Machine Page — Data Fetching & Layout Shell

**Files:**
- Create: `src/app/l/[shortCode]/page.tsx`

**Step 1: Create the slot machine page with SSR data fetching**

`src/app/l/[shortCode]/page.tsx`:

```tsx
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { FoodItem, FoodList } from "@/lib/types";
import SlotMachineClient from "./SlotMachineClient";

interface Props {
  params: Promise<{ shortCode: string }>;
}

export default async function SlotMachinePage({ params }: Props) {
  const { shortCode } = await params;

  const { data: list } = await supabase
    .from("food_lists")
    .select("*")
    .eq("short_code", shortCode)
    .single();

  if (!list) notFound();

  const { data: items } = await supabase
    .from("food_items")
    .select("*")
    .eq("list_id", list.id)
    .order("sort_order", { ascending: true });

  return (
    <SlotMachineClient
      list={list as FoodList}
      initialItems={(items as FoodItem[]) || []}
    />
  );
}
```

**Step 2: Create the client wrapper**

`src/app/l/[shortCode]/SlotMachineClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { FoodItem, FoodList } from "@/lib/types";

interface Props {
  list: FoodList;
  initialItems: FoodItem[];
}

export default function SlotMachineClient({ list, initialItems }: Props) {
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative">
      {/* Placeholder for slot machine */}
      <div className="text-center">
        <p className="text-gray-400 mb-2">List: {list.short_code}</p>
        <p className="text-gray-400">{items.length} food items</p>
      </div>

      {/* Gear icon to open drawer */}
      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className="fixed top-4 right-4 text-casino-gold text-2xl z-50
                   hover:scale-110 transition-transform"
        aria-label="Manage food items"
      >
        ⚙️
      </button>

      {/* Placeholder for drawer */}
      {drawerOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-casino-dark border-l border-casino-gold/30 z-40 p-4">
          <h2 className="font-display text-casino-gold text-sm mb-4">FOOD ITEMS</h2>
          <p className="text-gray-400">Drawer content coming next...</p>
        </div>
      )}
    </main>
  );
}
```

**Step 3: Verify in browser**

Navigate to a created list URL. Expected: dark page showing list code and item count, gear icon opens placeholder drawer.

**Step 4: Commit**

```bash
git add src/app/l/
git commit -m "feat: add slot machine page with SSR data fetching"
```

---

### Task 7: Food Item Management Drawer

**Files:**
- Create: `src/components/FoodDrawer.tsx`
- Create: `src/components/FoodItemCard.tsx`
- Create: `src/components/FoodItemForm.tsx`
- Modify: `src/app/l/[shortCode]/SlotMachineClient.tsx`

**Step 1: Create FoodItemCard**

`src/components/FoodItemCard.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { FoodItem } from "@/lib/types";

interface Props {
  item: FoodItem;
  onDelete: (id: string) => void;
}

export default function FoodItemCard({ item, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-3 bg-casino-darker rounded-lg p-2">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-10 h-10 rounded object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded bg-casino-dark flex items-center justify-center text-lg">
          🍴
        </div>
      )}

      <span className="flex-1 text-sm truncate">{item.name}</span>

      {confirming ? (
        <div className="flex gap-1">
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs bg-casino-red px-2 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-xs bg-gray-600 px-2 py-1 rounded"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="text-gray-500 hover:text-casino-red transition-colors text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
}
```

**Step 2: Create FoodItemForm**

`src/components/FoodItemForm.tsx`:

```tsx
"use client";

import { useState } from "react";

interface Props {
  onAdd: (name: string, imageUrl: string | null) => void;
}

export default function FoodItemForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        setPreview(data.url);
      }
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit() {
    if (!name.trim()) return;
    const finalUrl = imageUrl.trim() || null;
    onAdd(name.trim(), finalUrl);
    setName("");
    setImageUrl("");
    setPreview(null);
  }

  return (
    <div className="space-y-3 bg-casino-darker rounded-lg p-3">
      <input
        type="text"
        placeholder="Food name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-casino-dark border border-casino-gold/30 rounded px-3 py-2
                   text-sm text-white placeholder-gray-500 focus:outline-none focus:border-casino-gold"
      />

      <div className="flex gap-2">
        <button
          onClick={() => setImageMode("url")}
          className={`text-xs px-3 py-1 rounded ${
            imageMode === "url" ? "bg-casino-gold text-black" : "bg-casino-dark text-gray-400"
          }`}
        >
          URL
        </button>
        <button
          onClick={() => setImageMode("upload")}
          className={`text-xs px-3 py-1 rounded ${
            imageMode === "upload" ? "bg-casino-gold text-black" : "bg-casino-dark text-gray-400"
          }`}
        >
          Upload
        </button>
      </div>

      {imageMode === "url" ? (
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            setPreview(e.target.value || null);
          }}
          className="w-full bg-casino-dark border border-casino-gold/30 rounded px-3 py-2
                     text-sm text-white placeholder-gray-500 focus:outline-none focus:border-casino-gold"
        />
      ) : (
        <label className="block">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
            className="text-sm text-gray-400 file:mr-3 file:py-1 file:px-3
                       file:rounded file:border-0 file:text-xs
                       file:bg-casino-gold file:text-black file:cursor-pointer"
          />
          {uploading && <span className="text-xs text-casino-gold">Uploading...</span>}
        </label>
      )}

      {preview && (
        <img src={preview} alt="Preview" className="w-full h-24 object-cover rounded" />
      )}

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="w-full bg-casino-green text-black font-bold text-sm py-2 rounded
                   hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        ADD FOOD
      </button>
    </div>
  );
}
```

**Step 3: Create FoodDrawer**

`src/components/FoodDrawer.tsx`:

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { FoodItem } from "@/lib/types";
import FoodItemCard from "./FoodItemCard";
import FoodItemForm from "./FoodItemForm";

interface Props {
  open: boolean;
  onClose: () => void;
  items: FoodItem[];
  onAdd: (name: string, imageUrl: string | null) => void;
  onDelete: (id: string) => void;
}

export default function FoodDrawer({ open, onClose, items, onAdd, onDelete }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-casino-dark
                       border-l border-casino-gold/30 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-casino-gold/20">
              <h2 className="font-display text-casino-gold text-xs">FOOD ITEMS</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <FoodItemForm onAdd={onAdd} />

              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No food items yet. Add some above!
                  </p>
                ) : (
                  items.map((item) => (
                    <FoodItemCard key={item.id} item={item} onDelete={onDelete} />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 4: Update SlotMachineClient to wire up drawer with Supabase CRUD**

Update `src/app/l/[shortCode]/SlotMachineClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { FoodItem, FoodList } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import FoodDrawer from "@/components/FoodDrawer";

interface Props {
  list: FoodList;
  initialItems: FoodItem[];
}

export default function SlotMachineClient({ list, initialItems }: Props) {
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleAdd(name: string, imageUrl: string | null) {
    const newItem: FoodItem = {
      id: crypto.randomUUID(),
      list_id: list.id,
      name,
      image_url: imageUrl,
      sort_order: items.length,
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    setItems((prev) => [...prev, newItem]);

    const { error } = await supabase.from("food_items").insert({
      id: newItem.id,
      list_id: list.id,
      name,
      image_url: imageUrl,
      sort_order: newItem.sort_order,
    });

    if (error) {
      setItems((prev) => prev.filter((i) => i.id !== newItem.id));
      alert("Failed to add item");
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((items) => items.filter((i) => i.id !== id));

    const { error } = await supabase.from("food_items").delete().eq("id", id);
    if (error) {
      setItems(prev);
      alert("Failed to delete item");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* Slot machine will go here */}
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-4">{items.length} items in list</p>
        {items.length === 0 && (
          <p className="text-casino-gold font-display text-xs">
            TAP ⚙️ TO ADD FOOD ITEMS
          </p>
        )}
      </div>

      {/* Gear icon */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed top-4 right-4 text-casino-gold text-2xl z-30
                   hover:scale-110 transition-transform"
        aria-label="Manage food items"
      >
        ⚙️
      </button>

      <FoodDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </main>
  );
}
```

**Step 5: Verify in browser**

Open a list URL. Click gear icon → drawer slides in. Add a food item → appears in list. Delete → removed. Refresh page → data persists.

**Step 6: Commit**

```bash
git add src/components/ src/app/l/
git commit -m "feat: add food item management drawer with CRUD"
```

---

### Task 8: Casino Lights Component

**Files:**
- Create: `src/components/CasinoLights.tsx`

**Step 1: Build the blinking lights border**

`src/components/CasinoLights.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

interface Props {
  className?: string;
}

export default function CasinoLights({ className = "" }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(interval);
  }, []);

  const bulbCount = 40;
  const colors = ["#FFD700", "#DC143C", "#00ff88", "#ff6b35"];

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {Array.from({ length: bulbCount }).map((_, i) => {
        const angle = (i / bulbCount) * 360;
        const isOn = (i + tick) % 2 === 0;
        const color = colors[i % colors.length];
        // Position bulbs around the border
        const side = Math.floor(i / (bulbCount / 4));
        const progress = (i % (bulbCount / 4)) / (bulbCount / 4);

        let top: string, left: string;
        switch (side) {
          case 0: top = "0%"; left = `${progress * 100}%`; break;     // top
          case 1: top = `${progress * 100}%`; left = "100%"; break;   // right
          case 2: top = "100%"; left = `${(1 - progress) * 100}%`; break; // bottom
          default: top = `${(1 - progress) * 100}%`; left = "0%"; break;  // left
        }

        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
            style={{
              top,
              left,
              backgroundColor: color,
              opacity: isOn ? 1 : 0.2,
              boxShadow: isOn ? `0 0 8px 2px ${color}` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/CasinoLights.tsx
git commit -m "feat: add casino blinking lights component"
```

---

### Task 9: Slot Machine Reel Animation

**Files:**
- Create: `src/components/Reel.tsx`
- Create: `src/components/SlotMachine.tsx`

**Step 1: Create the Reel component**

`src/components/Reel.tsx`:

```tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useImperativeHandle, forwardRef } from "react";
import type { FoodItem } from "@/lib/types";

export interface ReelHandle {
  spin: () => Promise<FoodItem>;
}

interface Props {
  items: FoodItem[];
}

const ITEM_HEIGHT = 120;
const VISIBLE_ITEMS = 1;

const Reel = forwardRef<ReelHandle, Props>(({ items }, ref) => {
  const controls = useAnimation();

  // Create an extended strip: repeat items multiple times for long scroll
  const repeats = 10;
  const strip = Array.from({ length: repeats }, () => items).flat();

  useImperativeHandle(ref, () => ({
    async spin(): Promise<FoodItem> {
      if (items.length === 0) return items[0];

      // Pick random winner
      const winnerIndex = Math.floor(Math.random() * items.length);
      // Target position: scroll through several repeats then land on winner
      const targetRepeat = repeats - 2;
      const targetIndex = targetRepeat * items.length + winnerIndex;
      const targetY = -(targetIndex * ITEM_HEIGHT);

      // Reset to top
      await controls.set({ y: 0 });

      // Spin animation
      await controls.start({
        y: targetY,
        transition: {
          duration: 4,
          ease: [0.15, 0.85, 0.35, 1.02], // custom ease with slight overshoot
        },
      });

      return items[winnerIndex];
    },
  }));

  return (
    <div
      className="overflow-hidden relative"
      style={{ height: ITEM_HEIGHT }}
    >
      <motion.div animate={controls} className="flex flex-col">
        {strip.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex flex-col items-center justify-center px-4"
            style={{ height: ITEM_HEIGHT }}
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover mb-1"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-casino-dark flex items-center justify-center text-3xl mb-1">
                🍴
              </div>
            )}
            <span className="text-white text-sm font-bold truncate max-w-[160px] text-center">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
});

Reel.displayName = "Reel";
export default Reel;
```

**Step 2: Create SlotMachine wrapper**

`src/components/SlotMachine.tsx`:

```tsx
"use client";

import { useRef, useState, useCallback } from "react";
import type { FoodItem } from "@/lib/types";
import Reel, { ReelHandle } from "./Reel";
import CasinoLights from "./CasinoLights";
import Lever from "./Lever";
import ResultDisplay from "./ResultDisplay";

interface Props {
  items: FoodItem[];
}

export default function SlotMachine({ items }: Props) {
  const reelRef = useRef<ReelHandle>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<FoodItem | null>(null);

  const handleSpin = useCallback(async () => {
    if (spinning || items.length === 0) return;
    setSpinning(true);
    setWinner(null);

    const result = await reelRef.current?.spin();
    if (result) setWinner(result);
    setSpinning(false);
  }, [spinning, items.length]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-display text-casino-gold text-xs leading-relaxed">
          ADD SOME FOOD ITEMS<br />TO START SPINNING!
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 md:gap-8">
      {/* Lever — desktop only */}
      <div className="hidden md:block">
        <Lever onPull={handleSpin} disabled={spinning} />
      </div>

      {/* Machine body */}
      <div className="relative">
        <CasinoLights />

        {/* Machine frame */}
        <div className="relative bg-gradient-to-b from-yellow-700 via-yellow-600 to-yellow-700
                        rounded-2xl p-2 shadow-2xl">
          <div className="bg-casino-darker rounded-xl p-6 min-w-[240px]">
            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="font-display text-casino-gold text-[10px] tracking-wider">
                WHAT TO EAT TODAY?
              </h2>
            </div>

            {/* Reel window */}
            <div className="bg-white/5 rounded-lg border-2 border-casino-gold/40 overflow-hidden">
              <Reel ref={reelRef} items={items} />
            </div>

            {/* SPIN button — mobile */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="mt-4 w-full md:hidden bg-casino-red font-display text-xs text-white
                         py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
            >
              {spinning ? "SPINNING..." : "SPIN!"}
            </button>
          </div>
        </div>
      </div>

      {/* Result display */}
      <ResultDisplay winner={winner} />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/Reel.tsx src/components/SlotMachine.tsx
git commit -m "feat: add slot machine reel with spin animation"
```

---

### Task 10: Lever Component

**Files:**
- Create: `src/components/Lever.tsx`

**Step 1: Create draggable lever**

`src/components/Lever.tsx`:

```tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

interface Props {
  onPull: () => void;
  disabled?: boolean;
}

export default function Lever({ onPull, disabled }: Props) {
  const controls = useAnimation();
  const [pulled, setPulled] = useState(false);

  async function handlePull() {
    if (disabled || pulled) return;
    setPulled(true);

    // Pull down
    await controls.start({
      y: 60,
      transition: { duration: 0.2 },
    });

    onPull();

    // Spring back
    await controls.start({
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    });

    setPulled(false);
  }

  return (
    <div className="flex flex-col items-center select-none">
      {/* Lever base */}
      <div className="w-4 h-32 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full relative">
        {/* Lever handle */}
        <motion.div
          animate={controls}
          onClick={handlePull}
          className={`absolute -top-6 left-1/2 -translate-x-1/2 cursor-pointer
                      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
          whileHover={disabled ? {} : { scale: 1.1 }}
        >
          <div className="w-10 h-10 rounded-full bg-casino-red border-4 border-red-800
                          shadow-lg shadow-casino-red/50" />
        </motion.div>
      </div>

      {/* Label */}
      <p className="font-display text-[8px] text-gray-500 mt-2">PULL</p>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/Lever.tsx
git commit -m "feat: add lever component with pull animation"
```

---

### Task 11: Result Display with Confetti

**Files:**
- Create: `src/components/ResultDisplay.tsx`

**Step 1: Create result display with confetti trigger**

`src/components/ResultDisplay.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { FoodItem } from "@/lib/types";

interface Props {
  winner: FoodItem | null;
}

export default function ResultDisplay({ winner }: Props) {
  useEffect(() => {
    if (!winner) return;

    // Fire confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FFD700", "#DC143C", "#00ff88"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FFD700", "#DC143C", "#00ff88"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [winner]);

  return (
    <AnimatePresence mode="wait">
      {winner && (
        <motion.div
          key={winner.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/70"
          onClick={(e) => e.currentTarget === e.target && undefined}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="text-center"
          >
            <p className="font-display text-casino-gold text-sm md:text-lg mb-6 tracking-wider">
              TODAY YOU EAT:
            </p>

            {winner.image_url ? (
              <motion.img
                src={winner.image_url}
                alt={winner.name}
                className="w-40 h-40 md:w-56 md:h-56 rounded-2xl object-cover mx-auto mb-6
                           border-4 border-casino-gold shadow-2xl shadow-casino-gold/30"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 215, 0, 0.3)",
                    "0 0 60px rgba(255, 215, 0, 0.6)",
                    "0 0 20px rgba(255, 215, 0, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ) : (
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl bg-casino-dark
                              flex items-center justify-center text-7xl mx-auto mb-6
                              border-4 border-casino-gold">
                🍴
              </div>
            )}

            <motion.h3
              className="font-display text-white text-lg md:text-2xl"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,215,0,0.5)",
                  "0 0 30px rgba(255,215,0,0.8)",
                  "0 0 10px rgba(255,215,0,0.5)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {winner.name.toUpperCase()}
            </motion.h3>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ResultDisplay.tsx
git commit -m "feat: add result display with confetti and glow effects"
```

---

### Task 12: Sound Effects

**Files:**
- Create: `src/lib/sounds.ts`
- Create: `src/assets/sounds/` (placeholder — use free sound URLs or bundled files)
- Modify: `src/components/SlotMachine.tsx` — add sound triggers

**Step 1: Create sound manager**

`src/lib/sounds.ts`:

```ts
import { Howl } from "howler";

let leverSound: Howl | null = null;
let spinSound: Howl | null = null;
let winSound: Howl | null = null;

function ensureLoaded() {
  if (leverSound) return;

  // Using free sounds — replace paths with actual sound files
  leverSound = new Howl({
    src: ["/sounds/lever.mp3"],
    volume: 0.5,
  });

  spinSound = new Howl({
    src: ["/sounds/spin.mp3"],
    volume: 0.3,
    loop: true,
  });

  winSound = new Howl({
    src: ["/sounds/win.mp3"],
    volume: 0.6,
  });
}

export const sounds = {
  lever() {
    ensureLoaded();
    leverSound?.play();
  },
  startSpin() {
    ensureLoaded();
    spinSound?.play();
  },
  stopSpin() {
    spinSound?.stop();
  },
  win() {
    ensureLoaded();
    sounds.stopSpin();
    winSound?.play();
  },
};
```

**Step 2: Integrate sounds into SlotMachine**

In `src/components/SlotMachine.tsx`, update `handleSpin`:

```tsx
import { sounds } from "@/lib/sounds";

// Inside handleSpin:
sounds.lever();
setTimeout(() => sounds.startSpin(), 200);

// After result:
sounds.win();
```

**Step 3: Add placeholder sound files**

Create `public/sounds/` directory. Add placeholder `.mp3` files (lever.mp3, spin.mp3, win.mp3). These can be sourced from freesound.org or similar. The app works without them — Howler gracefully handles missing files.

**Step 4: Commit**

```bash
git add src/lib/sounds.ts public/sounds/
git commit -m "feat: add sound effects for lever, spin, and win"
```

---

### Task 13: Wire Everything Together

**Files:**
- Modify: `src/app/l/[shortCode]/SlotMachineClient.tsx`

**Step 1: Integrate SlotMachine into the page**

Update `SlotMachineClient.tsx` to use the full `SlotMachine` component:

```tsx
"use client";

import { useState } from "react";
import type { FoodItem, FoodList } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import FoodDrawer from "@/components/FoodDrawer";
import SlotMachine from "@/components/SlotMachine";

interface Props {
  list: FoodList;
  initialItems: FoodItem[];
}

export default function SlotMachineClient({ list, initialItems }: Props) {
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleAdd(name: string, imageUrl: string | null) {
    const newItem: FoodItem = {
      id: crypto.randomUUID(),
      list_id: list.id,
      name,
      image_url: imageUrl,
      sort_order: items.length,
      created_at: new Date().toISOString(),
    };

    setItems((prev) => [...prev, newItem]);

    const { error } = await supabase.from("food_items").insert({
      id: newItem.id,
      list_id: list.id,
      name,
      image_url: imageUrl,
      sort_order: newItem.sort_order,
    });

    if (error) {
      setItems((prev) => prev.filter((i) => i.id !== newItem.id));
      alert("Failed to add item");
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((items) => items.filter((i) => i.id !== id));

    const { error } = await supabase.from("food_items").delete().eq("id", id);
    if (error) {
      setItems(prev);
      alert("Failed to delete item");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <SlotMachine items={items} />

      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed top-4 right-4 text-casino-gold text-2xl z-30
                   hover:scale-110 transition-transform"
        aria-label="Manage food items"
      >
        ⚙️
      </button>

      <FoodDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </main>
  );
}
```

**Step 2: Full browser test**

1. Visit `/` → create list → redirected
2. Open drawer → add 3+ food items with mix of images and no-images
3. Close drawer → pull lever (desktop) or tap SPIN (mobile)
4. Reel spins → winner revealed with confetti + glow
5. Verify sounds play (if sound files present)
6. Share URL → open in another browser → same list loads

**Step 3: Commit**

```bash
git add src/app/l/ src/components/SlotMachine.tsx
git commit -m "feat: wire slot machine, drawer, sounds, and result display together"
```

---

### Task 14: Polish & Responsive Tweaks

**Files:**
- Modify: `src/app/globals.css` — add any global styles
- Modify: various components for mobile refinements

**Step 1: Add global casino background style**

In `src/app/globals.css` after the Tailwind directives:

```css
body {
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0d0519 70%);
}
```

**Step 2: Add a "Copy Link" share button to the slot machine page**

In `SlotMachineClient.tsx`, add a share button:

```tsx
<button
  onClick={() => {
    navigator.clipboard.writeText(window.location.href);
    // Show brief "Copied!" feedback
  }}
  className="fixed top-4 left-4 text-casino-gold text-sm z-30
             hover:scale-110 transition-transform font-display"
>
  SHARE 🔗
</button>
```

**Step 3: Test on mobile viewport**

Verify: SPIN button shows (lever hidden), drawer doesn't overflow, text is readable.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add polish, responsive tweaks, and share button"
```

---

### Task 15: Vercel Deployment Prep

**Files:**
- Modify: `next.config.ts`
- Create: `.env.local` (from `.env.local.example`, with real Supabase keys)

**Step 1: Configure Next.js for Vercel**

`next.config.ts` — allow external images:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
```

**Step 2: Set up Supabase**

1. Go to supabase.com → create project
2. Run the SQL from `supabase/schema.sql` in the SQL editor
3. Create a `food-images` storage bucket (set to public)
4. Copy project URL and anon key into `.env.local`

**Step 3: Deploy to Vercel**

Run:
```bash
npx vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Step 4: Verify production**

Visit deployed URL → full flow works end-to-end.

**Step 5: Commit any config changes**

```bash
git add next.config.ts
git commit -m "chore: configure Next.js for Vercel deployment"
```

---

## Summary

| Task | Description | Estimated Steps |
|------|-------------|----------------|
| 1 | Project scaffolding | 8 |
| 2 | Supabase client & schema | 4 |
| 3 | Short code gen & create list API | 4 |
| 4 | Image upload API | 2 |
| 5 | Landing page | 3 |
| 6 | Slot machine page shell | 4 |
| 7 | Food management drawer | 6 |
| 8 | Casino lights | 2 |
| 9 | Reel animation | 3 |
| 10 | Lever component | 2 |
| 11 | Result display + confetti | 2 |
| 12 | Sound effects | 4 |
| 13 | Wire everything together | 3 |
| 14 | Polish & responsive | 4 |
| 15 | Vercel deployment | 5 |
