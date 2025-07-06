
import React, { useState, useRef, useEffect } from 'react';
import { Team, GameState, Theme } from './types';
import { wordBanks } from './data/wordBanks';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { LogoIcon, PaletteIcon } from './components/icons';
import { LandingPage } from './components/LandingPage';

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Landing);
  const [teams, setTeams] = useState<Team[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('vibrant');
  const availableBankIndices = useRef<number[]>([]);
  const availableCustomWords = useRef<string[]>([]);

  useEffect(() => {
    const vibrantClasses = 'font-sans bg-slate-900 text-slate-100 bg-[length:200%_200%] bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 animate-bg-pan';
    const neutralClasses = 'font-sans bg-slate-900 text-slate-100 bg-[length:200%_200%] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 animate-bg-pan';
    
    document.body.className = `${theme === 'vibrant' ? vibrantClasses : neutralClasses} theme-${theme}`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'vibrant' ? 'neutral' : 'vibrant'));
  };

  const loadNextRound = () => {
    let newWords: string[];

    if (customWords.length > 0) {
      // Use custom words
      if (availableCustomWords.current.length === 0) {
        availableCustomWords.current = shuffleArray(customWords);
      }
      // Take up to 5 words for the round. If fewer than 5 are left, it will take all remaining words.
      newWords = availableCustomWords.current.splice(0, 5);
    } else {
      // Use built-in word banks
      if (availableBankIndices.current.length === 0) {
        const allIndices = Array.from({ length: wordBanks.length }, (_, i) => i);
        availableBankIndices.current = shuffleArray(allIndices);
      }
      const nextBankIndex = availableBankIndices.current.pop()!;
      newWords = wordBanks[nextBankIndex];
    }

    setSelectedWord(null);
    setWords(newWords);
    setGameState(GameState.WordSelection);
  };
  
  const handleStartGame = (teamNames: string[], newCustomWords?: string[]) => {
    setTeams(teamNames.map((name, index) => ({ id: index, name, score: 0 })));
    
    if (newCustomWords && newCustomWords.length > 0) {
      setCustomWords(newCustomWords);
      // Set the initial pool of available words
      availableCustomWords.current = shuffleArray(newCustomWords);
    } else {
      // Ensure we clear out old custom words if not provided
      setCustomWords([]);
      availableCustomWords.current = [];
    }

    // This is called after state is queued for update. React 18 batches this,
    // and `loadNextRound` will see the new `customWords` state.
    loadNextRound();
  };

  const handleWordSelected = (word: string) => {
    setSelectedWord(word);
    setGameState(GameState.CluePhase);
  };

  const handleProceedToScoring = () => {
    setGameState(GameState.Scoring);
  };

  const handleScoreUpdate = (teamId: number, wasCorrect: boolean) => {
    if (wasCorrect) {
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === teamId ? { ...team, score: team.score + 1 } : team
        )
      );
    }
  };
  
  const handleRestart = () => {
    setGameState(GameState.Landing);
    setTeams([]);
    setWords([]);
    setSelectedWord(null);
    setCustomWords([]);
    availableCustomWords.current = [];
    availableBankIndices.current = [];
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center p-4">
       <header className="w-full max-w-7xl mx-auto mb-4 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-brand-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">Just One</h1>
        </div>
        <div className="flex items-center gap-2">
           <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-brand-primary rounded-full hover:bg-slate-700/50 transition-colors"
            aria-label="Toggle Theme"
            >
                <PaletteIcon className="w-6 h-6" />
            </button>
            {gameState !== GameState.Setup && gameState !== GameState.Landing && (
                <button
                    onClick={handleRestart}
                    className="px-4 py-2 text-sm font-semibold text-white bg-slate-700/50 rounded-lg shadow-strong hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-colors"
                >
                    Restart
                </button>
            )}
        </div>
      </header>
      <main className={`w-full max-w-7xl mx-auto flex-grow flex items-center ${
        gameState === GameState.Landing || gameState === GameState.Setup
          ? 'justify-center'
          : ''
      }`}>
        {gameState === GameState.Landing ? (
            <LandingPage onStart={() => setGameState(GameState.Setup)} />
        ) : gameState === GameState.Setup ? (
          <SetupScreen onStartGame={handleStartGame} theme={theme} />
        ) : (
          <GameScreen
            gameState={gameState}
            teams={teams}
            words={words}
            selectedWord={selectedWord}
            theme={theme}
            onWordSelect={handleWordSelected}
            onProceedToScoring={handleProceedToScoring}
            onScoreUpdate={handleScoreUpdate}
            onNextRound={loadNextRound}
          />
        )}
      </main>
    </div>
  );
};
