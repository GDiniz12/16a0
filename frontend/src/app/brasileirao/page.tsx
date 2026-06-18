"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { useLanguage } from "@/context/LanguageContext";
import { LeagueTeam } from "@/types";

function StandingsTable({
  teams,
  userTeamName,
}: {
  teams: LeagueTeam[];
  userTeamName: string;
}) {
  return (
    <table className="w-full text-xs font-black text-white bg-[#00183F] border-2 border-white/20">
      <thead>
        <tr className="bg-white/10 text-white/60 border-b-2 border-white/20">
          <th className="text-left pl-2 py-2 font-black uppercase w-8">#</th>
          <th className="text-left py-2 font-black uppercase">Time</th>
          <th className="py-2 w-8">J</th>
          <th className="py-2 w-8">V</th>
          <th className="py-2 w-8">E</th>
          <th className="py-2 w-8">D</th>
          <th className="py-2 w-10">GP</th>
          <th className="py-2 w-10">GC</th>
          <th className="py-2 w-8">SG</th>
          <th className="py-2 w-10 pr-2">Pts</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team, idx) => {
          const isUser = team.isUser;
          const isTop4 = idx < 4;
          const isTop6 = idx >= 4 && idx < 6;
          const isTop12 = idx >= 6 && idx < 12;
          const isRelegated = idx >= 16;

          let rowBg = "";
          if (isUser) rowBg = "bg-amber-400/20";
          else if (isTop4) rowBg = "bg-emerald-900/40";
          else if (isTop6) rowBg = "bg-blue-900/40";
          else if (isTop12) rowBg = "bg-sky-900/20";
          else if (isRelegated) rowBg = "bg-rose-900/30";

          let dotColor = "bg-white/20";
          if (isTop4) dotColor = "bg-emerald-400";
          else if (isTop6) dotColor = "bg-blue-400";
          else if (isTop12) dotColor = "bg-sky-400";
          else if (isRelegated) dotColor = "bg-rose-500";

          return (
            <tr key={team.name} className={`border-t border-white/10 ${rowBg}`}>
              <td className="pl-2 py-2 text-white/50 font-black">{idx + 1}</td>
              <td className="py-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                  <span
                    className={`truncate max-w-[120px] font-black ${isUser ? "text-amber-300" : "text-white"}`}
                    title={team.name}
                  >
                    {team.name}
                  </span>
                </div>
              </td>
              <td className="text-center py-2 text-white/70">{team.played}</td>
              <td className="text-center py-2 text-emerald-400">{team.won}</td>
              <td className="text-center py-2 text-white/60">{team.drawn}</td>
              <td className="text-center py-2 text-rose-400">{team.lost}</td>
              <td className="text-center py-2 text-white/80">{team.goalsFor}</td>
              <td className="text-center py-2 text-white/80">{team.goalsAgainst}</td>
              <td className="text-center py-2 text-white/80">
                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
              </td>
              <td className={`text-center py-2 pr-2 font-black text-sm ${isUser ? "text-amber-300" : "text-white"}`}>
                {team.points}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ScoreCard({
  homeTeam,
  awayTeam,
  homeGoals,
  awayGoals,
  userTeamName,
}: {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  userTeamName: string;
}) {
  const isUserHome = homeTeam === userTeamName;
  const isUserAway = awayTeam === userTeamName;
  const userGoals = isUserHome ? homeGoals : awayGoals;
  const oppGoals = isUserHome ? awayGoals : homeGoals;
  const won = userGoals > oppGoals;
  const drawn = userGoals === oppGoals;

  return (
    <div
      className={`border-4 p-4 flex items-center justify-between gap-4 ${
        won
          ? "border-emerald-400 shadow-[4px_4px_0_0_#14532d]"
          : drawn
          ? "border-amber-400 shadow-[4px_4px_0_0_#92400e]"
          : "border-rose-500 shadow-[4px_4px_0_0_#7f1d1d]"
      }`}
    >
      <span
        className={`font-black text-sm md:text-base uppercase truncate flex-1 text-right ${
          isUserHome ? "text-amber-300" : "text-white/70"
        }`}
      >
        {homeTeam}
      </span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`text-2xl md:text-3xl font-black ${isUserHome ? "text-amber-300" : "text-white"}`}>
          {homeGoals}
        </span>
        <span className="text-white/40 font-black text-lg">–</span>
        <span className={`text-2xl md:text-3xl font-black ${isUserAway ? "text-amber-300" : "text-white"}`}>
          {awayGoals}
        </span>
      </div>
      <span
        className={`font-black text-sm md:text-base uppercase truncate flex-1 ${
          isUserAway ? "text-amber-300" : "text-white/70"
        }`}
      >
        {awayTeam}
      </span>
    </div>
  );
}

export default function BrasileiraoPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { brasilRounds, userTeamName, clearSave } = useGame();
  const isPt = lang === "pt";

  const [displayedRound, setDisplayedRound] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!brasilRounds || brasilRounds.length === 0) {
      router.replace("/");
    }
  }, [brasilRounds, router]);

  if (!brasilRounds || brasilRounds.length === 0) return null;

  const totalRounds = brasilRounds.length; // 38
  const currentData = brasilRounds[displayedRound];
  const isLastRound = displayedRound === totalRounds - 1;
  const isFinal = showAll || isLastRound;

  const finalStandings = brasilRounds[totalRounds - 1].standingsAfterRound;
  const userPosition = finalStandings.findIndex((t) => t.isUser);
  const userIsChampion = userPosition === 0;

  const handleSimulateAll = () => {
    setShowAll(true);
    setDisplayedRound(totalRounds - 1);
  };

  const handleNextRound = () => {
    if (!isLastRound) setDisplayedRound((r) => r + 1);
  };

  const handleBackToMenu = () => {
    clearSave();
    router.push("/");
  };

  const standings = isFinal
    ? finalStandings
    : currentData.standingsAfterRound;

  const progress = ((displayedRound + 1) / totalRounds) * 100;

  return (
    <div className="min-h-screen bg-[#00183F] px-4 py-10 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 border-4 border-white bg-[#D9D9D9] p-6 shadow-[8px_8px_0_0_#0a5a00]"
        >
          <h1 className="text-4xl md:text-6xl font-black text-[#00183F] uppercase tracking-tight">
            BRASILEIRÃO
          </h1>
          <p className="text-lg text-[#0a5a00] font-black uppercase tracking-widest bg-white border-2 border-[#00183F] inline-block px-4 py-1 mt-2">
            {isFinal
              ? isPt ? "CLASSIFICAÇÃO FINAL" : "FINAL STANDINGS"
              : isPt ? `RODADA ${currentData.roundNumber} DE ${totalRounds}` : `ROUND ${currentData.roundNumber} OF ${totalRounds}`}
          </p>
        </motion.div>

        {/* Progress bar */}
        {!isFinal && (
          <div className="mb-6 border-2 border-white/30 bg-white/10 h-3">
            <motion.div
              className="h-full bg-emerald-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Champion / result banner (final only) */}
        {isFinal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`border-4 p-6 text-center mb-8 ${
              userIsChampion
                ? "border-amber-400 bg-amber-900/30 shadow-[8px_8px_0_0_#92400e]"
                : "border-white/40 bg-white/5 shadow-[8px_8px_0_0_rgba(0,0,0,0.3)]"
            }`}
          >
            {userIsChampion ? (
              <>
                <p className="text-amber-400 font-black text-xs uppercase tracking-widest mb-1">
                  {isPt ? "CAMPEÃO BRASILEIRO!" : "BRAZILIAN CHAMPION!"}
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase">
                  🏆 {userTeamName}
                </h2>
              </>
            ) : (
              <>
                <p className="text-white/60 font-black text-xs uppercase tracking-widest mb-1">
                  {isPt ? "CLASSIFICAÇÃO FINAL" : "FINAL STANDING"}
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase">
                  {isPt ? `${userPosition + 1}º LUGAR` : `${userPosition + 1}${["ST","ND","RD"][userPosition] || "TH"} PLACE`}
                </h2>
                {userPosition >= 16 && (
                  <p className="text-rose-400 font-black text-sm uppercase mt-1">
                    {isPt ? "Rebaixado" : "Relegated"}
                  </p>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* User match for the current round */}
        {!isFinal && currentData.userMatch && (
          <AnimatePresence mode="wait">
            <motion.div
              key={displayedRound}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="mb-6"
            >
              <p className="text-white/50 font-black text-xs uppercase tracking-widest mb-2">
                {isPt ? "SUA PARTIDA" : "YOUR MATCH"}
              </p>
              <ScoreCard
                homeTeam={currentData.userMatch.homeTeam}
                awayTeam={currentData.userMatch.awayTeam}
                homeGoals={currentData.userMatch.homeGoals}
                awayGoals={currentData.userMatch.awayGoals}
                userTeamName={userTeamName}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Action buttons */}
        {!isFinal && (
          <div className="flex gap-4 mb-8">
            <motion.button
              whileHover={{ translateY: -2, translateX: -2, boxShadow: "8px 8px 0 0 #064e3b" }}
              whileTap={{ translateY: 1, translateX: 1, boxShadow: "0px 0px 0 0 #064e3b" }}
              onClick={handleSimulateAll}
              className="flex-1 py-4 bg-emerald-700 text-white border-4 border-emerald-400 font-black text-base uppercase tracking-widest shadow-[4px_4px_0_0_#064e3b]"
            >
              {isPt ? "Simular Tudo" : "Simulate All"}
            </motion.button>
            <motion.button
              whileHover={{ translateY: -2, translateX: -2, boxShadow: "8px 8px 0 0 #001a6e" }}
              whileTap={{ translateY: 1, translateX: 1, boxShadow: "0px 0px 0 0 #001a6e" }}
              onClick={handleNextRound}
              disabled={isLastRound}
              className="flex-1 py-4 bg-[#D9D9D9] text-[#00183F] border-4 border-[#00183F] font-black text-base uppercase tracking-widest shadow-[4px_4px_0_0_#0033A0] disabled:opacity-40"
            >
              {isLastRound
                ? isPt ? "Última Rodada" : "Last Round"
                : isPt ? `Rodada ${displayedRound + 2} →` : `Round ${displayedRound + 2} →`}
            </motion.button>
          </div>
        )}

        {/* Standings table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-white/50 font-black text-xs uppercase tracking-widest mb-2">
            {isFinal
              ? isPt ? "CLASSIFICAÇÃO FINAL" : "FINAL TABLE"
              : isPt ? `CLASSIFICAÇÃO APÓS RODADA ${currentData.roundNumber}` : `STANDINGS AFTER ROUND ${currentData.roundNumber}`}
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-3 text-xs font-black uppercase">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> {isPt ? "Libertadores" : "Copa Lib."}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> {isPt ? "Sul-Americana" : "Copa Sud."}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> {isPt ? "Pré-Lib." : "Pre-Lib."}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> {isPt ? "Rebaixamento" : "Relegation"}</span>
          </div>

          <StandingsTable teams={standings} userTeamName={userTeamName} />
        </motion.div>

        {/* Back to menu (final only) */}
        {isFinal && (
          <div className="text-center pb-12">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ translateY: -2, translateX: -2, boxShadow: "10px 10px 0 0 #001a6e" }}
              whileTap={{ translateY: 2, translateX: 2, boxShadow: "0px 0px 0 0 #001a6e" }}
              onClick={handleBackToMenu}
              className="px-10 py-5 bg-[#D9D9D9] text-[#00183F] border-4 border-[#00183F] font-black text-xl uppercase tracking-widest shadow-[6px_6px_0_0_#0033A0]"
            >
              {isPt ? "Montar Novo Time" : "Build New Squad"}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
