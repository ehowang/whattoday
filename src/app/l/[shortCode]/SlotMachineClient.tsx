"use client";

import { useState } from "react";
import type { FoodItem, FoodList } from "@/lib/types";
import { supabaseBrowser as supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/i18n";
import FoodDrawer from "@/components/FoodDrawer";
import SlotMachine from "@/components/SlotMachine";

interface Props {
  list: FoodList;
  initialItems: FoodItem[];
}

export default function SlotMachineClient({ list, initialItems }: Props) {
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLocale();

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((items) => items.filter((i) => i.id !== id));

    const { error } = await supabase.from("food_items").delete().eq("id", id);
    if (error) {
      setItems(prev);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <div className="casino-environment" />
      <SlotMachine items={items} />

      <button
        onClick={handleShare}
        className="fixed top-4 left-4 text-casino-gold text-sm z-30
                   hover:scale-110 transition-transform font-display"
      >
        {copied ? t("client.copied") : t("client.share")}
      </button>

      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed top-4 right-4 text-casino-gold text-2xl z-30
                   hover:scale-110 transition-transform"
        aria-label={t("client.manage")}
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
