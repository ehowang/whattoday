"use client";

import { useEffect, useState } from "react";

interface Props {
  className?: string;
}

export default function CasinoLights({ className = "" }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(interval);
  }, []);

  const bulbCount = 40;
  const colors = ["#FFD700", "#DC143C", "#00ff88", "#ff6b35"];

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {Array.from({ length: bulbCount }).map((_, i) => {
        const isOn = (i + tick) % 2 === 0;
        const color = colors[i % colors.length];
        const side = Math.floor(i / (bulbCount / 4));
        const progress = (i % (bulbCount / 4)) / (bulbCount / 4);

        let top: string, left: string;
        switch (side) {
          case 0: top = "0%"; left = `${progress * 100}%`; break;
          case 1: top = `${progress * 100}%`; left = "100%"; break;
          case 2: top = "100%"; left = `${(1 - progress) * 100}%`; break;
          default: top = `${(1 - progress) * 100}%`; left = "0%"; break;
        }

        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
            style={{
              top,
              left,
              backgroundColor: color,
              opacity: isOn ? 1 : 0.2,
              boxShadow: isOn ? `0 0 8px 2px ${color}` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
