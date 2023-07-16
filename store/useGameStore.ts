import { initalGuesses } from "@/utils/constants";
import { answers } from "@/words";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type matchStatus = "correct" | "present" | "absent" | '';

export type matchingUsedKey = {
  [key: string]: matchStatus
}

export type guess = {
  id: number;
  letters: string[];
  matches: matchStatus[]
  isComplete: boolean
  isCorrect: boolean
}

interface wordleState {
  solution: string
  guesses: guess[]
  currentGuessIndex: number
  usedKeys: {
    [key: string]: matchStatus
  }
  gameStarted: boolean;
  gameEnded: boolean;
  gameWon: boolean;
  wrongGuessShake: boolean;
}

const initialState: wordleState = {
  solution: '',
  guesses: [...initalGuesses],
  currentGuessIndex: 0,
  usedKeys: {},
  gameStarted: false,
  gameEnded: false,
  gameWon: false,
  wrongGuessShake: false,
}

type storeActions = {
  setSolution: (solution: string) => void
  setGuesses: (guesses: guess[]) => void
  setCurrentGuessIndex: (currentGuessIndex: number) => void
  setUsedKeys: (usedKeys: matchingUsedKey) => void
  setGameStarted: (gameStarted: boolean) => void
  setGameEnded: (gameEnded: boolean) => void
  setGameWon: (gameWon: boolean) => void
  setWrongGuessShake: (wrongGuessShake: boolean) => void
  resetGame: () => void
}

export const useGameStore = create(
  immer<wordleState & storeActions>((set, get) => ({
    ...initialState,
    setSolution: (solution: string) => set({ solution }),
    setGuesses: (guesses: guess[]) => set({ guesses }),
    setCurrentGuessIndex: (currentGuessIndex: number) => set({ currentGuessIndex }),
    setUsedKeys: (usedKeys: matchingUsedKey) => set({ usedKeys }),
    setGameStarted: (gameStarted: boolean) => set({ gameStarted }),
    setGameEnded: (gameEnded: boolean) => set({ gameEnded }),
    setGameWon: (gameWon: boolean) => set({ gameWon }),
    setWrongGuessShake: (wrongGuessShake: boolean) => set({ wrongGuessShake }),
    resetGame: () => set({
      ...initialState,
      gameStarted: true,
      usedKeys: {},
      currentGuessIndex: 0,
      solution: answers[Math.floor(Math.random() * answers.length)]
    }),
  })))