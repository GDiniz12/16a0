"use client";

import React from "react";
import { FormationSlot, FormationType, Manager } from "@/types";
import PlayerMarker from "./PlayerMarker";
import { FORMATION_LINKS } from "@/utils/formations";
import { getLinkChemistry, getLinkColor } from "@/utils/helpers";

interface FootballPitchProps {
  slots: FormationSlot[];
  formation?: FormationType | null;
  onSlotClick?: (id: number) => void;
  highlightedSlots?: number[];
  manager?: Manager | null;
}

export default function FootballPitch({ slots, formation, onSlotClick, highlightedSlots = [], manager }: FootballPitchProps) {
  return (
    <div className="w-full max-w-[420px] mx-auto p-2 relative">
      <div className="relative w-full rounded-none border-4 border-white shadow-[12px_12px_0_0_rgba(0,0,0,0.7)] overflow-hidden" style={{ paddingBottom: "145%", background: "#135029" }}>
        
        {/* LISTRAS DO GRAMADO (Stripes verticais) */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 10%, rgba(0,0,0,0.03) 10%, rgba(0,0,0,0.03) 20%)"
        }} />

        {/* Linhas de marcação do campo (Realistas) */}
        {/* Linha Central */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/40 -translate-y-1/2 pointer-events-none" />
        {/* Círculo Central */}
        <div className="absolute top-1/2 left-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full border-[2px] border-white/40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        {/* Ponto Central */}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        {/* Área Top */}
        <div className="absolute top-0 left-1/2 w-[50%] h-[16%] border-b-[2px] border-l-[2px] border-r-[2px] border-white/40 -translate-x-1/2 pointer-events-none" />
        {/* Pequena Área Top */}
        <div className="absolute top-0 left-1/2 w-[22%] h-[6%] border-b-[2px] border-l-[2px] border-r-[2px] border-white/40 -translate-x-1/2 pointer-events-none" />
        {/* Meia Lua Top */}
        <div className="absolute top-[16%] left-1/2 w-16 h-8 md:w-20 md:h-10 border-b-[2px] border-l-[2px] border-r-[2px] border-white/40 rounded-b-full -translate-x-1/2 pointer-events-none" />

        {/* Área Bottom */}
        <div className="absolute bottom-0 left-1/2 w-[50%] h-[16%] border-t-[2px] border-l-[2px] border-r-[2px] border-white/40 -translate-x-1/2 pointer-events-none" />
        {/* Pequena Área Bottom */}
        <div className="absolute bottom-0 left-1/2 w-[22%] h-[6%] border-t-[2px] border-l-[2px] border-r-[2px] border-white/40 -translate-x-1/2 pointer-events-none" />
        {/* Meia Lua Bottom */}
        <div className="absolute bottom-[16%] left-1/2 w-16 h-8 md:w-20 md:h-10 border-t-[2px] border-l-[2px] border-r-[2px] border-white/40 rounded-t-full -translate-x-1/2 pointer-events-none" />

        {/* LINHAS DE ENTROSAMENTO (CHEMISTRY) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {formation && FORMATION_LINKS[formation]?.map(([id1, id2], idx) => {
            const slot1 = slots.find(s => s.id === id1);
            const slot2 = slots.find(s => s.id === id2);
            if (!slot1 || !slot2) return null;
            
            const chem = getLinkChemistry(slot1.player, slot2.player);
            const color = getLinkColor(chem);
            return (
              <line key={idx} x1={`${slot1.x}%`} y1={`${slot1.y}%`} x2={`${slot2.x}%`} y2={`${slot2.y}%`} 
                stroke={color} strokeWidth="3" 
                strokeDasharray={chem === 0 ? "6,6" : "none"} 
                filter={chem === 2 ? "url(#neonGlow)" : ""}
                opacity={chem === 0 ? 0.6 : 0.9}
              />
            );
          })}
        </svg>

        {/* JOGADORES (Z-index superior) */}
        {slots.map((slot) => (
          <PlayerMarker key={slot.id} slot={slot} onClick={onSlotClick ? () => onSlotClick(slot.id) : undefined} isHighlighted={highlightedSlots.includes(slot.id)} />
        ))}

        {/* TÉCNICO (EXTREMA ESQUERDA ABAIXO) */}
        {manager && (
          <div className="absolute bottom-2 left-2 bg-[#00183F] border-2 border-white text-white px-2 py-1 shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] flex items-center gap-1 md:gap-2 z-10 pointer-events-none">
            <span className="text-[9px] md:text-[10px] font-black text-amber-400">TEC</span>
            <span className="text-[10px] md:text-xs font-black uppercase whitespace-nowrap">{manager.tecnico}</span>
          </div>
        )}
      </div>
    </div>
  );
}