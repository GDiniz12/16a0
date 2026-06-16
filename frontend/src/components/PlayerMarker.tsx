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

  const getCardStyle = () => {
    if (!hasPlayer || !slot.player) return "bg-white/10 border-dashed border-white/60 text-white/90";
    const over = slot.player.overall;
    if (over >= 93) return "bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-600 border-yellow-300 text-white shadow-[0_0_15px_rgba(168,85,247,0.8)]";
    if (over >= 85) return "bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 border-yellow-100 text-[#00183F] shadow-[0_0_10px_rgba(251,191,36,0.6)]";
    if (over >= 75) return "bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400 border-white text-[#00183F] shadow-[0_0_8px_rgba(156,163,175,0.6)]";
    return "bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 border-orange-200 text-[#3d1a00] shadow-[0_0_6px_rgba(251,146,60,0.6)]";
  };

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
          border-2 text-center
          transition-colors duration-200 rounded-none overflow-hidden
          ${getCardStyle()}
          ${isHighlighted ? "ring-2 md:ring-4 ring-yellow-400 border-solid animate-pulse-soft" : ""}
          ${onClick ? "cursor-pointer" : ""}
          ${onClick && !hasPlayer ? "hover:bg-white/20" : ""}
        `}
      >
        {/* Posição no topo do card */}
        <div className={`text-[7px] sm:text-[8px] md:text-[9px] font-black py-0.5 border-b border-black/20 w-full ${hasPlayer ? "bg-black/10" : "bg-black/40 text-white"}`}>
          {POSITION_LABELS_MAP[lang][slot.position]}
        </div>

        {/* Informações centrais */}
        <div className="flex-1 flex flex-col items-center justify-center p-0.5 w-full">
          {hasPlayer ? (
            <>
              <span className="text-sm sm:text-base md:text-xl font-black leading-none drop-shadow-sm">
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
                    <img src={clubLogo} alt="Escudo" className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px] object-contain drop-shadow-[1px_1px_0_rgba(255,255,255,0.4)]" />
                  )}
                  <span className="text-[5px] sm:text-[6px] md:text-[7px] font-black leading-none opacity-80">
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