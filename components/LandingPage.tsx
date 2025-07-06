
import React from 'react';
import { UserGroupIcon, WandSparklesIcon, CheckBadgeIcon } from './icons';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="animate-fade-in-up text-center px-4 py-8 sm:py-16">
      {/* Hero Section */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4">
        <span className="text-gradient-themed">Just One</span>: The Digital Classroom Edition
      </h1>
      <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-8">
        The hit party game of cooperative word-guessing is now on your screen. Perfect for classrooms, friends, and family gatherings. One secret word, one-word clues, and just one guess!
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 text-lg font-bold text-white bg-brand-primary rounded-lg shadow-strong hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-slate-900 focus:ring-brand-primary transform hover:scale-105 transition-all"
      >
        Let's Play!
      </button>

      {/* How to Play Section */}
      <div className="mt-20 sm:mt-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-brand-primary/20 text-brand-primary p-2 rounded-lg">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">1. Form Teams</h3>
            </div>
            <p className="text-slate-400 flex-grow">
              Gather your friends and divide into at least two teams. Give them fun names and get ready to compete.
            </p>
          </div>
          {/* Step 2 */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-brand-primary/20 text-brand-primary p-2 rounded-lg">
                <WandSparklesIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">2. Give Clues</h3>
            </div>
            <p className="text-slate-400 flex-grow">
              A secret word is chosen. Teammates write a single-word clue. But be creative! Identical clues are removed from play.
            </p>
          </div>
          {/* Step 3 */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-brand-primary/20 text-brand-primary p-2 rounded-lg">
                <CheckBadgeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">3. Guess & Score</h3>
            </div>
            <p className="text-slate-400 flex-grow">
              The guesser sees only the unique clues and has one chance to guess the secret word. A correct guess earns a point!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
