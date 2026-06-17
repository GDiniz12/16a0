"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { KnockoutRound } from "@/types";
import MatchResultCard from "./MatchResultCard";
import { useLanguage } from "@/context/LanguageContext";
import { clubLogos, americans, europeans } from "@/data/data";
import { useGame } from "@/context/GameContext";

interface KnockoutMatchProps {
  roundData: KnockoutRound;
  userTeamName: string;
  tick: number;
  startTick: number;
  currentMinute1?: number;
  currentMinute2?: number;
  penaltyTick?: number;
  simulationMode?: string;
  isUserMatch?: boolean;
}

const getLogoUrl = (teamName: string) => {
  if (!teamName) return "";
  let formatted = teamName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
  formatted = formatted.replace(/-\d{4}$/, ""); // Remove o ano pro logo
  return clubLogos[formatted] || "";
};

export default function KnockoutMatch({ roundData, userTeamName, tick, startTick, currentMinute1, currentMinute2, penaltyTick, simulationMode, isUserMatch }: KnockoutMatchProps) {
  const { lang } = useLanguage();

  // Detect neutral (non-user) match
  const isNeutral = isUserMatch === false || (roundData.leg1.homeTeam !== userTeamName && roundData.leg1.awayTeam !== userTeamName);
  
  const showHeader = tick >= startTick; 
  const showLeg1 = tick >= startTick; 
  const showLeg2 = roundData.leg2 && tick >= startTick + 1; 
  const showAgg = roundData.leg2 ? tick >= startTick + 2 : tick >= startTick + 1; 

  // Team references for neutral display
  const team1Name = roundData.leg1.homeTeam;
  const team2Name = roundData.leg1.awayTeam;

  const { isTie, userTotal, oppTotal, userPenalties, oppPenalties, userPenScore, oppPenScore } = useMemo(() => {
    if (isNeutral) {
      // Neutral mode: use homeTeam of leg1 as team1, awayTeam as team2
      let t1Total = roundData.leg1.homeGoals;
      let t2Total = roundData.leg1.awayGoals;

      if (roundData.leg2) {
        // In leg2 the home/away might be swapped, so find by team name
        const isT1HomeLeg2 = roundData.leg2.homeTeam === team1Name;
        t1Total += isT1HomeLeg2 ? roundData.leg2.homeGoals : roundData.leg2.awayGoals;
        t2Total += isT1HomeLeg2 ? roundData.leg2.awayGoals : roundData.leg2.homeGoals;
      }

      const tie = t1Total === t2Total;
      const hasPenalties = (roundData.leg1.isPenalties || (roundData.leg2 && roundData.leg2.isPenalties)) ? true : false;
      const isPenTie = tie && hasPenalties;

      let t1Pens: {name: string, scored: boolean, missed: boolean, order: number}[] = [];
      let t2Pens: {name: string, scored: boolean, missed: boolean, order: number}[] = [];
      let t1PenScore = 0;
      let t2PenScore = 0;

      if (isPenTie) {
        const penMatch = roundData.leg2 && roundData.leg2.isPenalties ? roundData.leg2 : roundData.leg1;
        const isT1HomePen = penMatch.homeTeam === team1Name;
        const pEvents = penMatch.penaltyEvents || [];
        pEvents.forEach((ev, idx) => {
          const isMiss = ev.type === "penalty_miss";
          const isEvHome = ev.team === "home";
          const isT1 = isEvHome ? isT1HomePen : !isT1HomePen;
          if (simulationMode === 'accompanied' && penaltyTick !== undefined) {
            if (idx >= penaltyTick) return;
          }
          if (isT1) {
            t1Pens.push({ name: ev.player, scored: !isMiss, missed: isMiss, order: idx });
            if (!isMiss) t1PenScore++;
          } else {
            t2Pens.push({ name: ev.player, scored: !isMiss, missed: isMiss, order: idx });
            if (!isMiss) t2PenScore++;
          }
        });
      }

      return {
        isTie: isPenTie,
        userTotal: t1Total,
        oppTotal: t2Total,
        userPenalties: t1Pens,
        oppPenalties: t2Pens,
        userPenScore: t1PenScore,
        oppPenScore: t2PenScore
      };
    }

    // User match: original logic
    const isHomeLeg1 = roundData.leg1.homeTeam === userTeamName;
    const userGoals1 = isHomeLeg1 ? roundData.leg1.homeGoals : roundData.leg1.awayGoals;
    const oppGoals1 = isHomeLeg1 ? roundData.leg1.awayGoals : roundData.leg1.homeGoals;

    let uTotal = userGoals1;
    let oTotal = oppGoals1;

    if (roundData.leg2) {
      const isHomeLeg2 = roundData.leg2.homeTeam === userTeamName;
      uTotal += isHomeLeg2 ? roundData.leg2.homeGoals : roundData.leg2.awayGoals;
      oTotal += isHomeLeg2 ? roundData.leg2.awayGoals : roundData.leg2.homeGoals;
    }

    const tie = uTotal === oTotal;
    const hasPenalties = (roundData.leg1.isPenalties || (roundData.leg2 && roundData.leg2.isPenalties)) ? true : false;
    const isPenTie = tie && hasPenalties;

    let userPens: {name: string, scored: boolean, missed: boolean, order: number}[] = [];
    let oppPens: {name: string, scored: boolean, missed: boolean, order: number}[] = [];
    let uPenScore = 0;
    let oPenScore = 0;

    if (isPenTie) {
      const penMatch = roundData.leg2 && roundData.leg2.isPenalties ? roundData.leg2 : roundData.leg1;
      const isHomePen = penMatch.homeTeam === userTeamName;
      
      const pEvents = penMatch.penaltyEvents || [];
      
      pEvents.forEach((ev, idx) => {
         const isMiss = ev.type === "penalty_miss";
         const isEvHome = ev.team === "home";
         
         const isUser = isEvHome ? isHomePen : !isHomePen;
         
         // Limitar pelos ticks em modo acompanhado
         if (simulationMode === 'accompanied' && penaltyTick !== undefined) {
            if (idx >= penaltyTick) return;
         }

         if (isUser) {
            userPens.push({ name: ev.player, scored: !isMiss, missed: isMiss, order: idx });
            if (!isMiss) uPenScore++;
         } else {
            oppPens.push({ name: ev.player, scored: !isMiss, missed: isMiss, order: idx });
            if (!isMiss) oPenScore++;
         }
      });
    }

    return { 
      isTie: isPenTie, 
      userTotal: uTotal, 
      oppTotal: oTotal,
      userPenalties: userPens,
      oppPenalties: oppPens,
      userPenScore: uPenScore,
      oppPenScore: oPenScore
    };
  }, [roundData, userTeamName, simulationMode, penaltyTick, isNeutral, team1Name]);

  // Determine whether the penalty reveal is complete
  const penMatchLocal = roundData.leg2 && roundData.leg2.isPenalties ? roundData.leg2 : roundData.leg1;
  const actualTotalEvents = penMatchLocal?.penaltyEvents?.length || 0;
  const penaltiesFullyRevealed = !isTie || (
    simulationMode === 'automatic' || 
    simulationMode === 'instant' ||
    (simulationMode === 'accompanied' && penaltyTick !== undefined && penaltyTick >= actualTotalEvents && actualTotalEvents > 0)
  );

  // Hide penalty details in the leg cards until the aggregate penalty reveal is done
  const shouldHidePenaltiesInLegs = isTie && !penaltiesFullyRevealed;

  if (!showHeader) return null;

  const displayTeam1 = isNeutral ? team1Name : userTeamName;
  const displayTeam2 = isNeutral ? team2Name : roundData.userOpponent;
  const team1Won = roundData.winner === displayTeam1;

  const userLogo = getLogoUrl(displayTeam1);
  const oppLogo = getLogoUrl(displayTeam2);

  const isFinal = roundData.round === 'Final' || roundData.round === 'Finals' || roundData.round === 'FINAL';
  const containerClass = isFinal
    ? "bg-gradient-to-br from-[#1E293B] to-[#0f172a] border-4 border-yellow-400 p-3 sm:p-4 md:p-6 shadow-[10px_10px_0_0_#b45309] mb-8 relative overflow-hidden"
    : "bg-[#1E293B] border-4 border-white p-3 sm:p-4 md:p-6 shadow-[10px_10px_0_0_rgba(0,0,0,0.6)] mb-8";

  const titleClass = isFinal
    ? "text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,1)]"
    : "text-xl sm:text-2xl md:text-3xl font-black text-amber-400 uppercase tracking-widest drop-shadow-[2px_2px_0_#00183F]";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={containerClass}
    >
      {isFinal && (
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(250,204,21,0.5) 10px, rgba(250,204,21,0.5) 20px)" }} />
      )}
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b-4 border-white/20 gap-4">
        <h2 className={titleClass}>
          {roundData.round}
        </h2>
        
        {showAgg && penaltiesFullyRevealed && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className={`px-3 py-1.5 border-2 border-white font-black uppercase tracking-widest text-[10px] md:text-sm shadow-[3px_3px_0_0_#00183F] ${isNeutral ? "bg-sky-600 text-white" : roundData.userAdvanced ? "bg-emerald-500 text-white" : "bg-rose-600 text-white"}`}
          >
            {isNeutral
              ? `${roundData.winner} ${lang === "pt" ? "avançou" : "advanced"}`
              : roundData.userAdvanced ? (lang === "pt" ? "Avançou" : "Advanced") : (lang === "pt" ? "Eliminado" : "Eliminated")
            }
          </motion.div>
        )}
      </div>

      <div className="relative z-10 space-y-4 mb-6">
        {showLeg1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <MatchResultCard 
              match={roundData.leg1} 
              userTeamName={displayTeam1} 
              stage={lang === "pt" ? (roundData.leg2 ? "Jogo de Ida" : "Jogo Único") : (roundData.leg2 ? "1st Leg" : "Single Match")} 
              currentMinute={currentMinute1}
              hidePenalties={shouldHidePenaltiesInLegs}
            />
          </motion.div>
        )}
        
        {showLeg2 && roundData.leg2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <MatchResultCard 
              match={roundData.leg2} 
              userTeamName={displayTeam1} 
              stage={lang === "pt" ? "Jogo de Volta" : "2nd Leg"} 
              currentMinute={currentMinute2}
              hidePenalties={shouldHidePenaltiesInLegs}
            />
          </motion.div>
        )}
      </div>

      {showAgg && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b132b] via-[#121f3d] to-[#0b132b] border border-white/5 p-6 md:p-10 mt-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          {/* Decorative glowing orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl">
            <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-30 ${isNeutral ? (team1Won ? 'bg-sky-500' : 'bg-gray-500') : (roundData.userAdvanced ? 'bg-emerald-500' : 'bg-rose-500')}`} />
            <div className={`absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-30 ${isNeutral ? (!team1Won ? 'bg-sky-500' : 'bg-gray-500') : (!roundData.userAdvanced ? 'bg-rose-500' : 'bg-emerald-500')}`} />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold uppercase text-blue-200 tracking-[0.2em]">
                {lang === "pt" ? "Placar Agregado" : "Aggregate Score"}
              </span>
            </div>
            
            <div className="flex items-center justify-center w-full max-w-3xl gap-4 sm:gap-8 md:gap-12">
              {/* Team 1 Side */}
              <div className="flex flex-col items-center flex-1 gap-4">
                {userLogo && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 scale-150" />
                    <img src={userLogo} alt={displayTeam1} className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2" />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <span className={`text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] ${isNeutral ? (team1Won && !isTie ? "text-sky-400" : "text-white") : (roundData.userAdvanced && !isTie ? "text-emerald-400" : "text-white")}`}>
                    {userTotal}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase text-gray-400 tracking-wider text-center max-w-[120px] sm:max-w-[160px] truncate mt-2">
                    {displayTeam1}
                  </span>
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-transparent via-gray-400 to-transparent opacity-30" />
                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-gray-400 font-bold text-xs md:text-sm tracking-widest">VS</span>
                </div>
                <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-transparent via-gray-400 to-transparent opacity-30" />
              </div>
              
              {/* Team 2 Side */}
              <div className="flex flex-col items-center flex-1 gap-4">
                {oppLogo && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 scale-150" />
                    <img src={oppLogo} alt={displayTeam2} className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2" />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <span className={`text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] ${isNeutral ? (!team1Won && !isTie ? "text-sky-400" : "text-white") : (!roundData.userAdvanced && !isTie ? "text-rose-400" : "text-white")}`}>
                    {oppTotal}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase text-gray-400 tracking-wider text-center max-w-[120px] sm:max-w-[160px] truncate mt-2">
                    {displayTeam2}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Penalties Section */}
            {isTie && (
              <div className="w-full mt-10 pt-8 border-t border-white/10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0b132b] px-4">
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                    {lang === "pt" ? "Pênaltis" : "Penalties"}
                  </h4>
                </div>
                
                <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8 bg-white/5 rounded-2xl py-4 sm:py-6 border border-white/5 backdrop-blur-md shadow-inner">
                   <span className={`text-4xl sm:text-5xl font-black drop-shadow-md ${isNeutral ? (team1Won ? "text-sky-400" : "text-white") : (roundData.userAdvanced ? "text-emerald-400" : "text-white")}`}>{userPenScore}</span>
                   <span className="text-gray-500 font-bold text-sm sm:text-base">X</span>
                   <span className={`text-4xl sm:text-5xl font-black drop-shadow-md ${isNeutral ? (!team1Won ? "text-sky-400" : "text-white") : (!roundData.userAdvanced ? "text-rose-400" : "text-white")}`}>{oppPenScore}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                  {/* Team 1 Penalties */}
                  <div className="flex flex-col gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider pb-2 border-b border-white/10 mb-2 truncate ${isNeutral ? "text-blue-300" : "text-blue-300"}`}>
                      {displayTeam1}
                    </span>
                    {userPenalties.map((pen, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-lg border border-white/5"
                      >
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full shadow-inner ${pen.scored ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {pen.scored ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium truncate ${pen.scored ? "text-gray-200" : "text-gray-500 line-through"}`}>
                          {pen.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Team 2 Penalties */}
                  <div className="flex flex-col gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider pb-2 border-b border-white/10 mb-2 truncate sm:text-right ${isNeutral ? "text-blue-300" : "text-rose-400"}`}>
                      {displayTeam2}
                    </span>
                    {oppPenalties.map((pen, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 sm:flex-row-reverse bg-white/5 px-3 py-2 rounded-lg border border-white/5"
                      >
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full shadow-inner ${pen.scored ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {pen.scored ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium truncate sm:text-right ${pen.scored ? "text-gray-200" : "text-gray-500 line-through"}`}>
                          {pen.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {penaltiesFullyRevealed && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-10 p-4 rounded-xl text-center border font-bold uppercase tracking-widest text-xs sm:text-sm backdrop-blur-md ${
                      isNeutral 
                        ? "bg-sky-500/10 border-sky-500/30 text-sky-300" 
                        : roundData.userAdvanced 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
                          : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    }`}
                  >
                    {lang === "pt" ? "Vencedor nos Pênaltis:" : "Shootout Winner:"} <span className="text-white ml-2">{roundData.winner}</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}