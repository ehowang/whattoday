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
