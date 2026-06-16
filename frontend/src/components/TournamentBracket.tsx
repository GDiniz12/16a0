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
    <div className="bg-[#00102A] border-4 border-[#0033A0] p-6 overflow-x-auto shadow-[12px_12px_0_0_rgba(0,0,0,0.8)] mt-8 w-full max-w-full rounded-xl">
      <h2 className="text-3xl font-black uppercase text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-8 border-b-2 border-white/10 pb-4 tracking-tight drop-shadow-lg">
        Chaveamento - Guerra
      </h2>
      <div className="flex flex-row justify-center items-stretch gap-8 md:gap-16 min-w-max pb-8 px-4">
        {stages.map((stage, stageIdx) => (
          <div key={stage.name} className="flex flex-col justify-around gap-8 min-w-[260px] relative">
            <h3 className="absolute -top-12 left-1/2 -translate-x-1/2 text-center font-black uppercase text-amber-400 text-xs md:text-sm tracking-[0.2em] bg-black/40 px-4 py-1 rounded-full border border-amber-400/30 whitespace-nowrap shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              {stage.name}
            </h3>
            
            <div className="flex flex-col justify-around flex-1 gap-6 w-full">
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
                  <div key={idx} className="relative group">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-xl relative flex flex-col justify-center min-h-[90px] overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_20px_rgba(0,191,255,0.2)]">
                      
                      {/* Vencedor Highlight Border */}
                      {isHomeWinner && <div className="absolute left-0 top-0 bottom-1/2 w-1 bg-amber-400 shadow-[0_0_8px_#fbbf24]" />}
                      {isAwayWinner && <div className="absolute left-0 top-1/2 bottom-0 w-1 bg-amber-400 shadow-[0_0_8px_#fbbf24]" />}

                      <div className={`flex justify-between items-center px-4 py-2 transition-colors ${isHomeWinner ? 'bg-gradient-to-r from-emerald-600/30 to-transparent font-black text-white' : 'text-gray-400 font-medium'}`}>
                        <span className="truncate max-w-[150px] text-sm uppercase">{homeTeam}</span>
                        <span className={`text-xl ${isHomeWinner ? 'text-emerald-400 drop-shadow-md' : 'text-gray-500'}`}>{homeGoals}</span>
                      </div>
                      
                      <div className="w-full h-px bg-white/10" />
                      
                      <div className={`flex justify-between items-center px-4 py-2 transition-colors ${isAwayWinner ? 'bg-gradient-to-r from-emerald-600/30 to-transparent font-black text-white' : 'text-gray-400 font-medium'}`}>
                        <span className="truncate max-w-[150px] text-sm uppercase">{awayTeam}</span>
                        <span className={`text-xl ${isAwayWinner ? 'text-emerald-400 drop-shadow-md' : 'text-gray-500'}`}>{awayGoals}</span>
                      </div>

                      {hasPenalties && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 border border-amber-400 text-amber-400 text-[10px] font-black px-2 py-1 rounded-md uppercase shadow-lg">
                          PEN: {homePen} - {awayPen}
                        </div>
                      )}
                    </div>
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
