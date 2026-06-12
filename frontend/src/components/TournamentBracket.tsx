"use client";

import React from "react";
import { KnockoutRound } from "@/types";

interface TournamentBracketProps {
  rounds: KnockoutRound[];
}

export default function TournamentBracket({ rounds }: TournamentBracketProps) {
  if (!rounds || rounds.length === 0) return null;

  // Group rounds by stage name
  const stages: { name: string; matches: KnockoutRound[] }[] = [];
  rounds.forEach(r => {
    let stage = stages.find(s => s.name === r.round);
    if (!stage) {
      stage = { name: r.round, matches: [] };
      stages.push(stage);
    }
    stage.matches.push(r);
  });

  return (
    <div className="bg-[#00183F] border-4 border-white p-4 overflow-x-auto shadow-[8px_8px_0_0_#0033A0] mt-8 w-full max-w-full">
      <h2 className="text-2xl font-black uppercase text-center text-white mb-6 border-b-2 border-white/20 pb-2">
        Chaveamento - Modo Guerra
      </h2>
      <div className="flex flex-row justify-center items-stretch gap-6 min-w-max pb-4">
        {stages.map((stage, stageIdx) => (
          <div key={stage.name} className="flex flex-col justify-around gap-6 min-w-[220px]">
            <h3 className="text-center font-black uppercase text-amber-400 text-sm tracking-widest bg-black/20 p-1">
              {stage.name}
            </h3>
            <div className="flex flex-col justify-around flex-1 gap-4">
              {stage.matches.map((match, idx) => {
                const homeTeam = match.leg1.homeTeam;
                const awayTeam = match.leg1.awayTeam;
                
                const homeGoals = match.leg1.homeGoals + (match.leg2 ? match.leg2.awayGoals : 0);
                const awayGoals = match.leg1.awayGoals + (match.leg2 ? match.leg2.homeGoals : 0);

                const isHomeWinner = match.winner === homeTeam;
                const isAwayWinner = match.winner === awayTeam;

                const hasPenalties = match.leg1.isPenalties || match.leg2?.isPenalties;
                const homePen = match.leg1.homePenalties ?? match.leg2?.homePenalties ?? 0;
                const awayPen = match.leg1.awayPenalties ?? match.leg2?.awayPenalties ?? 0;

                return (
                  <div key={idx} className="bg-[#1E293B] border-2 border-white/30 p-2 shadow-lg relative flex flex-col justify-center min-h-[80px]">
                    
                    <div className={`flex justify-between items-center px-2 py-1 ${isHomeWinner ? 'font-black text-white bg-emerald-600/30' : 'text-gray-400'}`}>
                      <span className="truncate max-w-[140px] text-sm uppercase">{homeTeam}</span>
                      <span className="text-lg">{homeGoals}</span>
                    </div>
                    
                    <div className="w-full h-px bg-white/10 my-1" />
                    
                    <div className={`flex justify-between items-center px-2 py-1 ${isAwayWinner ? 'font-black text-white bg-emerald-600/30' : 'text-gray-400'}`}>
                      <span className="truncate max-w-[140px] text-sm uppercase">{awayTeam}</span>
                      <span className="text-lg">{awayGoals}</span>
                    </div>

                    {hasPenalties && (
                      <div className="absolute -right-2 -top-3 bg-[#00183F] border border-amber-400 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Pen: {homePen} - {awayPen}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
