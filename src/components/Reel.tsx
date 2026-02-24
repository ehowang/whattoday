"use client";

import { motion, useAnimation } from "framer-motion";
import { useImperativeHandle, forwardRef } from "react";
import type { FoodItem } from "@/lib/types";

export interface ReelHandle {
  spin: (winnerIndex: number) => Promise<void>;
}

interface Props {
  items: FoodItem[];
  duration?: number;
}

const ITEM_HEIGHT = 110;
const VISIBLE_ITEMS = 3;

const Reel = forwardRef<ReelHandle, Props>(({ items, duration = 3.5 }, ref) => {
  const controls = useAnimation();

  const repeats = 20;
  const strip = Array.from({ length: repeats }, () => items).flat();

  useImperativeHandle(ref, () => ({
    async spin(winnerIndex: number): Promise<void> {
      if (items.length === 0) return;

      const targetRepeat = repeats - 2;
      const targetIndex = targetRepeat * items.length + winnerIndex;
      const targetY = -(targetIndex * ITEM_HEIGHT) + ITEM_HEIGHT;

      await controls.set({ y: 0 });

      // Overshoot then bounce-back for mechanical click feel
      await controls.start({
        y: [0, targetY - 8, targetY + 3, targetY],
        transition: {
          duration,
          times: [0, 0.92, 0.97, 1],
          ease: [0.12, 0.82, 0.32, 1.0],
        },
      });
    },
  }));

  return (
    <div
      className="overflow-hidden relative"
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
    >
      <motion.div animate={controls} className="flex flex-col">
        {strip.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex flex-col items-center justify-center px-1"
            style={{ height: ITEM_HEIGHT }}
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover mb-1"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-1"
                style={{
                  background: "linear-gradient(135deg, #f0e8d8, #e8dcc8)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                😋
              </div>
            )}
            <span
              className="text-[10px] font-bold truncate max-w-[85px] text-center"
              style={{ color: "#2a2a2a", textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}
            >
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
