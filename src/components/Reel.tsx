"use client";

import { motion, useAnimation } from "framer-motion";
import { useImperativeHandle, forwardRef } from "react";
import type { FoodItem } from "@/lib/types";

export interface ReelHandle {
  spin: () => Promise<FoodItem | undefined>;
}

interface Props {
  items: FoodItem[];
}

const ITEM_HEIGHT = 140;
const VISIBLE_ITEMS = 3;

const Reel = forwardRef<ReelHandle, Props>(({ items }, ref) => {
  const controls = useAnimation();

  const repeats = 10;
  const strip = Array.from({ length: repeats }, () => items).flat();

  useImperativeHandle(ref, () => ({
    async spin(): Promise<FoodItem | undefined> {
      if (items.length === 0) return undefined;

      const winnerIndex = Math.floor(Math.random() * items.length);
      const targetRepeat = repeats - 2;
      const targetIndex = targetRepeat * items.length + winnerIndex;
      // Center the winner in the middle row
      const targetY = -(targetIndex * ITEM_HEIGHT) + ITEM_HEIGHT;

      await controls.set({ y: 0 });

      await controls.start({
        y: targetY,
        transition: {
          duration: 3.5,
          ease: [0.12, 0.82, 0.32, 1.01],
        },
      });

      return items[winnerIndex];
    },
  }));

  return (
    <div
      className="overflow-hidden relative"
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
    >
      {/* Center row highlight indicator */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{
          top: ITEM_HEIGHT,
          height: ITEM_HEIGHT,
          borderTop: "2px solid rgba(255, 215, 0, 0.5)",
          borderBottom: "2px solid rgba(255, 215, 0, 0.5)",
          background: "linear-gradient(90deg, rgba(255,215,0,0.05) 0%, rgba(255,215,0,0.12) 50%, rgba(255,215,0,0.05) 100%)",
        }}
      />

      {/* Top/bottom fade */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: ITEM_HEIGHT * 0.4,
          background: "linear-gradient(180deg, rgba(10,10,10,0.85) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: ITEM_HEIGHT * 0.4,
          background: "linear-gradient(0deg, rgba(10,10,10,0.85) 0%, transparent 100%)",
        }}
      />

      <motion.div animate={controls} className="flex flex-col">
        {strip.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex flex-col items-center justify-center px-6"
            style={{ height: ITEM_HEIGHT }}
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover mb-2"
                style={{
                  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  border: "2px solid rgba(255,215,0,0.2)",
                }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl mb-2"
                style={{
                  background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  border: "2px solid rgba(255,215,0,0.2)",
                }}
              >
                🍴
              </div>
            )}
            <span className="text-white text-sm font-bold truncate max-w-[200px] text-center drop-shadow-md">
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
