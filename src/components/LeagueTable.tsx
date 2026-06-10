"use client";

import React from "react";
import { LeagueTeam } from "@/types";

interface LeagueTableProps {
  table: LeagueTeam[];
}

export default function LeagueTable({ table }: LeagueTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-plum text-white sticky top-0 z-10">
            <th className="py-3 px-3 text-left font-semibold w-10">#</th>
            <th className="py-3 px-3 text-left font-semibold min-w-[160px]">
              Team
            </th>
            <th className="py-3 px-2 text-center font-semibold w-8">P</th>
            <th className="py-3 px-2 text-center font-semibold w-8">W</th>
            <th className="py-3 px-2 text-center font-semibold w-8">D</th>
            <th className="py-3 px-2 text-center font-semibold w-8">L</th>
            <th className="py-3 px-2 text-center font-semibold w-8">GF</th>
            <th className="py-3 px-2 text-center font-semibold w-8">GA</th>
            <th className="py-3 px-2 text-center font-semibold w-10">GD</th>
            <th className="py-3 px-3 text-center font-bold w-10">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((team, idx) => {
            const pos = idx + 1;
            const isQualified = pos <= 16;

            return (
              <tr
                key={team.name}
                className={`
                  border-b border-gray-50 transition-colors
                  ${team.isUser ? "bg-plum/10 font-semibold" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                `}
              >
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1 h-5 rounded-full ${
                        team.isUser
                          ? "bg-plum"
                          : isQualified
                          ? "bg-sage-dark"
                          : "bg-rose"
                      }`}
                    />
                    <span className="text-xs text-gray-500">{pos}</span>
                  </div>
                </td>
                <td className={`py-2.5 px-3 ${team.isUser ? "text-plum font-bold" : "text-gray-800"}`}>
                  {team.name}
                </td>
                <td className="py-2.5 px-2 text-center text-gray-600">
                  {team.played}
                </td>
                <td className="py-2.5 px-2 text-center text-gray-600">
                  {team.won}
                </td>
                <td className="py-2.5 px-2 text-center text-gray-600">
                  {team.drawn}
                </td>
                <td className="py-2.5 px-2 text-center text-gray-600">
                  {team.lost}
                </td>
                <td className="py-2.5 px-2 text-center text-gray-600">
                  {team.goalsFor}
                </td>
                <td className="py-2.5 px-2 text-center text-gray-600">
                  {team.goalsAgainst}
                </td>
                <td className="py-2.5 px-2 text-center font-medium text-gray-700">
                  {team.goalDifference > 0
                    ? `+${team.goalDifference}`
                    : team.goalDifference}
                </td>
                <td className="py-2.5 px-3 text-center font-bold text-gray-800">
                  {team.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
