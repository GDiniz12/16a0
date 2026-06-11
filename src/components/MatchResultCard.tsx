"use client";

import React from "react";
import { MatchResult } from "@/types";
import { clubLogos } from "@/data/data";

interface MatchResultCardProps {
  match: MatchResult;
  userTeamName: string;
  index?: number;
  stage?: string;
}

const getLogoUrl = (teamName: string) => {
  if (!teamName) return "";
  let formatted = teamName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
  formatted = formatted.replace(/-\d{4}$/, "");
  return clubLogos[formatted] || "";
};

export default function MatchResultCard({ match, userTeamName, index, stage }: MatchResultCardProps) {
  const isHome = match.homeTeam === userTeamName;
  const userGoals = isHome ? match.homeGoals : match.awayGoals;
  const oppGoals = isHome ? match.awayGoals : match.homeGoals;
  const opponentName = isHome ? match.awayTeam : match.homeTeam;

  const isUserWinner = userGoals > oppGoals;
  const isDraw = userGoals === oppGoals;

  const userLogo = getLogoUrl(userTeamName);
  const oppLogo = getLogoUrl(opponentName);

  return (
    <div className="p-0 overflow-hidden bg-white text-[#00183F] border-4 border-[#00183F] shadow-[6px_6px_0_0_rgba(0,0,0,0.8)] flex flex-col mb-4 transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_rgba(0,0,0,0.9)]">
      
      {stage && (
        <div className="bg-[#00183F] text-white text-xs font-black uppercase px-4 py-1.5 tracking-widest border-b-4 border-[#00183F]">
          {stage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch">
        <div className={`w-full sm:w-4 min-h-[12px] sm:min-h-full ${isUserWinner ? "bg-emerald-500" : isDraw ? "bg-amber-400" : "bg-rose-500"} border-b-4 sm:border-b-0 sm:border-r-4 border-[#00183F]`} />

        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            
            {/* Seu Time */}
            <div className="flex-1 flex items-center justify-start gap-2 md:gap-3 min-w-[100px]">
              {userLogo && (
                <img src={userLogo} alt={userTeamName} className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)] hidden sm:block" />
              )}
              <div className="text-left">
                <h3 className="text-sm md:text-xl font-black uppercase tracking-tight text-[#0033A0] truncate">
                  {userTeamName}
                </h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase">{isHome ? "Mandante" : "Visitante"}</span>
              </div>
            </div>

            {/* Placar Brutal */}
            <div className="flex items-center gap-2 bg-[#D9D9D9] border-2 border-[#00183F] px-4 py-2 shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]">
              <span className="text-xl md:text-3xl font-black">{userGoals}</span>
              <span className="text-sm md:text-lg font-black text-gray-400">X</span>
              <span className="text-xl md:text-3xl font-black">{oppGoals}</span>
            </div>

            {/* Adversário */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-3 min-w-[100px]">
              <div className="text-right">
                <h3 className="text-sm md:text-xl font-black uppercase tracking-tight text-rose-700 truncate">
                  {opponentName}
                </h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase">{isHome ? "Visitante" : "Mandante"}</span>
              </div>
              {oppLogo && (
                <img src={oppLogo} alt={opponentName} className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)] hidden sm:block" />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}