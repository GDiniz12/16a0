"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormationSlot } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { POSITION_LABELS_MAP } from "@/lib/constants";
import { getNationalityDisplay } from "@/utils/flags";
import { clubLogos } from "@/data/data";

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

  let clubLogo = "";
  let yearTwoDigits = "";
  if (hasPlayer && slot.player?.teamKey) {
    const parts = slot.player.teamKey.split("-");
    const y = parts.pop();
    yearTwoDigits = y ? y.slice(-2) : "";
    const clubBaseName = parts.join("-");
    clubLogo = clubLogos[clubBaseName] || "";
  }

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: "translate(-50%, -50%)",
        transition: "left 0.4s ease, top 0.4s ease",
      }}
    >
      <motion.div
        onClick={onClick}
        whileHover={onClick && !hasPlayer ? { scale: 1.1 } : hasPlayer ? { scale: 1.05 } : {}}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className={`
          relative flex flex-col justify-between
          w-[46px] h-[60px] sm:w-[54px] sm:h-[68px] md:w-[72px] md:h-[85px] 
          border-2 border-[#00183F] text-center
          transition-colors duration-200 rounded-none overflow-hidden
          shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] md:shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]
          ${
            hasPlayer
              ? "bg-white text-[#00183F]"
              : "bg-white/10 border-dashed border-white/60 text-white/90"
          }
          ${isHighlighted ? "ring-2 md:ring-4 ring-yellow-400 border-solid animate-pulse-soft" : ""}
          ${onClick && !hasPlayer ? "cursor-pointer hover:bg-white/20" : ""}
        `}
      >
        {/* Posição no topo do card */}
        <div className={`text-[7px] sm:text-[8px] md:text-[9px] font-black py-0.5 border-b border-[#00183F] w-full ${hasPlayer ? "bg-[#00183F] text-white" : "bg-black/40 text-white"}`}>
          {POSITION_LABELS_MAP[lang][slot.position]}
        </div>

        {/* Informações centrais */}
        <div className="flex-1 flex flex-col items-center justify-center p-0.5 w-full">
          {hasPlayer ? (
            <>
              <span className={`text-sm sm:text-base md:text-xl font-black leading-none ${slot.player!.overall >= 95 ? "text-amber-600" : "text-[#00183F]"}`}>
                {slot.player!.overall}
              </span>
              <span className="text-[6px] sm:text-[7px] md:text-[9px] font-bold mt-0.5 md:mt-1 truncate w-full px-0.5">
                {slot.player!.name.split(" ").slice(-1)[0]}
              </span>
              
              <div className="flex items-center justify-center gap-1 mt-0.5 w-full">
                {/* Bandeira/Nacionalidade */}
                <span className="text-[5px] sm:text-[6px] md:text-[7px] font-bold text-[#0033A0] leading-none truncate max-w-[50%] flag-emoji">
                  {getNationalityDisplay(slot.player!.nationality)}
                </span>
                
                {/* Escudo do Clube e Ano */}
                <div className="flex items-center gap-[1px]">
                  {clubLogo && (
                    <img src={clubLogo} alt="Escudo" className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px] object-contain drop-shadow-[1px_1px_0_rgba(0,0,0,0.3)]" />
                  )}
                  <span className="text-[5px] sm:text-[6px] md:text-[7px] font-black text-[#00183F] leading-none">
                    '{yearTwoDigits}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <span className="text-[10px] md:text-[12px] font-black opacity-60">
              +
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}