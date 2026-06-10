"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormationSlot } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { POSITION_LABELS_MAP } from "@/lib/constants";

interface PlayerMarkerProps {
  slot: FormationSlot;
  onClick?: () => void;
  isHighlighted?: boolean;
}

export default function PlayerMarker({
  slot,
  onClick,
  isHighlighted = false,
}: PlayerMarkerProps) {
  const hasPlayer = !!slot.player;
  const { lang } = useLanguage();

  return (
    <motion.div
      layout
      className="absolute"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
    >
      <div
        onClick={onClick}
        className={`
          relative flex flex-col items-center justify-center
          w-11 h-11 md:w-12 md:h-12 rounded-full
          text-center
          transition-all duration-300
          ${
            hasPlayer
              ? "bg-plum text-white shadow-lg cursor-default"
              : "bg-white/10 border-2 border-dashed border-white/50 text-white/80"
          }
          ${isHighlighted ? "ring-2 ring-yellow-300 ring-offset-1 ring-offset-transparent animate-pulse-soft" : ""}
          ${onClick && !hasPlayer ? "cursor-pointer hover:bg-white/20" : ""}
        `}
      >
        {hasPlayer ? (
          <>
            <span className="text-[8px] md:text-[9px] font-bold leading-tight truncate max-w-[40px]">
              {slot.player!.overall}
            </span>
            <span className="text-[7px] md:text-[8px] leading-tight truncate max-w-[40px]">
              {slot.player!.name.split(" ").slice(-1)[0]}
            </span>
          </>
        ) : (
          <span className="text-[9px] md:text-[10px] font-semibold">
            {POSITION_LABELS_MAP[lang][slot.position]}
          </span>
        )}
      </div>

      {/* Position label below marker when filled */}
      {hasPlayer && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[7px] md:text-[8px] bg-black/40 text-white px-1.5 py-0.5 rounded-full font-medium">
            {POSITION_LABELS_MAP[lang][slot.position]}
          </span>
        </div>
      )}
    </motion.div>
  );
}
