"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Player, FormationSlot } from "@/types";
import { getAvailablePositions } from "@/utils/helpers";
import FootballPitch from "@/components/FootballPitch";
import TeamCard from "@/components/TeamCard";
import SquadDisplay from "@/components/SquadDisplay";
import PositionPicker from "@/components/PositionPicker";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import { TRANSLATIONS } from "@/lib/constants";

export default function DraftPage() {
  const router = useRouter();
  const {
    draftRound,
    currentDraftTeam,
    slots,
    assignPlayerToSlot,
    drawNextTeam,
  } = useGame();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPositionPicker, setShowPositionPicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<FormationSlot[]>([]);

  // Draw first team if needed
  useEffect(() => {
    if (!currentDraftTeam && draftRound < 11) {
      drawNextTeam();
    }
  }, [currentDraftTeam, draftRound, drawNextTeam]);

  // Navigate when all 11 drafted
  useEffect(() => {
    if (draftRound >= 11) {
      const timer = setTimeout(() => {
        router.push("/tournament");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [draftRound, router]);

  const handlePlayerSelect = (player: Player) => {
    const availIds = getAvailablePositions(slots, player.positions);
    const avail = slots.filter((s) => availIds.includes(s.id));

    if (avail.length === 0) return;

    if (avail.length === 1) {
      // Auto-assign if only one option
      assignPlayerToSlot(player, avail[0].id);
      setSelectedPlayer(null);
      setShowPositionPicker(false);
      return;
    }

    setSelectedPlayer(player);
    setAvailableSlots(avail);
    setShowPositionPicker(true);
  };

  const handlePositionConfirm = (slotId: number) => {
    if (selectedPlayer) {
      assignPlayerToSlot(selectedPlayer, slotId);
      setSelectedPlayer(null);
      setShowPositionPicker(false);
      setAvailableSlots([]);
    }
  };

  const handleCancel = () => {
    setSelectedPlayer(null);
    setShowPositionPicker(false);
    setAvailableSlots([]);
  };

  const highlightedSlotIds = availableSlots.map((s) => s.id);

  const { lang } = useLanguage();

  if (draftRound >= 11) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <span className="text-5xl mb-4 block">✅</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {TRANSLATIONS[lang].squad_complete}
          </h2>
          <p className="text-gray-500">
            {TRANSLATIONS[lang].starting_tournament}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {TRANSLATIONS[useLanguage().lang].build_your_squad}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{TRANSLATIONS[useLanguage().lang].round_label}</span>
            <span className="text-xl font-black text-plum">
              {draftRound + 1}
            </span>
            <span className="text-sm text-gray-400">/11</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-plum rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(draftRound / 11) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Team card */}
        <div>
          <AnimatePresence mode="wait">
            {currentDraftTeam && (
              <TeamCard
                key={currentDraftTeam.key + "-" + draftRound}
                team={currentDraftTeam}
                slots={slots}
                onPlayerSelect={handlePlayerSelect}
                selectedPlayer={selectedPlayer}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right: Pitch + Squad */}
        <div className="space-y-6">
          <Card>
            <FootballPitch
              slots={slots}
              highlightedSlots={highlightedSlotIds}
            />
          </Card>

          <Card>
            <SquadDisplay slots={slots} />
          </Card>
        </div>
      </div>

      {/* Position Picker Modal */}
      {showPositionPicker && selectedPlayer && (
        <PositionPicker
          player={selectedPlayer}
          availableSlots={availableSlots}
          onConfirm={handlePositionConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
