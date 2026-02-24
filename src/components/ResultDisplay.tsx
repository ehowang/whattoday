"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { FoodItem } from "@/lib/types";
import { useLocale } from "@/lib/i18n";

interface Props {
  winner: FoodItem | null;
  isJackpot?: boolean;
  onDismiss: () => void;
  onShare?: () => void;
}

export default function ResultDisplay({ winner, isJackpot = false, onDismiss, onShare }: Props) {
  const { t } = useLocale();
  const [shared, setShared] = useState(false);
  useEffect(() => {
    if (!winner || !isJackpot) return;

    // Fire confetti only on jackpot (triple match)
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
  }, [winner, isJackpot]);

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
            {isJackpot && (
              <motion.p
                className="font-display text-casino-red text-xs md:text-sm mb-2 tracking-widest"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                {t("result.jackpot")}
              </motion.p>
            )}
            <p className="font-display text-casino-gold text-sm md:text-lg mb-6 tracking-wider">
              {t("result.header")}
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
              animate={isJackpot ? {
                textShadow: [
                  "0 0 10px rgba(255,215,0,0.5)",
                  "0 0 30px rgba(255,215,0,0.8)",
                  "0 0 10px rgba(255,215,0,0.5)",
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {winner.name.toUpperCase()}
            </motion.h3>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={onDismiss}
                className="px-6 py-3 rounded-lg text-sm tracking-wider text-white transition-all hover:scale-105"
                style={{
                  fontFamily: "'Abril Fatface', serif",
                  background: "linear-gradient(180deg, #606060, #484848 40%, #383838 100%)",
                  border: "1px solid #2a2a2a",
                  boxShadow: "0 4px 0 #1a1a1a, 0 6px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {t("result.dismiss")}
              </button>

              {onShare && (
                <button
                  onClick={() => {
                    onShare();
                    setShared(true);
                    setTimeout(() => setShared(false), 2000);
                  }}
                  className="px-6 py-3 rounded-lg text-sm tracking-wider text-white transition-all hover:scale-105"
                  style={{
                    fontFamily: "'Abril Fatface', serif",
                    background: "linear-gradient(180deg, #e8a020, #d4881a 40%, #b87015 100%)",
                    border: "1px solid #8a5510",
                    boxShadow: "0 4px 0 #6a4010, 0 6px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {shared ? t("result.shared") : t("client.share")}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
