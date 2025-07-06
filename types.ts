
export interface Team {
  id: number;
  name: string;
  score: number;
}

export enum GameState {
  Landing,
  Setup,
  WordSelection,
  CluePhase,
  Scoring,
}

export type Theme = 'vibrant' | 'neutral';