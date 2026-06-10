"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import { TRANSLATIONS } from "@/lib/constants";

export default function ResultPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { isChampion, stats, resetGame } = useGame();

  const handlePlayAgain = () => {
    resetGame();
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background decorations */}
      {isChampion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Confetti-like dots */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: [
                  "#ccded2",
                  "#fffbd4",
                  "#f5ddbb",
                  "#e3b8b2",
                  "#a18093",
                  "#f59e0b",
                  "#fbbf24",
                ][i % 7],
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -80],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl" />
        </div>
      )}

      {!isChampion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sand/30 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-rose/20 blur-3xl" />
        </div>
      )}

      <motion.div
        className="relative z-10 text-center max-w-lg w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="mb-6"
        >
          <span className={`text-7xl ${isChampion ? "" : "opacity-80"}`}>
            {isChampion ? "🏆" : "⚽"}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className={`text-5xl md:text-6xl font-black mb-3 ${
            isChampion
              ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700"
              : "text-gray-600"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isChampion ? TRANSLATIONS[lang].champion_label : TRANSLATIONS[lang].eliminated_label}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-500 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isChampion
            ? TRANSLATIONS[lang].result_champion_text
            : TRANSLATIONS[lang].result_eliminated_text}
        </motion.p>

        {/* Stats card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="mb-8">
            {/* Record */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2 tracking-wider">
                {TRANSLATIONS[lang].record_label}
              </p>
              <p className="text-4xl font-black text-gray-800">
                <span className="text-sage-dark">{stats.wins}</span>
                <span className="text-gray-300 mx-1">-</span>
                <span className="text-sand">{stats.draws}</span>
                <span className="text-gray-300 mx-1">-</span>
                <span className="text-rose">{stats.losses}</span>
              </p>
            </div>

            <div className="h-px bg-gray-100 my-4" />

            {/* Goals */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                  {TRANSLATIONS[lang].goals_scored}
                </p>
                <p className="text-3xl font-black text-plum">
                  {stats.goalsScored}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                  {TRANSLATIONS[lang].goals_conceded}
                </p>
                <p className="text-3xl font-black text-gray-600">
                  {stats.goalsConceded}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Play Again */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handlePlayAgain}
            className="min-w-[200px]"
          >
            {TRANSLATIONS[lang].play_again}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
