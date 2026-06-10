"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player, FormationSlot } from "@/types";
import Button from "./ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { POSITION_LABELS_MAP, TRANSLATIONS } from "@/lib/constants";

interface PositionPickerProps {
  player: Player;
  availableSlots: FormationSlot[];
  onConfirm: (slotId: number) => void;
  onCancel: () => void;
}

export default function PositionPicker({
  player,
  availableSlots,
  onConfirm,
  onCancel,
}: PositionPickerProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Player info */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold text-gray-800">
              {player.name}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-2xl font-black text-plum">
                {player.overall}
              </span>
              <span className="text-sm text-gray-500">{TRANSLATIONS[lang].ovr}</span>
            </div>
          </div>

          {/* Position selection */}
          <p className="text-sm text-gray-500 mb-3 text-center">
            {TRANSLATIONS[lang].choose_position}
          </p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {availableSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`
                  py-3 px-4 rounded-xl font-semibold text-sm
                  transition-all duration-200 border-2
                  ${
                    selectedSlotId === slot.id
                      ? "border-plum bg-plum/10 text-plum"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-plum-light hover:bg-plum/5"
                  }
                `}
              >
                {POSITION_LABELS_MAP[lang][slot.position]}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="flex-1"
            >
              {TRANSLATIONS[lang].cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                selectedSlotId !== null && onConfirm(selectedSlotId)
              }
              disabled={selectedSlotId === null}
              className="flex-1"
            >
              {TRANSLATIONS[lang].confirm}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
