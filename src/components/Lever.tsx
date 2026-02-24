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

    // Pull down
    await controls.start({
      y: 60,
      transition: { duration: 0.2 },
    });

    onPull();

    // Spring back
    await controls.start({
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    });

    setPulled(false);
  }

  return (
    <div className="flex flex-col items-center select-none">
      {/* Lever base */}
      <div className="w-4 h-32 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full relative">
        {/* Lever handle */}
        <motion.div
          animate={controls}
          onClick={handlePull}
          className={`absolute -top-6 left-1/2 -translate-x-1/2 cursor-pointer
                      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
          whileHover={disabled ? {} : { scale: 1.1 }}
        >
          <div className="w-10 h-10 rounded-full bg-casino-red border-4 border-red-800
                          shadow-lg shadow-casino-red/50" />
        </motion.div>
      </div>

      {/* Label */}
      <p className="font-display text-[8px] text-gray-500 mt-2">PULL</p>
    </div>
  );
}
