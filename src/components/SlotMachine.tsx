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
    <div className="flex items-center gap-0">
      {/* === MACHINE CABINET === */}
      <div className="relative" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7))" }}>
        {/* Outer chrome frame */}
        <div
          className="chrome-border rounded-2xl p-[6px]"
          style={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          {/* Machine body */}
          <div
            className="machine-body rounded-xl overflow-hidden"
            style={{
              width: 320,
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {/* ── TOP HEADER PANEL ── */}
            <div className="relative">
              {/* Chrome bar top */}
              <div className="chrome-horizontal h-[4px]" />

              {/* Header glow panel */}
              <div
                className="header-glow py-4 px-6 relative overflow-hidden"
                style={{
                  boxShadow: "inset 0 0 30px rgba(255, 107, 0, 0.3)",
                }}
              >
                {/* Decorative 77 like reference */}
                <div className="text-center relative z-10">
                  <p
                    className="font-display text-[10px] tracking-[0.2em] mb-1"
                    style={{
                      color: "#ffe0a0",
                      textShadow: "0 0 10px rgba(255,150,0,0.8)",
                    }}
                  >
                    WHAT TO EAT
                  </p>
                  <div
                    className="font-display text-3xl font-bold"
                    style={{
                      color: "#fff",
                      textShadow: "0 0 20px rgba(255,200,0,0.9), 0 0 40px rgba(255,150,0,0.5), 0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    🍔 7 7 🍕
                  </div>
                  <p
                    className="font-display text-[10px] tracking-[0.2em] mt-1"
                    style={{
                      color: "#ffe0a0",
                      textShadow: "0 0 10px rgba(255,150,0,0.8)",
                    }}
                  >
                    TODAY?
                  </p>
                </div>

                {/* Subtle scan line effect */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                  }}
                />
              </div>

              {/* Chrome bar bottom of header */}
              <div className="chrome-horizontal h-[4px]" />
            </div>

            {/* ── REEL SECTION ── */}
            <div className="px-4 py-3">
              {/* Chrome frame around reel window */}
              <div
                className="chrome-border rounded-lg p-[4px]"
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                {/* Reel window with inset shadow */}
                <div
                  className="reel-window rounded-md overflow-hidden relative"
                  style={{
                    animation: spinning ? "reel-glow 0.5s ease-in-out infinite" : "none",
                  }}
                >
                  <Reel ref={reelRef} items={items} />
                </div>
              </div>
            </div>

            {/* ── MIDDLE INFO BAR ── */}
            <div className="px-4 pb-2">
              <div
                className="chrome-horizontal rounded-sm py-1 px-3 flex items-center justify-between"
                style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }}
              >
                <span className="text-[8px] font-bold text-gray-700 tracking-wider">
                  {items.length} ITEMS
                </span>
                <span
                  className="text-[8px] font-bold tracking-wider"
                  style={{ color: spinning ? "#ff4400" : "#333" }}
                >
                  {spinning ? "● SPINNING" : "READY"}
                </span>
              </div>
            </div>

            {/* ── LOWER INDICATOR PANEL ── */}
            <div className="px-2 pb-2">
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #0a0a0a, #151515, #0a0a0a)",
                  border: "1px solid #333",
                }}
              >
                <CasinoLights spinning={spinning} />
              </div>
            </div>

            {/* ── SPIN BUTTON (mobile) ── */}
            <div className="px-4 pb-4 md:hidden">
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full font-display text-xs text-white py-3 rounded-lg
                           disabled:opacity-50 transition-all active:scale-95"
                style={{
                  background: spinning
                    ? "linear-gradient(180deg, #666, #444)"
                    : "linear-gradient(180deg, #ff2020, #DC143C, #a01030)",
                  boxShadow: spinning
                    ? "none"
                    : "0 4px 15px rgba(220, 20, 60, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                {spinning ? "SPINNING..." : "SPIN!"}
              </button>
            </div>

            {/* ── BOTTOM CHROME ── */}
            <div className="chrome-horizontal h-[3px]" />
          </div>
        </div>

        {/* Corner chrome screws */}
        <div className="chrome-screw absolute top-2 left-2" />
        <div className="chrome-screw absolute top-2 right-2" />
        <div className="chrome-screw absolute bottom-2 left-2" />
        <div className="chrome-screw absolute bottom-2 right-2" />
      </div>

      {/* === LEVER (desktop) === */}
      <div className="hidden md:block -ml-1">
        <Lever onPull={handleSpin} disabled={spinning} />
      </div>

      {/* === RESULT OVERLAY === */}
      <ResultDisplay winner={winner} onDismiss={() => setWinner(null)} />
    </div>
  );
}
