"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

interface Props {
  onPull: () => void;
  disabled?: boolean;
}

export default function Lever({ onPull, disabled }: Props) {
  const controls = useAnimation();
  const [pulled, setPulled] = useState(false);

  async function handlePull() {
    if (disabled || pulled) return;
    setPulled(true);

    // Spring physics: pull with resistance, then snap back with oscillation
    await controls.start({
      y: 90,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
    });

    onPull();

    // Damped spring return with overshoot
    await controls.start({
      y: [90, -8, 4, -1, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.35, 0.6, 0.8, 1],
        delay: 0.08,
      },
    });

    setPulled(false);
  }

  return (
    <div className="flex flex-col items-center select-none relative" style={{ width: 50, height: 280 }}>
      {/* Mounting bracket plate */}
      <div
        className="absolute z-10"
        style={{
          top: 140,
          left: "50%",
          transform: "translateX(-50%)",
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 32%, #d8d8d8, #999 45%, #606060 80%, #444 100%)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.4)",
          border: "1px solid #333",
        }}
      />

      {/* Lever arm assembly */}
      <motion.div
        animate={controls}
        onClick={handlePull}
        className={`relative z-20 flex flex-col items-center ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        whileHover={disabled ? {} : { scale: 1.03 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
      >
        {/* Red ball handle */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "radial-gradient(circle at 32% 28%, #ff7070, #e02020 35%, #b01515 60%, #7a0a0a 90%)",
            boxShadow: `
              0 6px 16px rgba(180, 20, 20, 0.5),
              inset 0 -4px 8px rgba(0,0,0,0.3),
              inset 0 3px 6px rgba(255,180,180,0.25),
              0 0 20px rgba(200, 30, 30, 0.15)
            `,
            border: "2px solid #8a0a0a",
          }}
        />

        {/* Chrome shaft */}
        <div
          style={{
            width: 12,
            height: 110,
            background: "linear-gradient(90deg, #606060 0%, #b0b0b0 20%, #e0e0e0 40%, #f0f0f0 50%, #d8d8d8 60%, #a0a0a0 80%, #606060 100%)",
            borderRadius: "0 0 4px 4px",
            boxShadow: "2px 0 5px rgba(0,0,0,0.3), -2px 0 5px rgba(0,0,0,0.2)",
          }}
        />
      </motion.div>

      {/* Base bracket mounted to machine */}
      <div
        className="absolute"
        style={{
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 30,
          height: 20,
          background: "linear-gradient(180deg, #888, #606060, #444)",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 3px 6px rgba(0,0,0,0.5)",
          border: "1px solid #333",
          borderTop: "none",
        }}
      />
    </div>
  );
}
