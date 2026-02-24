"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { FoodItem } from "@/lib/types";
import { useLocale } from "@/lib/i18n";
import FoodItemCard from "./FoodItemCard";
import FoodItemForm from "./FoodItemForm";

interface Props {
  open: boolean;
  onClose: () => void;
  items: FoodItem[];
  onAdd: (name: string, imageUrl: string | null) => void;
  onDelete: (id: string) => void;
  canClose?: boolean;
}

export default function FoodDrawer({ open, onClose, items, onAdd, onDelete, canClose = true }: Props) {
  const { t } = useLocale();
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — only dismissible when canClose */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={canClose ? onClose : undefined}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-casino-dark
                       border-l border-casino-gold/30 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-casino-gold/20">
              <h2 className="font-display text-casino-gold text-xs">{t("drawer.title")}</h2>
              {canClose && (
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
                  ✕
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <FoodItemForm onAdd={onAdd} />

              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    {t("drawer.empty")}
                  </p>
                ) : (
                  items.map((item) => (
                    <FoodItemCard key={item.id} item={item} onDelete={onDelete} />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
