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
      y: 80,
      transition: { duration: 0.25, ease: "easeIn" },
    });

    onPull();

    // Spring back up
    await controls.start({
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 12, delay: 0.1 },
    });

    setPulled(false);
  }

  return (
    <div className="flex flex-col items-center select-none relative" style={{ width: 40, height: 220 }}>
      {/* Mounting plate on machine */}
      <div
        className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[20px] h-[20px] rounded-full z-10"
        style={{
          background: "radial-gradient(circle at 40% 35%, #d0d0d0, #808080 60%, #505050 100%)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4)",
        }}
      />

      {/* Lever arm */}
      <motion.div
        animate={controls}
        onClick={handlePull}
        className={`relative z-20 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        style={{ width: 40 }}
        whileHover={disabled ? {} : { scale: 1.02 }}
      >
        {/* Red ball handle */}
        <div
          className="mx-auto"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #ff6666, #DC143C 40%, #8b0000 90%)",
            boxShadow: "0 4px 12px rgba(220, 20, 60, 0.5), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
            border: "2px solid #a01030",
          }}
        />

        {/* Chrome shaft */}
        <div
          className="mx-auto"
          style={{
            width: 10,
            height: 90,
            background: "linear-gradient(90deg, #707070 0%, #c8c8c8 30%, #e8e8e8 50%, #c0c0c0 70%, #707070 100%)",
            borderRadius: "0 0 3px 3px",
            boxShadow: "2px 0 4px rgba(0,0,0,0.3), -1px 0 3px rgba(0,0,0,0.2)",
          }}
        />
      </motion.div>

      {/* Base bracket */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: 24,
          height: 16,
          background: "linear-gradient(180deg, #909090, #606060)",
          borderRadius: "0 0 6px 6px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}
