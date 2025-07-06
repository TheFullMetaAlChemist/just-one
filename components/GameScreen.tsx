
import React, { useState, useEffect } from 'react';
import { GameState, Team, Theme } from '../types';
import { Leaderboard } from './Leaderboard';
import { WordCard } from './WordCard';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface GameScreenProps {
  gameState: GameState;
  teams: Team[];
  words: string[];
  selectedWord: string | null;
  theme: Theme;
  onWordSelect: (word: string) => void;
  onProceedToScoring: () => void;
  onScoreUpdate: (teamId: number, correct: boolean) => void;
  onNextRound: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  teams,
  words,
  selectedWord,
  theme,
  onWordSelect,
  onProceedToScoring,
  onScoreUpdate,
  onNextRound,
}) => {
  const [scoredStatus, setScoredStatus] = useState<{ [key: number]: 'correct' | 'incorrect' }>({});
  const [wordsAreVisible, setWordsAreVisible] = useState(false);

  // Reset scoring and visibility status when a new round starts
  useEffect(() => {
    if (gameState === GameState.WordSelection) {
      setScoredStatus({});
      setWordsAreVisible(false);
    }
  }, [gameState]);
  
  const handleTeamScored = (teamId: number, wasCorrect: boolean) => {
    // Prevent scoring the same team twice in a round
    if (scoredStatus[teamId]) return;

    onScoreUpdate(teamId, wasCorrect);
    setScoredStatus(prev => ({ ...prev, [teamId]: wasCorrect ? 'correct' : 'incorrect' }));
  };
  
  const MainButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className="px-6 py-2.5 text-lg font-bold text-white bg-brand-primary rounded-lg shadow-strong hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-slate-800 focus:ring-brand-primary transform hover:scale-105 transition-all"
    >
      {children}
    </button>
  );

  const renderContent = () => {
    switch (gameState) {
      case GameState.WordSelection:
        return (
          <div className="animate-fade-in-up w-full text-center flex flex-col h-full">
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-slate-100 mb-1">A New Round Begins!</h3>
              <p className="text-base text-slate-400 mb-4 max-w-3xl mx-auto">
                {wordsAreVisible
                  ? "Words are revealed! The host should now select the word corresponding to the guesser's chosen number."
                  : "Each team's guesser should face away from the screen and choose a number from 1 to 5. Once chosen, click below."
                }
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {words.map((word, index) => {
                  if (index === 4) {
                    return (
                      <div key={index} className="sm:col-span-2 flex justify-center">
                        <div className="w-full sm:w-[calc(50%-0.375rem)]">
                          <WordCard
                            word={word}
                            index={index}
                            isRevealed={wordsAreVisible}
                            onSelect={() => onWordSelect(word)}
                          />
                        </div>
                      </div>
                    );
                  }
                  return (
                    <WordCard
                      key={index}
                      word={word}
                      index={index}
                      isRevealed={wordsAreVisible}
                      onSelect={() => onWordSelect(word)}
                    />
                  );
                })}
              </div>
            </div>
             {!wordsAreVisible && (
                <div className="mt-auto">
                  <MainButton onClick={() => setWordsAreVisible(true)}>
                    Reveal Words
                  </MainButton>
                </div>
            )}
          </div>
        );
      case GameState.CluePhase:
        return (
          <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full">
            <h3 className="text-3xl font-bold text-slate-100">Word Selected!</h3>
            <div className="my-3 p-2 bg-slate-900/50 rounded-lg">
                <p className="text-base text-slate-300">The mystery word is now hidden.</p>
            </div>
            <p className="text-lg text-slate-300 max-w-3xl mb-6">
              All players (except guessers), write your one-word clue. Then, compare clues and eliminate any duplicates.
            </p>
            <MainButton onClick={onProceedToScoring}>
              Reveal Word & Score
            </MainButton>
          </div>
        );
      case GameState.Scoring:
        return (
          <div className="text-center animate-fade-in flex flex-col items-center w-full">
            <p className="text-base text-slate-400">The mystery word was:</p>
            <div className="my-1">
              <h2 className="text-5xl sm:text-6xl font-black text-gradient-themed tracking-wide uppercase py-2">{selectedWord}</h2>
            </div>
            <p className="text-lg font-semibold text-slate-200 mb-3">Record each team's result:</p>
            <div className="space-y-2 w-full max-w-sm mb-4">
                {teams.map(team => (
                    <div key={team.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-lg border border-slate-600/50">
                        <span className="font-bold text-base text-slate-200">{team.name}</span>
                        <div className="flex items-center gap-2">
                          {scoredStatus[team.id] === 'correct' && <CheckCircleIcon className="w-6 h-6 text-green-400 animate-fade-in" />}
                          {scoredStatus[team.id] === 'incorrect' && <XCircleIcon className="w-6 h-6 text-red-400 animate-fade-in" />}
                          {!scoredStatus[team.id] && (
                            <>
                              <button onClick={() => handleTeamScored(team.id, true)} className="px-3 py-1 text-sm font-bold text-white bg-green-500/80 rounded-md hover:bg-green-500 transition-all transform hover:scale-105">Correct</button>
                              <button onClick={() => handleTeamScored(team.id, false)} className="px-3 py-1 text-sm font-bold text-white bg-red-500/80 rounded-md hover:bg-red-500 transition-all transform hover:scale-105">Incorrect</button>
                            </>
                          )}
                        </div>
                    </div>
                ))}
            </div>
            <MainButton onClick={onNextRound}>
              Start Next Round
            </MainButton>
          </div>
        );
      default:
        return null;
    }
  };
  
  const panelClasses = theme === 'vibrant'
    ? 'bg-slate-800/50 backdrop-blur-xl border-slate-700/50'
    : 'bg-slate-800 border-slate-700';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
      <div className="lg:col-span-1 animate-fade-in-up">
        <Leaderboard teams={teams} theme={theme} />
      </div>
      <div className={`lg:col-span-3 border rounded-2xl shadow-strong p-4 flex items-center justify-center min-h-[480px] ${panelClasses}`}>
        {renderContent()}
      </div>
    </div>
  );
};
