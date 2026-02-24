"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { FoodItem } from "@/lib/types";

interface Props {
  winner: FoodItem | null;
  onDismiss: () => void;
}

export default function ResultDisplay({ winner, onDismiss }: Props) {
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
          onClick={(e) => {
            if (e.currentTarget === e.target) onDismiss();
          }}
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
                😋
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

            <button
              onClick={onDismiss}
              className="mt-8 font-display text-xs text-gray-400 hover:text-white transition-colors"
            >
              TAP TO SPIN AGAIN
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
