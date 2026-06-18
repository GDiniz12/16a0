"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { useLanguage } from "@/context/LanguageContext";
import { LeagueTeam } from "@/types";

function GroupCard({
  name,
  teams,
  userTeamName,
  delay,
}: {
  name: string;
  teams: LeagueTeam[];
  userTeamName: string;
  delay: number;
}) {
  const isUserGroup = teams.some((t) => t.isUser);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`border-4 ${isUserGroup ? "border-amber-400 shadow-[6px_6px_0_0_#92400e]" : "border-white shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]"}`}
    >
      <div className={`px-3 py-2 flex items-center justify-between ${isUserGroup ? "bg-amber-400" : "bg-white"}`}>
        <span className={`font-black text-sm uppercase tracking-widest ${isUserGroup ? "text-[#00183F]" : "text-[#00183F]"}`}>
          GRUPO {name}
        </span>
        {isUserGroup && (
          <span className="text-[9px] font-black uppercase tracking-wider bg-[#00183F] text-amber-400 px-2 py-0.5">
            SEU GRUPO
          </span>
        )}
      </div>

      <table className="w-full text-xs font-black text-white bg-[#00183F]">
        <thead>
          <tr className="border-b-2 border-white/20 text-white/50">
            <th className="text-left pl-2 py-1 font-black uppercase">Time</th>
            <th className="py-1 w-7">J</th>
            <th className="py-1 w-7">V</th>
            <th className="py-1 w-7">E</th>
            <th className="py-1 w-7">D</th>
            <th className="py-1 w-7">SG</th>
            <th className="py-1 w-8 pr-2">Pts</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, idx) => {
            const qualified = idx < 2;
            return (
              <tr
                key={team.name}
                className={`border-t border-white/10 ${
                  team.isUser
                    ? "bg-amber-400/20"
                    : qualified
                    ? "bg-emerald-900/30"
                    : "bg-rose-900/20"
                }`}
              >
                <td className="pl-2 py-1.5 flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${qualified ? "bg-emerald-400" : "bg-rose-400"}`}
                  />
                  <span
                    className={`truncate max-w-[80px] ${team.isUser ? "text-amber-300" : "text-white"}`}
                    title={team.name}
                  >
                    {team.name.split(" ").slice(0, 2).join(" ")}
                  </span>
                </td>
                <td className="text-center py-1.5 text-white/80">{team.played}</td>
                <td className="text-center py-1.5 text-emerald-400">{team.won}</td>
                <td className="text-center py-1.5 text-white/60">{team.drawn}</td>
                <td className="text-center py-1.5 text-rose-400">{team.lost}</td>
                <td className="text-center py-1.5 text-white/80">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                <td className={`text-center py-1.5 pr-2 font-black ${team.isUser ? "text-amber-300" : "text-white"}`}>
                  {team.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}

export default function CopaGroupPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { copaGroups, userTeamName, startKnockoutPhase, setPhase } = useGame();
  const isPt = lang === "pt";

  useEffect(() => {
    if (copaGroups.length === 0) {
      router.replace("/");
    }
  }, [copaGroups.length, router]);

  if (copaGroups.length === 0) return null;

  const userGroup = copaGroups.find((g) => g.teams.some((t) => t.isUser));
  const userPosition = userGroup ? userGroup.teams.findIndex((t) => t.isUser) : -1;
  const userQualified = userPosition === 0 || userPosition === 1;

  const handleContinue = () => {
    if (userQualified) {
      startKnockoutPhase();
      router.push("/knockout");
    } else {
      setPhase("result");
      router.push("/result");
    }
  };

  return (
    <div className="min-h-screen bg-[#00183F] px-4 py-10 font-sans text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10 border-4 border-white bg-[#D9D9D9] p-6 shadow-[8px_8px_0_0_#0033A0]"
        >
          <h1 className="text-4xl md:text-6xl font-black text-[#00183F] uppercase tracking-tight">
            COPA DO MUNDO
          </h1>
          <p className="text-lg text-[#0033A0] font-black uppercase tracking-widest bg-white border-2 border-[#00183F] inline-block px-4 py-1 mt-2">
            {isPt ? "FASE DE GRUPOS" : "GROUP STAGE"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {copaGroups.map((group, i) => (
            <GroupCard
              key={group.name}
              name={group.name}
              teams={group.teams}
              userTeamName={userTeamName}
              delay={i * 0.05}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className={`border-4 p-6 text-center mb-8 ${
            userQualified
              ? "border-emerald-400 bg-emerald-900/30 shadow-[8px_8px_0_0_#14532d]"
              : "border-rose-500 bg-rose-900/30 shadow-[8px_8px_0_0_#7f1d1d]"
          }`}
        >
          {userQualified ? (
            <>
              <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-1">
                {isPt ? "CLASSIFICADO!" : "QUALIFIED!"}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase">
                {isPt ? `${userPosition + 1}º DO GRUPO ${userGroup?.name}` : `${userPosition + 1}${userPosition === 0 ? "ST" : "ND"} IN GROUP ${userGroup?.name}`}
              </h2>
              <p className="text-white/70 font-bold mt-2 uppercase text-sm">
                {isPt ? "Avança para as Oitavas de Final" : "Advances to the Round of 16"}
              </p>
            </>
          ) : (
            <>
              <p className="text-rose-400 font-black text-xs uppercase tracking-widest mb-1">
                {isPt ? "ELIMINADO" : "ELIMINATED"}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase">
                {isPt ? `${userPosition + 1}º DO GRUPO ${userGroup?.name}` : `${userPosition + 1}${userPosition === 2 ? "RD" : "TH"} IN GROUP ${userGroup?.name}`}
              </h2>
              <p className="text-white/70 font-bold mt-2 uppercase text-sm">
                {isPt ? "Não passou da fase de grupos" : "Did not advance from group stage"}
              </p>
            </>
          )}
        </motion.div>

        <div className="text-center pb-12">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ translateY: -2, translateX: -2, boxShadow: "10px 10px 0 0 #001a6e" }}
            whileTap={{ translateY: 2, translateX: 2, boxShadow: "0px 0px 0 0 #001a6e" }}
            onClick={handleContinue}
            className="px-10 py-5 bg-[#D9D9D9] text-[#00183F] border-4 border-[#00183F] font-black text-xl uppercase tracking-widest shadow-[6px_6px_0_0_#0033A0]"
          >
            {userQualified
              ? isPt ? "→ OITAVAS DE FINAL" : "→ ROUND OF 16"
              : isPt ? "VER RESULTADOS" : "VIEW RESULTS"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
