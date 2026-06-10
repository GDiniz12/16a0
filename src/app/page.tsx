"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { TRANSLATIONS } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const { lang } = useLanguage();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sage/30 blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-sand/40 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-rose/20 blur-3xl" />
        <div className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-plum/10 blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Football icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <span className="text-5xl">⚽</span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="text-8xl md:text-9xl font-black text-plum tracking-tighter leading-none mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          16-0
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl font-light text-plum/70 mb-2 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {TRANSLATIONS[lang].football_sim}
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="text-base text-gray-500 mb-10 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {TRANSLATIONS[lang].tagline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/formation")}
            className="min-w-[180px] text-lg"
          >
            {TRANSLATIONS[lang].start}
          </Button>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          className="flex items-center justify-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {["bg-sage", "bg-sand", "bg-rose", "bg-plum"].map(
            (color, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${color} opacity-60`}
              />
            )
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
