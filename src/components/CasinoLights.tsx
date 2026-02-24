"use client";

import { useEffect, useState } from "react";

interface Props {
  spinning?: boolean;
}

export default function CasinoLights({ spinning = false }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const speed = spinning ? 120 : 500;
    const interval = setInterval(() => setTick((t) => t + 1), speed);
    return () => clearInterval(interval);
  }, [spinning]);

  const barColors = [
    "#ff4400", "#ff8800", "#ffcc00", "#ff6600",
    "#ffaa00", "#ff3300", "#ff9900", "#ffbb00",
    "#ff5500", "#ff7700", "#ffdd00", "#ff4400",
  ];

  return (
    <div className="flex flex-col gap-[3px] py-3 px-3">
      {/* Five rows of indicator bars for more visual impact */}
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="flex gap-[2px] justify-center">
          {barColors.map((color, i) => {
            const pattern = spinning
              ? (i + tick * 2 + row * 2) % 4 < 2
              : (i + tick + row * 2) % 3 === 0;

            return (
              <div
                key={i}
                className="rounded-[1px] transition-opacity"
                style={{
                  width: 20,
                  height: 5,
                  backgroundColor: color,
                  opacity: pattern ? 1 : 0.12,
                  boxShadow: pattern ? `0 0 8px 1px ${color}40` : "none",
                  transitionDuration: spinning ? "80ms" : "250ms",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
