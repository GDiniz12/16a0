"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { checkQualification } from "@/utils/tournament";
import LeagueTable from "@/components/LeagueTable";
import MatchResultCard from "@/components/MatchResultCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import { TRANSLATIONS } from "@/lib/constants";

export default function TournamentPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const {
    leagueTable,
    userMatches,
    startLeaguePhase,
    startKnockoutPhase,
    userTeamName,
    setPhase,
  } = useGame();

  // Start league on mount if not already done
  useEffect(() => {
    if (leagueTable.length === 0) {
      startLeaguePhase();
    }
  }, [leagueTable.length, startLeaguePhase]);

  if (leagueTable.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-plum border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Simulating league phase...</p>
        </motion.div>
      </div>
    );
  }

  const { qualified, position } = checkQualification(
    leagueTable,
    userTeamName
  );

  const handleContinue = () => {
    if (qualified) {
      startKnockoutPhase();
      router.push("/knockout");
    } else {
      setPhase("result");
      router.push("/result");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {TRANSLATIONS[useLanguage().lang].league_title}
          </h1>
          <p className="text-lg text-plum font-medium">{TRANSLATIONS[useLanguage().lang].league_phase}</p>
        </div>

        {/* User matches */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {TRANSLATIONS[useLanguage().lang].your_matches}
          </h2>
          <div className="space-y-2">
            {userMatches.map((match, idx) => (
              <MatchResultCard
                key={idx}
                match={match}
                userTeamName={userTeamName}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* Full standings */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {TRANSLATIONS[useLanguage().lang].standings}
          </h2>
          <LeagueTable table={leagueTable} />
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-4 rounded-full bg-sage-dark" />
              <span>{TRANSLATIONS[useLanguage().lang].qualified_label}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-4 rounded-full bg-rose" />
              <span>{TRANSLATIONS[useLanguage().lang].eliminated_label}</span>
            </div>
          </div>
        </div>

        {/* Qualification result */}
        <Card className="text-center mb-8">
          <div className="py-4">
            {qualified ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mt-3">
                  {TRANSLATIONS[lang].qualified_title}
                </h3>
                <p className="text-gray-500 mt-1">
                  {TRANSLATIONS[lang].you_finished}{" "}
                  <span className="font-bold text-plum">
                    {position}º
                  </span>{" "}
                  {TRANSLATIONS[lang].advance_to_knockout}
                </p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <span className="text-4xl">😞</span>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mt-3">
                  {TRANSLATIONS[lang].eliminated_label}
                </h3>
                <p className="text-gray-500 mt-1">
                  {TRANSLATIONS[lang].you_finished}{" "}
                  <span className="font-bold text-rose">
                    {position}º
                  </span>{" "}
                  {TRANSLATIONS[lang].did_not_qualify}
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Action button */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            className="min-w-[240px]"
          >
            {qualified ? TRANSLATIONS[lang].continue_to_knockout : TRANSLATIONS[lang].view_results}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
