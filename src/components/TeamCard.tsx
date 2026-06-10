"use client";

import React from "react";
import { motion } from "framer-motion";
import { TeamData, FormationSlot, Player } from "@/types";
import { canPlayerFillAnyRemaining } from "@/utils/helpers";
import PlayerRow from "./PlayerRow";
import Card from "./ui/Card";

interface TeamCardProps {
  team: TeamData;
  slots: FormationSlot[];
  onPlayerSelect: (player: Player) => void;
  selectedPlayer?: Player | null;
}

export default function TeamCard({
  team,
  slots,
  onPlayerSelect,
  selectedPlayer,
}: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        {/* Team header */}
        <div className="mb-4 pb-3 border-b border-gray-100">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide">
            {team.name}
          </h3>
          <span className="text-xs text-plum font-medium">
            {team.continent === "american" ? "🌎 Americas" : "🌍 Europe"}
          </span>
        </div>

        {/* Players list */}
        <div className="space-y-1">
          {team.players.map((player, idx) => {
            const disabled = !canPlayerFillAnyRemaining(
              player.positions,
              slots
            );
            const isSelected = selectedPlayer?.name === player.name && selectedPlayer?.teamKey === player.teamKey;
            return (
              <PlayerRow
                key={`${player.name}-${idx}`}
                player={player}
                disabled={disabled}
                onClick={() => onPlayerSelect(player)}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
