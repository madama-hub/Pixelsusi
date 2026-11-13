import { test } from "node:test";
import assert from "node:assert/strict";
import { gameReducer, initialState } from "./game.ts";
import { environments, stages } from "../data/journey.ts";
import { getStageProgress, questions } from "../data/questions.ts";

const start = () => gameReducer(initialState, { type: "START" });
function settle(state: ReturnType<typeof start>) {
  for (
    let i = 0;
    i < 5 &&
    state.phase !== "question" &&
    state.phase !== "victory" &&
    state.phase !== "gameover";
    i++
  )
    state = gameReducer(state, { type: "TICK" });
  return state;
}
test("adventure has 26 questions, Casal after Napoli, and Marina only at the end", () => {
  assert.equal(questions.length, 26);
  assert.deepEqual(stages.map((stage) => stage.city), [
    "napoli", "casal", "caserta", "salerno", "marina",
  ]);
  assert.deepEqual(
    questions.map((q) => q.stage),
    [
      ...Array(4).fill("napoli"),
      ...Array(6).fill("casal"),
      ...Array(5).fill("caserta"),
      ...Array(5).fill("salerno"),
      ...Array(6).fill("marina-finale"),
    ],
  );
  questions.forEach((q) => {
    assert.equal(q.answers.length, 3);
    assert.ok(q.answers.some((a) => a.correct));
  });
});
test("three lives, wrong answers retry, duplicate taps cannot deduct extra hearts", () => {
  let state = start();
  assert.equal(state.lives, 3);
  state = gameReducer(state, { type: "ANSWER", answer: 0 });
  for (let i = 0; i < 20; i++)
    state = gameReducer(state, { type: "ANSWER", answer: 1 });
  assert.equal(state.lives, 2);
  state = settle(state);
  assert.equal(state.question, 0);
  assert.equal(state.phase, "question");
  assert.equal(gameReducer(state, { type: "ANSWER", answer: 0 }).lives, 2);
  state = settle(gameReducer(state, { type: "ANSWER", answer: 1 }));
  state = settle(gameReducer(state, { type: "ANSWER", answer: 2 }));
  state = settle(gameReducer(state, { type: "ANSWER", answer: 0 }));
  assert.equal(state.lives, 0);
  assert.equal(state.phase, "gameover");
  assert.equal(
    gameReducer(state, { type: "ANSWER", answer: 1 }).phase,
    "gameover",
  );
  assert.deepEqual(gameReducer(state, { type: "RESTART" }), start());
});
test("complete adventure advances exactly once per correct answer and ends in victory", () => {
  let state = start();
  const correct = questions.map((q) => q.answers.findIndex((a) => a.correct));
  correct.forEach((answer, index) => {
    assert.equal(state.question, index);
    state = gameReducer(state, { type: "ANSWER", answer });
    assert.equal(state.phase, "correct");
    state = gameReducer(state, { type: "ANSWER", answer });
    state = settle(state);
  });
  assert.equal(state.phase, "victory");
  assert.equal(state.lives, 3);
  assert.deepEqual(gameReducer(state, { type: "RESTART" }), start());
});
test("all three answers to the genero question succeed with distinct messages", () => {
  const responses = [0, 1, 2].map((answer) => {
    const state = gameReducer(
      {
        ...start(),
        question: questions.findIndex((q) => q.title.includes("genero")),
      },
      { type: "ANSWER", answer },
    );
    assert.equal(state.phase, "correct");
    assert.equal(state.lives, 3);
    return state.feedback;
  });
  assert.equal(new Set(responses).size, 3);
});
test("invalid input is ignored and a city crossing waits for its transition", () => {
  const state = start();
  for (const answer of [-1, 3, NaN, 0.5])
    assert.equal(gameReducer(state, { type: "ANSWER", answer }), state);
  let crossing = gameReducer(
    { ...state, question: 3 },
    { type: "ANSWER", answer: 2 },
  );
  for (let i = 0; i < 3; i++)
    crossing = gameReducer(crossing, { type: "TICK" });
  assert.equal(crossing.phase, "traveling");
  assert.equal(crossing.question, 3);
  crossing = gameReducer(crossing, { type: "TICK" });
  assert.equal(crossing.question, 4);
  assert.equal(crossing.phase, "question");
});

test("every painted platform is reached before each scene changes, ending in Marina", () => {
  let state = start();
  const stageEnds = [3, 9, 14, 19, 25];
  let crossings = 0;
  for (let index = 0; index < 26; index++) {
    const progress = getStageProgress(index);
    const destination =
      progress.environment.platforms[progress.platformIndex + 1];
    assert.ok(destination, `Question ${index + 1} has a real landing`);
    assert.ok(
      destination.x >= 0 &&
        destination.x <= 100 &&
        destination.y > 0 &&
        destination.y <= 100,
    );
    const isLastLanding =
      progress.platformIndex + 1 === progress.environment.platforms.length - 1;
    assert.equal(isLastLanding, stageEnds.includes(index));
    state = gameReducer(state, {
      type: "ANSWER",
      answer: questions[index].answers.findIndex((answer) => answer.correct),
    });
    for (let tick = 0; tick < 3; tick++)
      state = gameReducer(state, { type: "TICK" });
    if (index === 25) {
      assert.equal(state.phase, "victory");
      assert.equal(progress.stage.id, "marina-finale");
      assert.deepEqual(destination, { x: 91.5, y: 21 });
    } else if (stageEnds.includes(index)) {
      assert.equal(state.phase, "traveling");
      assert.equal(state.question, index);
      crossings++;
      state = gameReducer(state, { type: "TICK" });
    } else {
      assert.equal(state.phase, "question");
      assert.equal(state.question, index + 1);
    }
  }
  assert.equal(crossings, 4);
});

test("each stage has exactly one question for every jump", () => {
  for (const stage of stages) {
    assert.equal(
      questions.filter((question) => question.stage === stage.id).length,
      environments[stage.city].platforms.length - 1,
    );
  }
});
