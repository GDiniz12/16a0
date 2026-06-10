"use client";

import React from "react";
import { FormationSlot } from "@/types";
import PlayerMarker from "./PlayerMarker";

interface FootballPitchProps {
  slots: FormationSlot[];
  onSlotClick?: (id: number) => void;
  highlightedSlots?: number[];
}

export default function FootballPitch({
  slots,
  onSlotClick,
  highlightedSlots = [],
}: FootballPitchProps) {
  return (
    <div className="w-full max-w-[420px] mx-auto p-2">
      <div
        className="relative w-full rounded-none border-4 border-white shadow-[12px_12px_0_0_rgba(0,0,0,0.7)]"
        style={{
          paddingBottom: "145%",
          background: "#1A3B2B",
        }}
      >
        {/* Linha de Meio Campo */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/30 -translate-y-1/2 pointer-events-none" />
        
        {/* Losango Central Brutalista */}
        <div className="absolute top-1/2 left-1/2 w-20 h-20 md:w-28 md:h-28 border-4 border-white/30 -translate-x-1/2 -translate-y-1/2 rounded-none transform rotate-45 pointer-events-none" />

        {/* Área Superior */}
        <div className="absolute top-0 left-1/2 w-[55%] h-[18%] border-b-4 border-l-4 border-r-4 border-white/30 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-0 left-1/2 w-[30%] h-[7%] border-b-4 border-l-4 border-r-4 border-white/30 -translate-x-1/2 pointer-events-none" />

        {/* Área Inferior */}
        <div className="absolute bottom-0 left-1/2 w-[55%] h-[18%] border-t-4 border-l-4 border-r-4 border-white/30 -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-[30%] h-[7%] border-t-4 border-l-4 border-r-4 border-white/30 -translate-x-1/2 pointer-events-none" />

        {/* Estilização das Listras do Gramado */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${(i * 100) / 10}%`,
              height: `${100 / 10}%`,
              background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)",
            }}
          />
        ))}

        {/* Renderização das Cartas de Jogadores */}
        {slots.map((slot) => (
          <PlayerMarker
            key={slot.id}
            slot={slot}
            onClick={onSlotClick ? () => onSlotClick(slot.id) : undefined}
            isHighlighted={highlightedSlots.includes(slot.id)}
          />
        ))}
      </div>
    </div>
  );
}