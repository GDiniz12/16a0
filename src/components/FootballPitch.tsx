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
    <div className="w-full max-w-[420px] mx-auto">
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg"
        style={{
          paddingBottom: "147%",
          background:
            "linear-gradient(180deg, #3d6b50 0%, #4a7c5f 30%, #4a7c5f 70%, #3d6b50 100%)",
        }}
      >
        {/* Field markings */}
        {/* Center line */}
        <div className="absolute top-1/2 left-[5%] right-[5%] h-[1px] bg-white/25" />

        {/* Center circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] rounded-full border border-white/25"
          style={{ paddingBottom: "25%" }}
        />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30" />

        {/* Top penalty area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-[18%] border-b border-l border-r border-white/25 rounded-b-sm" />

        {/* Top goal area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[8%] border-b border-l border-r border-white/25 rounded-b-sm" />

        {/* Top penalty arc */}
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[18%] rounded-full border-b border-white/20"
          style={{ paddingBottom: "9%" }}
        />

        {/* Bottom penalty area */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[18%] border-t border-l border-r border-white/25 rounded-t-sm" />

        {/* Bottom goal area */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[8%] border-t border-l border-r border-white/25 rounded-t-sm" />

        {/* Bottom penalty arc */}
        <div
          className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[18%] rounded-full border-t border-white/20"
          style={{ paddingBottom: "9%" }}
        />

        {/* Corner arcs */}
        <div className="absolute top-0 left-0 w-[4%] h-[3%] border-b-2 border-r-2 border-white/15 rounded-br-full" />
        <div className="absolute top-0 right-0 w-[4%] h-[3%] border-b-2 border-l-2 border-white/15 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-[4%] h-[3%] border-t-2 border-r-2 border-white/15 rounded-tr-full" />
        <div className="absolute bottom-0 right-0 w-[4%] h-[3%] border-t-2 border-l-2 border-white/15 rounded-tl-full" />

        {/* Subtle horizontal stripes for grass effect */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${(i * 100) / 12}%`,
              height: `${100 / 12}%`,
              background:
                i % 2 === 0
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.02)",
            }}
          />
        ))}

        {/* Player markers */}
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
