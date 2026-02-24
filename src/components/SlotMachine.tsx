"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { FoodItem } from "@/lib/types";
import Reel, { ReelHandle } from "./Reel";
import CasinoLights from "./CasinoLights";
import Lever from "./Lever";
import ResultDisplay from "./ResultDisplay";
import { sounds } from "@/lib/sounds";

interface Props {
  items: FoodItem[];
}

const ITEM_HEIGHT = 110;

export default function SlotMachine({ items }: Props) {
  const reel1Ref = useRef<ReelHandle>(null);
  const reel2Ref = useRef<ReelHandle>(null);
  const reel3Ref = useRef<ReelHandle>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<FoodItem | null>(null);
  const [isJackpot, setIsJackpot] = useState(false);
  const [spinPressed, setSpinPressed] = useState(false);

  const handleSpin = useCallback(async () => {
    if (spinning || items.length === 0) return;
    setSpinning(true);
    setWinner(null);

    sounds.lever();
    setTimeout(() => sounds.startSpin(), 200);

    const idx1 = Math.floor(Math.random() * items.length);
    const idx2 = Math.floor(Math.random() * items.length);
    const idx3 = Math.floor(Math.random() * items.length);

    const spin1 = reel1Ref.current?.spin(idx1);
    const spin2 = reel2Ref.current?.spin(idx2);
    const spin3 = reel3Ref.current?.spin(idx3);

    await Promise.all([spin1, spin2, spin3]);

    const isJackpot = idx1 === idx2 && idx2 === idx3;
    if (isJackpot) {
      sounds.win();
    }
    setIsJackpot(isJackpot);
    setWinner(items[idx2]); // center reel decides
    setSpinning(false);
  }, [spinning, items]);

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
    <div className="flex items-center gap-0 relative z-10">
      {/* === MACHINE CABINET === */}
      <div
        className="relative"
        style={{
          filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.8))",
        }}
      >
        {/* Outer chrome bezel */}
        <div
          className="chrome-bezel rounded-2xl p-[8px] relative"
          style={{
            boxShadow: `
              0 8px 30px rgba(0,0,0,0.6),
              inset 0 1px 0 rgba(255,255,255,0.4),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Machine body - brushed steel */}
          <div
            className="machine-body-steel rounded-xl overflow-hidden relative"
            style={{ width: 380 }}
          >
            {/* Ambient neon reflections on metal */}
            <div className="neon-reflect-pink" style={{ top: "10%", left: "-10%", width: "50%", height: "40%" }} />
            <div className="neon-reflect-blue" style={{ top: "30%", right: "-10%", width: "40%", height: "50%" }} />

            {/* ══════ TOP: PAYTABLE PANEL ══════ */}
            <div className="relative">
              <div className="chrome-strip h-[5px]" />

              <div
                className="paytable-panel relative overflow-hidden"
                style={{
                  padding: "14px 16px 12px",
                  background: "linear-gradient(180deg, rgba(30,15,0,0.92) 0%, rgba(20,10,0,0.95) 100%)",
                  boxShadow: "inset 0 0 60px rgba(200, 130, 30, 0.15), inset 0 0 20px rgba(255, 180, 50, 0.08)",
                }}
              >
                {/* Paytable content */}
                <div className="relative z-10">
                  {/* Title */}
                  <div className="text-center mb-3">
                    <span
                      className="tracking-[0.4em] uppercase"
                      style={{
                        fontFamily: "'Abril Fatface', serif",
                        fontSize: "13px",
                        color: "#ffe8b0",
                        textShadow: "0 0 12px rgba(255,200,100,0.5), 0 0 30px rgba(255,180,60,0.2)",
                      }}
                    >
                      PAYTABLE
                    </span>
                  </div>

                  {/* 3-column payout grid */}
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 items-start">
                    {/* Left column */}
                    <div className="flex flex-col gap-[5px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px]">😋😋😋</span>
                        <span style={{ fontFamily: "'Abril Fatface', serif", fontSize: "13px", color: "#fff", textShadow: "0 0 8px rgba(255,200,0,0.9), 0 0 20px rgba(255,150,0,0.4)" }}>7000</span>
                      </div>
                      <div className="flex items-center justify-between" style={{ color: "#ffe0a0" }}>
                        <span className="text-[10px]">🍔🍔🍔</span>
                        <span style={{ fontFamily: "'Abril Fatface', serif", fontSize: "11px" }}>1000</span>
                      </div>
                      <div className="flex items-center justify-between" style={{ color: "#ffe0a0" }}>
                        <span className="text-[10px]">🍕🍕🍕</span>
                        <span style={{ fontFamily: "'Abril Fatface', serif", fontSize: "11px" }}>50</span>
                      </div>
                      <div className="flex items-center justify-between" style={{ color: "#d4c090" }}>
                        <span className="text-[10px]">🌮🌮</span>
                        <span style={{ fontFamily: "'Abril Fatface', serif", fontSize: "11px" }}>30</span>
                      </div>
                    </div>

                    {/* Center: large 777 */}
                    <div className="flex flex-col items-center justify-center px-2">
                      <div
                        style={{
                          fontFamily: "'Abril Fatface', serif",
                          fontSize: "38px",
                          color: "#fff",
                          textShadow: "0 0 25px rgba(255,200,0,0.9), 0 0 50px rgba(255,150,0,0.5), 0 3px 6px rgba(0,0,0,0.6)",
                          lineHeight: 1,
                        }}
                      >
                        777
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-[5px]">
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: "'Abril Fatface', serif", fontSize: "13px", color: "#fff", textShadow: "0 0 8px rgba(255,200,0,0.9), 0 0 20px rgba(255,150,0,0.4)" }}>1500</span>
                        <span className="text-[10px]">🍜🍜🍜</span>
                      </div>
                      <div className="flex items-center justify-between" style={{ color: "#ffe0a0" }}>
                        <span style={{ fontFamily: "'Abril Fatface', serif", fontSize: "11px" }}>250</span>
                        <span className="text-[10px]">🍣🍣🍣</span>
                      </div>
                      <div className="flex items-center justify-between" style={{ color: "#ffe0a0" }}>
                        <span style={{ fontFamily: "'Abril Fatface', serif", fontSize: "11px" }}>100</span>
                        <span className="text-[10px]">🥗🥗</span>
                      </div>
                      <div className="flex items-center justify-between" style={{ color: "#d4c090" }}>
                        <span style={{ fontFamily: "'Abril Fatface', serif", fontSize: "11px" }}>25</span>
                        <span className="text-[10px]">🍔</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan line overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.07]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
                  }}
                />

                {/* Steady backlight glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 80px rgba(200, 130, 30, 0.12), inset 0 0 30px rgba(255, 180, 60, 0.06)",
                  }}
                />
              </div>

              <div className="chrome-strip h-[5px]" />
            </div>

            {/* ══════ MIDDLE: REEL SECTION ══════ */}
            <div className="px-5 py-4">
              {/* Chrome frame around reel window */}
              <div
                className="chrome-bezel rounded-lg p-[5px]"
                style={{
                  boxShadow: "0 3px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                {/* Reel window - light cream like real machine */}
                <div
                  className="reel-window-light rounded-md overflow-hidden relative"
                  style={{
                    animation: spinning ? "reel-glow 0.4s ease-in-out infinite" : "none",
                  }}
                >
                  {/* 3 reels side by side */}
                  <div className="flex relative">
                    <div className="flex-1 min-w-0">
                      <Reel ref={reel1Ref} items={items} duration={3.5} />
                    </div>
                    <div className="reel-divider" />
                    <div className="flex-1 min-w-0">
                      <Reel ref={reel2Ref} items={items} duration={4.5} />
                    </div>
                    <div className="reel-divider" />
                    <div className="flex-1 min-w-0">
                      <Reel ref={reel3Ref} items={items} duration={5.5} />
                    </div>
                  </div>

                  {/* Center row payline indicator */}
                  <div
                    className="absolute left-0 right-0 z-10 pointer-events-none"
                    style={{
                      top: ITEM_HEIGHT,
                      height: ITEM_HEIGHT,
                      borderTop: "2.5px solid rgba(220, 20, 60, 0.7)",
                      borderBottom: "2.5px solid rgba(220, 20, 60, 0.7)",
                      background: "linear-gradient(90deg, rgba(220,20,60,0.02) 0%, rgba(220,20,60,0.06) 50%, rgba(220,20,60,0.02) 100%)",
                    }}
                  />

                  {/* Payline arrows */}
                  <div
                    className="absolute z-10 pointer-events-none"
                    style={{
                      top: ITEM_HEIGHT + ITEM_HEIGHT / 2 - 8,
                      left: -2,
                      width: 0,
                      height: 0,
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderLeft: "10px solid rgba(220, 20, 60, 0.8)",
                    }}
                  />
                  <div
                    className="absolute z-10 pointer-events-none"
                    style={{
                      top: ITEM_HEIGHT + ITEM_HEIGHT / 2 - 8,
                      right: -2,
                      width: 0,
                      height: 0,
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderRight: "10px solid rgba(220, 20, 60, 0.8)",
                    }}
                  />

                  {/* Top/bottom shadow fades */}
                  <div
                    className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
                    style={{
                      height: ITEM_HEIGHT * 0.35,
                      background: "linear-gradient(180deg, rgba(180,170,155,0.9) 0%, transparent 100%)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
                    style={{
                      height: ITEM_HEIGHT * 0.35,
                      background: "linear-gradient(0deg, rgba(180,170,155,0.9) 0%, transparent 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ══════ BOTTOM: CONTROL PANEL ══════ */}
            <div className="chrome-strip h-[4px]" />

            <div className="control-panel px-5 py-4">
              {/* Buttons row */}
              <div className="flex items-center justify-center gap-3">
                {/* Coin slot indicator */}
                <div
                  className="flex flex-col items-center gap-1"
                  style={{ opacity: 0.6 }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 3,
                      borderRadius: 2,
                      background: "#222",
                      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  />
                  <span className="text-[7px] text-gray-500 tracking-wider">COIN</span>
                </div>

                {/* SPIN button */}
                <motion.button
                  onClick={() => {
                    setSpinPressed(true);
                    handleSpin();
                    setTimeout(() => setSpinPressed(false), 200);
                  }}
                  disabled={spinning}
                  className={`px-6 py-2.5 rounded-md font-bold text-xs tracking-wider text-white
                             disabled:opacity-50 transition-colors
                             ${spinPressed ? "spin-btn-pressed" : ""}`}
                  style={{
                    background: "linear-gradient(180deg, #606060, #484848 40%, #383838 100%)",
                    border: "1px solid #2a2a2a",
                    boxShadow: spinPressed
                      ? "0 1px 0 #1a1a1a, 0 2px 4px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.3)"
                      : "0 4px 0 #1a1a1a, 0 6px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                    transform: spinPressed ? "translateY(3px)" : "translateY(0)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  SPIN
                </motion.button>

                {/* BET MAX button */}
                <motion.button
                  onClick={() => {
                    setSpinPressed(true);
                    handleSpin();
                    setTimeout(() => setSpinPressed(false), 200);
                  }}
                  disabled={spinning}
                  className="px-5 py-2.5 rounded-md font-bold text-xs tracking-wider text-white
                             disabled:opacity-50 transition-colors"
                  style={{
                    background: "linear-gradient(180deg, #e04040, #cc2020 40%, #a01818 100%)",
                    border: "1px solid #701010",
                    boxShadow: "0 4px 0 #501010, 0 6px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                  whileTap={{ scale: 0.97, y: 3 }}
                >
                  BET MAX
                </motion.button>

                {/* Status indicator */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: spinning
                        ? "radial-gradient(circle at 40% 35%, #ff6 , #f80 60%, #a40)"
                        : "radial-gradient(circle at 40% 35%, #6f6, #0a0 60%, #040)",
                      boxShadow: spinning
                        ? "0 0 8px rgba(255,150,0,0.6)"
                        : "0 0 6px rgba(0,200,0,0.4)",
                    }}
                  />
                  <span
                    className="text-[7px] tracking-wider"
                    style={{ color: spinning ? "#f80" : "#6a6" }}
                  >
                    {spinning ? "SPIN" : "READY"}
                  </span>
                </div>
              </div>
            </div>

            {/* ══════ COIN TRAY ══════ */}
            <div className="chrome-strip h-[3px]" />
            <div className="px-6 py-2">
              <div
                className="coin-tray rounded-md h-6"
                style={{ border: "1px solid #333" }}
              />
            </div>

            <div className="chrome-strip h-[3px]" />
          </div>

          {/* Corner screws on chrome bezel */}
          <div className="chrome-screw absolute" style={{ top: 8, left: 8 }} />
          <div className="chrome-screw absolute" style={{ top: 8, right: 8 }} />
          <div className="chrome-screw absolute" style={{ bottom: 8, left: 8 }} />
          <div className="chrome-screw absolute" style={{ bottom: 8, right: 8 }} />
        </div>
      </div>

      {/* === LEVER (desktop) === */}
      <div className="hidden md:block -ml-2">
        <Lever onPull={handleSpin} disabled={spinning} />
      </div>

      {/* === RESULT OVERLAY === */}
      <ResultDisplay winner={winner} isJackpot={isJackpot} onDismiss={() => setWinner(null)} />
    </div>
  );
}
