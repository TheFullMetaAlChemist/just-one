
import React from 'react';
import { Team, Theme } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardProps {
  teams: Team[];
  theme: Theme;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ teams, theme }) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const panelClasses = theme === 'vibrant'
    ? 'bg-slate-800/50 backdrop-blur-xl border-slate-700/50'
    : 'bg-slate-800 border-slate-700';
    
  const listItemDefaultClasses = theme === 'vibrant'
    ? 'bg-slate-700/50 border-transparent'
    : 'bg-slate-700 border-transparent';

  return (
    <div className={`border rounded-2xl shadow-strong p-4 h-full ${panelClasses}`}>
      <h3 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
        <TrophyIcon className="w-6 h-6 text-amber-400" />
        Leaderboard
      </h3>
      <ul className="space-y-2">
        {sortedTeams.map((team, index) => {
           const isTop = index === 0 && team.score > 0;
           const topItemClasses = theme === 'vibrant'
             ? 'bg-amber-400/20 border-amber-400/50 shadow-glow-amber'
             : 'bg-slate-700 border-amber-400/80';
          return (
            <li
              key={team.id}
              className={`flex justify-between items-center p-2 rounded-lg transition-all duration-300 border ${isTop ? topItemClasses : listItemDefaultClasses}`}
            >
              <div className="flex items-center">
                 <span className={`font-bold text-base ${isTop ? 'text-amber-300' : 'text-slate-200'}`}>
                   {index + 1}. {team.name}
                 </span>
              </div>
              <span className={`text-xl font-bold ${isTop ? 'text-amber-300' : 'text-slate-300'}`}>
                {team.score}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
