"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { useLanguage } from "@/context/LanguageContext";
import { TournamentMode } from "@/types";

const modes: {
  id: TournamentMode;
  name: string;
  subtitle: string;
  description: { pt: string; en: string };
  accent: string;
  shadow: string;
  badge: { pt: string; en: string };
}[] = [
  {
    id: "super-mundial",
    name: "SUPER MUNDIAL",
    subtitle: "DE CLUBES",
    description: {
      pt: "36 times históricos. Fase de liga + mata-mata. O clássico definitivo.",
      en: "36 legendary clubs. League phase + knockout. The definitive classic.",
    },
    accent: "bg-[#0033A0] text-white border-white",
    shadow: "shadow-[8px_8px_0_0_#001a6e]",
    badge: { pt: "Clássico", en: "Classic" },
  },
  {
    id: "copa-do-mundo",
    name: "COPA DO",
    subtitle: "MUNDO",
    description: {
      pt: "32 seleções. Sorteio de grupos. Top 2 de cada grupo avançam ao mata-mata.",
      en: "32 national teams. Group draw. Top 2 per group advance to knockout.",
    },
    accent: "bg-amber-500 text-[#00183F] border-[#00183F]",
    shadow: "shadow-[8px_8px_0_0_#92400e]",
    badge: { pt: "Seleções", en: "Nations" },
  },
  {
    id: "brasileirao",
    name: "BRASILEIRÃO",
    subtitle: "",
    description: {
      pt: "20 clubes brasileiros. 38 rodadas, turno e returno. Pontos corridos.",
      en: "20 Brazilian clubs. 38 rounds, home and away. Points-based table.",
    },
    accent: "bg-green-700 text-white border-yellow-400",
    shadow: "shadow-[8px_8px_0_0_#14532d]",
    badge: { pt: "Liga", en: "League" },
  },
  {
    id: "louco",
    name: "LOUCO",
    subtitle: "",
    description: {
      pt: "Todos os times + seleções. 32 sorteados. Caos total.",
      en: "All clubs + national teams. 32 drawn randomly. Total chaos.",
    },
    accent: "bg-purple-700 text-white border-purple-300",
    shadow: "shadow-[8px_8px_0_0_#4a044e]",
    badge: { pt: "Caos", en: "Chaos" },
  },
];

export default function ModeSelectPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { setTournamentMode } = useGame();
  const isPt = lang === "pt";

  const handleSelect = (mode: TournamentMode) => {
    setTournamentMode(mode);
    router.push("/formation");
  };

  return (
    <div className="min-h-screen bg-[#00183F] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 md:top-6 md:left-6 bg-white text-[#00183F] px-4 py-2 font-black uppercase text-sm border-4 border-transparent hover:border-amber-400 hover:-translate-y-1 transition-all z-40"
      >
        ← {isPt ? "Voltar" : "Back"}
      </button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <div className="inline-block bg-[#D9D9D9] border-4 border-white px-6 py-4 shadow-[8px_8px_0_0_#0033A0]">
          <h1 className="text-3xl md:text-5xl font-black text-[#00183F] uppercase tracking-tight">
            {isPt ? "Escolha o Modo" : "Choose Mode"}
          </h1>
          <p className="text-[#0033A0] font-black uppercase tracking-widest text-xs mt-2">
            {isPt ? "Selecione o torneio que deseja jogar" : "Select the tournament you want to play"}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {modes.map((mode, i) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            whileHover={{ translateY: -4, translateX: -4 }}
            whileTap={{ translateY: 2, translateX: 2 }}
            onClick={() => handleSelect(mode.id)}
            className={`
              flex flex-col items-start text-left p-6 border-4
              transition-all duration-75 cursor-pointer
              ${mode.accent} ${mode.shadow}
            `}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 border border-current px-2 py-0.5 mb-3">
              {isPt ? mode.badge.pt : mode.badge.en}
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase leading-none tracking-tight">
              {mode.name}
            </h2>
            {mode.subtitle && (
              <h2 className="text-3xl md:text-4xl font-black uppercase leading-none tracking-tight">
                {mode.subtitle}
              </h2>
            )}
            <p className="mt-4 text-sm font-bold opacity-80 leading-snug border-t border-current/30 pt-3 w-full">
              {isPt ? mode.description.pt : mode.description.en}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
