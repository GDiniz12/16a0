"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { FormationType } from "@/types";
import FootballPitch from "@/components/FootballPitch";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { TRANSLATIONS } from "@/lib/constants";

const formations: FormationType[] = ["4-3-3", "4-4-2", "3-4-3"];

export default function FormationPage() {
  const router = useRouter();
  const { formation, setFormation, slots, drawNextTeam, setPhase } =
    useGame();

  const handleBegin = () => {
    if (!formation) return;
    setPhase("draft");
    drawNextTeam();
    router.push("/draft");
  };

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {TRANSLATIONS[useLanguage().lang].choose_formation_title}
          </h1>
          <p className="text-gray-500">
            {TRANSLATIONS[useLanguage().lang].choose_formation_sub}
          </p>
        </div>

        {/* Formation selector */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {formations.map((f) => (
            <button
              key={f}
              onClick={() => setFormation(f)}
              className={`
                px-6 py-3 rounded-full font-bold text-lg
                transition-all duration-300 border-2
                ${
                  formation === f
                    ? "bg-plum text-white border-plum shadow-lg scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-plum-light hover:text-plum"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Pitch */}
        <div className="flex justify-center mb-10">
          {formation ? (
            <FootballPitch slots={slots} />
          ) : (
            <div className="w-full max-w-[420px] rounded-2xl bg-sage/20 flex items-center justify-center" style={{ paddingBottom: "147%" }}>
              <span className="absolute text-gray-400 text-lg">
                {TRANSLATIONS[useLanguage().lang].select_formation_above}
              </span>
            </div>
          )}
        </div>

        {/* Begin button */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleBegin}
            disabled={!formation}
            className="min-w-[200px]"
          >
            {TRANSLATIONS[useLanguage().lang].begin_draft}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
