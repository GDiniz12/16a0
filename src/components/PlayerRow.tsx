"use client";

import React from "react";
import { Player } from "@/types";
import { POSITION_LABELS_MAP } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

interface PlayerRowProps {
  player: Player;
  disabled: boolean;
  onClick: () => void;
  isSelected?: boolean;
}

export default function PlayerRow({
  player,
  disabled,
  onClick,
  isSelected = false,
}: PlayerRowProps) {
  const { lang } = useLanguage();

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-xl
        transition-all duration-200
        ${
          disabled
            ? "opacity-30 cursor-not-allowed bg-gray-50"
            : "cursor-pointer hover:bg-sage/30"
        }
        ${isSelected ? "bg-plum/10 ring-1 ring-plum" : ""}
      `}
    >
      {/* Position badges */}
      <div className="flex gap-1 min-w-[60px]">
        {player.positions.map((pos) => (
          <span
            key={pos}
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-plum/10 text-plum"
          >
            {POSITION_LABELS_MAP[lang][pos]}
          </span>
        ))}
      </div>

      {/* Player name */}
      <span className="flex-1 text-sm font-medium text-gray-800 truncate">
        {player.name}
      </span>

      {/* Overall */}
      <span
        className={`
          text-sm font-bold min-w-[28px] text-right
          ${player.overall >= 90 ? "text-amber-600" : player.overall >= 85 ? "text-plum" : "text-gray-600"}
        `}
      >
        {player.overall}
      </span>
    </div>
  );
}
