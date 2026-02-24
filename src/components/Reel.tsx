"use client";

import { motion, useAnimation } from "framer-motion";
import { useImperativeHandle, forwardRef } from "react";
import type { FoodItem } from "@/lib/types";

export interface ReelHandle {
  spin: () => Promise<FoodItem>;
}

interface Props {
  items: FoodItem[];
}

const ITEM_HEIGHT = 120;

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
