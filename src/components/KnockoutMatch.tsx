"use client";

import React from "react";
import { motion } from "framer-motion";
import { KnockoutRound } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { TRANSLATIONS } from "@/lib/constants";

interface KnockoutMatchProps {
  round: KnockoutRound;
  userTeamName: string;
  index?: number;
}

export default function KnockoutMatch({
  round,
  userTeamName,
  index = 0,
}: KnockoutMatchProps) {
  // Calculate aggregate
  let userAgg = 0;
  let oppAgg = 0;

  const isHomeLeg1 = round.leg1.homeTeam === userTeamName;
  userAgg += isHomeLeg1 ? round.leg1.homeGoals : round.leg1.awayGoals;
  oppAgg += isHomeLeg1 ? round.leg1.awayGoals : round.leg1.homeGoals;

  if (round.leg2) {
    const isHomeLeg2 = round.leg2.homeTeam === userTeamName;
    userAgg += isHomeLeg2 ? round.leg2.homeGoals : round.leg2.awayGoals;
    oppAgg += isHomeLeg2 ? round.leg2.awayGoals : round.leg2.homeGoals;
  }

  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.3, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Round header */}
      <div className="bg-plum/5 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">{round.round}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            round.userAdvanced
              ? "bg-sage text-green-800"
              : "bg-rose text-red-800"
          }`}
        >
          {round.userAdvanced ? TRANSLATIONS[lang].advanced : TRANSLATIONS[lang].eliminated}
        </span>
      </div>

      <div className="p-5 space-y-3">
        {/* VS header */}
        <div className="text-center mb-3">
          <span className="text-sm text-gray-500">{TRANSLATIONS[lang].vs}</span>
          <p className="font-bold text-lg text-gray-800">
            {round.userOpponent}
          </p>
        </div>

        {/* Leg 1 */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            {round.round === "Final" ? TRANSLATIONS[lang].match : TRANSLATIONS[lang].first_leg}
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={
                round.leg1.homeTeam === userTeamName
                  ? "font-bold text-plum"
                  : "text-gray-700"
              }
            >
              {round.leg1.homeTeam}
            </span>
            <span className="font-black text-base">
              {round.leg1.homeGoals} - {round.leg1.awayGoals}
            </span>
            <span
              className={
                round.leg1.awayTeam === userTeamName
                  ? "font-bold text-plum"
                  : "text-gray-700"
              }
            >
              {round.leg1.awayTeam}
            </span>
          </div>
        </div>

        {/* Leg 2 */}
        {round.leg2 && (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {TRANSLATIONS[lang].second_leg}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={
                  round.leg2.homeTeam === userTeamName
                    ? "font-bold text-plum"
                    : "text-gray-700"
                }
              >
                {round.leg2.homeTeam}
              </span>
              <span className="font-black text-base">
                {round.leg2.homeGoals} - {round.leg2.awayGoals}
              </span>
              <span
                className={
                  round.leg2.awayTeam === userTeamName
                    ? "font-bold text-plum"
                    : "text-gray-700"
                }
              >
                {round.leg2.awayTeam}
              </span>
            </div>
          </div>
        )}

        {/* Aggregate */}
        {round.leg2 && (
          <div className="text-center pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 uppercase font-semibold">
              {TRANSLATIONS[lang].aggregate}
            </span>
            <p className="text-lg font-black text-gray-800">
              <span className="text-plum">{userAgg}</span>
              {" - "}
              <span>{oppAgg}</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
