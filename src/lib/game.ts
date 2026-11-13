import { questions } from "../data/questions.ts";

export const MAX_LIVES = 3;
export type Phase =
  | "intro"
  | "question"
  | "correct"
  | "wrong"
  | "walking"
  | "jumping"
  | "traveling"
  | "gameover"
  | "victory";
export type GameState = {
  phase: Phase;
  question: number;
  lives: number;
  selected: number | null;
  feedback: string;
  mistakes: number[];
};
export type GameAction =
  { type: "START" | "RESTART" | "TICK" } | { type: "ANSWER"; answer: number };
export const initialState: GameState = {
  phase: "intro",
  question: 0,
  lives: MAX_LIVES,
  selected: null,
  feedback: "",
  mistakes: [],
};
export const durations: Partial<Record<Phase, number>> = {
  correct: 1600,
  wrong: 1500,
  walking: 280,
  jumping: 900,
  traveling: 850,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "START" || action.type === "RESTART")
    return { ...initialState, phase: "question", mistakes: [] };
  if (action.type === "ANSWER") {
    if (
      state.phase !== "question" ||
      !Number.isInteger(action.answer) ||
      state.mistakes.includes(action.answer)
    )
      return state;
    const answer = questions[state.question]?.answers[action.answer];
    if (!answer) return state;
    return {
      ...state,
      selected: action.answer,
      phase: answer.correct ? "correct" : "wrong",
      lives: answer.correct ? state.lives : Math.max(0, state.lives - 1),
      feedback: answer.correct
        ? (answer.response ?? "Bravissima! La prossima piattaforma ti aspetta.")
        : state.lives > 1
          ? "Uè, riproviamo! Anche le avventuriere si distraggono."
          : "Finito il carburante… serve una sfogliatella!",
      mistakes: answer.correct
        ? state.mistakes
        : [...state.mistakes, action.answer],
    };
  }
  if (action.type !== "TICK") return state;
  switch (state.phase) {
    case "correct":
      return { ...state, phase: "walking" };
    case "walking":
      return { ...state, phase: "jumping" };
    case "wrong":
      return {
        ...state,
        phase: state.lives === 0 ? "gameover" : "question",
        selected: null,
      };
    case "jumping":
      if (state.question === questions.length - 1)
        return { ...state, phase: "victory" };
      if (
        questions[state.question].stage !== questions[state.question + 1].stage
      )
        return { ...state, phase: "traveling" };
      return {
        ...state,
        phase: "question",
        question: state.question + 1,
        selected: null,
        feedback: "",
        mistakes: [],
      };
    case "traveling":
      return {
        ...state,
        phase: "question",
        question: state.question + 1,
        selected: null,
        feedback: "",
        mistakes: [],
      };
    default:
      return state;
  }
}
