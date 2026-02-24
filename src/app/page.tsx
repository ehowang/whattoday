"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/lib/i18n";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useLocale();

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/lists", { method: "POST" });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.shortCode) {
        router.push(`/l/${data.shortCode}`);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="font-display text-casino-gold text-3xl md:text-5xl mb-4 leading-relaxed">
          {t("landing.title1")}
        </h1>
        <h2 className="font-display text-casino-gold text-2xl md:text-4xl mb-6">
          {t("landing.title2")}
        </h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          {t("landing.desc")}
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
        {loading ? t("landing.creating") : t("landing.create")}
      </button>
    </main>
  );
}
