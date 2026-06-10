"use client";

import React from "react";
import { FormationSlot } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { POSITION_LABELS_MAP, TRANSLATIONS } from "@/lib/constants";

interface SquadDisplayProps {
  slots: FormationSlot[];
}

export default function SquadDisplay({ slots }: SquadDisplayProps) {
  const filled = slots.filter((s) => s.player).length;
  const total = slots.length;

  const { lang } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-600">
          {TRANSLATIONS[lang].squad_progress}
        </span>
        <span className="text-sm font-bold text-plum">
          {filled}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-plum rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(filled / total) * 100}%` }}
        />
      </div>

      {/* Slot list */}
      <div className="space-y-1.5 mt-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm
              ${
                slot.player
                  ? "bg-plum/5 border border-plum/10"
                  : "bg-gray-50 border border-dashed border-gray-200"
              }
            `}
          >
            <span
              className={`
                font-bold text-xs min-w-[32px]
                ${slot.player ? "text-plum" : "text-gray-400"}
              `}
            >
              {POSITION_LABELS_MAP[lang][slot.position]}
            </span>
            {slot.player ? (
              <>
                <span className="flex-1 font-medium text-gray-800 truncate">
                  {slot.player.name}
                </span>
                <span className="font-bold text-plum-dark text-xs">
                  {slot.player.overall}
                </span>
              </>
            ) : (
              <span className="flex-1 text-gray-400 italic text-xs">
                {TRANSLATIONS[lang].empty}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
