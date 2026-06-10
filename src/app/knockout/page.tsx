"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import KnockoutMatch from "@/components/KnockoutMatch";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { TRANSLATIONS } from "@/lib/constants";

export default function KnockoutPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const {
    knockoutRounds,
    isChampion,
    userTeamName,
    setPhase,
  } = useGame();

  const handleViewResults = () => {
    setPhase("result");
    router.push("/result");
  };

  if (knockoutRounds.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No knockout data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {TRANSLATIONS[lang].knockout_stage}
          </h1>
          <p className="text-gray-500">
            {TRANSLATIONS[lang].win_or_go_home}
          </p>
        </div>

        {/* Knockout rounds */}
        <div className="space-y-6 mb-10">
          {knockoutRounds.map((round, idx) => (
            <KnockoutMatch
              key={round.round}
              round={round}
              userTeamName={userTeamName}
              index={idx}
            />
          ))}
        </div>

        {/* Final result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: knockoutRounds.length * 0.3 + 0.5 }}
          className="text-center"
        >
          {isChampion ? (
            <div className="mb-6">
              <span className="text-6xl block mb-3">🏆</span>
              <h2 className="text-3xl font-black text-plum">
                {TRANSLATIONS[lang].champion_exclaim}
              </h2>
              <p className="text-gray-500 mt-2">
                {TRANSLATIONS[lang].you_conquered}
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <span className="text-5xl block mb-3">💔</span>
              <h2 className="text-2xl font-bold text-gray-700">
                {TRANSLATIONS[lang].journey_over}
              </h2>
              <p className="text-gray-500 mt-2">
                {TRANSLATIONS[lang].valiant_effort}
              </p>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleViewResults}
            className="min-w-[200px]"
          >
            {TRANSLATIONS[lang].see_results}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
