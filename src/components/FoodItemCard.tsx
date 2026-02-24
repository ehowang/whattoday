"use client";

import { useState } from "react";
import type { FoodItem } from "@/lib/types";

interface Props {
  item: FoodItem;
  onDelete: (id: string) => void;
}

export default function FoodItemCard({ item, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-3 bg-casino-darker rounded-lg p-2">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-10 h-10 rounded object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded bg-casino-dark flex items-center justify-center text-lg">
          😋
        </div>
      )}

      <span className="flex-1 text-sm truncate">{item.name}</span>

      {confirming ? (
        <div className="flex gap-1">
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs bg-casino-red px-2 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-xs bg-gray-600 px-2 py-1 rounded"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="text-gray-500 hover:text-casino-red transition-colors text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
}
