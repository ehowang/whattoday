"use client";

import { useRef, useState, useCallback } from "react";
import type { FoodItem } from "@/lib/types";
import Reel, { ReelHandle } from "./Reel";
import CasinoLights from "./CasinoLights";
import Lever from "./Lever";
import ResultDisplay from "./ResultDisplay";
import { sounds } from "@/lib/sounds";

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

    sounds.lever();
    setTimeout(() => sounds.startSpin(), 200);

    const result = await reelRef.current?.spin();
    if (result) {
      sounds.win();
      setWinner(result);
    }
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
      <ResultDisplay winner={winner} onDismiss={() => setWinner(null)} />
    </div>
  );
}
