
import React from 'react';

interface WordCardProps {
  word: string;
  index: number;
  isRevealed: boolean;
  onSelect: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, index, isRevealed, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      disabled={!isRevealed}
      className="w-full h-40 group relative bg-slate-900/70 border border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-200 ease-in-out transform disabled:cursor-not-allowed disabled:opacity-60 enabled:hover:scale-105 enabled:hover:border-brand-primary enabled:hover:shadow-glow-primary"
    >
      <div className="absolute top-2 left-2 bg-slate-700 text-brand-primary font-bold w-8 h-8 text-base rounded-full flex items-center justify-center group-hover:enabled:bg-brand-primary group-hover:enabled:text-white transition-colors">
        {index + 1}
      </div>
      <h4 className="text-3xl font-black text-slate-200 group-hover:enabled:text-white transition-colors uppercase tracking-wide">
        {isRevealed ? word : '???'}
      </h4>
    </button>
  );
};