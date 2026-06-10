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
      <motion.div
        onClick={onClick}
        whileHover={onClick && !hasPlayer ? { scale: 1.1 } : hasPlayer ? { scale: 1.05 } : {}}
        className={`
          relative flex flex-col justify-between
          w-[72px] h-[85px] border-2 border-[#00183F] text-center
          transition-all duration-200 rounded-none
          shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]
          ${
            hasPlayer
              ? "bg-white text-[#00183F]"
              : "bg-white/10 border-dashed border-white/60 text-white/90"
          }
          ${isHighlighted ? "ring-4 ring-yellow-400 border-solid animate-pulse-soft" : ""}
          ${onClick && !hasPlayer ? "cursor-pointer hover:bg-white/20" : ""}
        `}
      >
        {/* Posição no topo do card */}
        <div className={`text-[9px] font-black py-0.5 border-b border-[#00183F] ${hasPlayer ? "bg-[#00183F] text-white" : "bg-black/40 text-white"}`}>
          {POSITION_LABELS_MAP[lang][slot.position]}
        </div>

        {/* Informações centrais */}
        <div className="flex-1 flex flex-col items-center justify-center p-0.5">
          {hasPlayer ? (
            <>
              <span className={`text-xl font-black leading-none ${slot.player!.overall >= 95 ? "text-amber-600" : "text-[#00183F]"}`}>
                {slot.player!.overall}
              </span>
              <span className="text-[9px] font-bold mt-1 truncate w-full px-0.5">
                {slot.player!.name.split(" ").slice(-1)[0]}
              </span>
            </>
          ) : (
            <span className="text-[12px] font-black tracking-tighter opacity-60">
              +
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}