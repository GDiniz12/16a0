"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as any)}
        className="rounded-md px-2 py-1 bg-white border"
        aria-label="Language selector"
      >
        <option value="en">English</option>
        <option value="pt">Português</option>
      </select>
    </div>
  );
}
