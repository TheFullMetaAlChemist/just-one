
import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from './icons';
import { Theme } from '../types';

interface SetupScreenProps {
  onStartGame: (teamNames: string[], customWords?: string[]) => void;
  theme: Theme;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, theme }) => {
  const [teamNames, setTeamNames] = useState<string[]>(['Team 1', 'Team 2']);
  const [wordSource, setWordSource] = useState<'builtin' | 'custom'>('builtin');
  const [customWordsInput, setCustomWordsInput] = useState('');
  const [parsedCustomWords, setParsedCustomWords] = useState<string[]>([]);

  // Parse custom words from the textarea input in real-time
  useEffect(() => {
    const words = customWordsInput
      .split(/[\n,]+/) // Split by newlines or commas
      .map(word => word.trim())
      .filter(word => word.length > 0);
    setParsedCustomWords(words);
  }, [customWordsInput]);

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const addTeam = () => {
    setTeamNames([...teamNames, `Team ${teamNames.length + 1}`]);
  };

  const removeTeam = (index: number) => {
    if (teamNames.length > 2) {
      setTeamNames(teamNames.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStartButtonDisabled) return;

    const validTeams = teamNames.filter(name => name.trim() !== '');
    if (wordSource === 'custom') {
      onStartGame(validTeams, parsedCustomWords);
    } else {
      onStartGame(validTeams);
    }
  };

  const isStartButtonDisabled = teamNames.filter(name => name.trim() !== '').length < 2 ||
    (wordSource === 'custom' && parsedCustomWords.length < 5);

  const panelClasses = theme === 'vibrant'
    ? 'bg-slate-800/50 backdrop-blur-xl border-slate-700/50'
    : 'bg-slate-800 border-slate-700';

  const WordSourceButton: React.FC<{
    label: string;
    value: 'builtin' | 'custom';
  }> = ({ label, value }) => {
    const isActive = wordSource === value;
    return (
      <button
        type="button"
        onClick={() => setWordSource(value)}
        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
          isActive
            ? 'bg-brand-primary text-white'
            : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className={`border rounded-2xl shadow-strong p-6 sm:p-8 max-w-xl mx-auto animate-fade-in-up ${panelClasses}`}>
      <h2 className="text-2xl font-bold text-center text-slate-100 mb-6">Game Setup</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Word Source Section */}
        <div className="space-y-3">
            <label className="block text-base font-semibold text-slate-200">Word Source</label>
            <div className="flex space-x-2 bg-slate-900/70 p-1 rounded-lg">
                <WordSourceButton label="Built-in Words" value="builtin" />
                <WordSourceButton label="Custom List" value="custom" />
            </div>
            {wordSource === 'custom' && (
                <div className="space-y-2 animate-fade-in">
                    <textarea
                        value={customWordsInput}
                        onChange={(e) => setCustomWordsInput(e.target.value)}
                        placeholder="Paste your words here, separated by commas or new lines."
                        className="w-full h-32 block px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-slate-700/80 transition-all"
                    />
                    <p className={`text-xs ${parsedCustomWords.length < 5 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {parsedCustomWords.length} words detected. At least 5 are needed to start.
                    </p>
                </div>
            )}
        </div>

        {/* Teams Section */}
        <div className="space-y-4">
            <label className="block text-base font-semibold text-slate-200">Teams</label>
            {teamNames.map((name, index) => (
            <div key={index} className="flex items-center gap-3">
                <input
                type="text"
                value={name}
                onChange={(e) => handleTeamNameChange(index, e.target.value)}
                className="flex-grow block w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-slate-700/80 transition-all"
                placeholder={`Team ${index + 1} Name`}
                />
                {teamNames.length > 2 && (
                <button
                    type="button"
                    onClick={() => removeTeam(index)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                    aria-label="Remove Team"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                )}
            </div>
            ))}

            <button
            type="button"
            onClick={addTeam}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-brand-primary border-2 border-dashed border-slate-600 rounded-lg hover:bg-brand-primary/10 hover:border-brand-primary transition-all"
            >
            <PlusIcon className="w-5 h-5" />
            Add Another Team
            </button>
        </div>

        <button
          type="submit"
          disabled={isStartButtonDisabled}
          className="w-full mt-2 px-6 py-2.5 text-base font-bold text-white bg-brand-primary rounded-lg shadow-strong hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-slate-800 focus:ring-brand-primary disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none transition-all transform hover:scale-105"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};
