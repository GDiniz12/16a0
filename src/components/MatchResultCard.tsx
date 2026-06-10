"use client";

import React from "react";
import { motion } from "framer-motion";
import { MatchResult } from "@/types";

interface MatchResultCardProps {
  match: MatchResult;
  userTeamName: string;
  index?: number;
}

export default function MatchResultCard({
  match,
  userTeamName,
  index = 0,
}: MatchResultCardProps) {
  const isHome = match.homeTeam === userTeamName;
  const userGoals = isHome ? match.homeGoals : match.awayGoals;
  const oppGoals = isHome ? match.awayGoals : match.homeGoals;

  const result =
    userGoals > oppGoals
      ? "win"
      : userGoals < oppGoals
      ? "loss"
      : "draw";

  const resultColors = {
    win: "border-l-sage-dark bg-sage/10",
    draw: "border-l-sand bg-sand/10",
    loss: "border-l-rose bg-rose/10",
  };

  const resultBadge = {
    win: { text: "W", color: "bg-sage-dark text-white" },
    draw: { text: "D", color: "bg-sand text-gray-700" },
    loss: { text: "L", color: "bg-rose text-white" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`
        flex items-center gap-3 p-3 rounded-xl border-l-4
        ${resultColors[result]}
      `}
    >
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${resultBadge[result].color}`}
      >
        {resultBadge[result].text}
      </span>

      <div className="flex-1 flex items-center justify-center gap-2 text-sm">
        <span
          className={`font-medium text-right flex-1 truncate ${
            isHome ? "font-bold text-plum" : "text-gray-700"
          }`}
        >
          {match.homeTeam}
        </span>
        <span className="font-black text-gray-800 text-base min-w-[50px] text-center">
          {match.homeGoals} - {match.awayGoals}
        </span>
        <span
          className={`font-medium text-left flex-1 truncate ${
            !isHome ? "font-bold text-plum" : "text-gray-700"
          }`}
        >
          {match.awayTeam}
        </span>
      </div>
    </motion.div>
  );
}
