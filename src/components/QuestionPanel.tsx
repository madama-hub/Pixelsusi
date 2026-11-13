import { useEffect, useRef } from "react";
import { birthday } from "../data/config";
import { stages } from "../data/journey";
import { getStageProgress, questions } from "../data/questions";
import type { GameState } from "../lib/game";
import { PixelIcon } from "./PixelIcon";

export function QuestionPanel({
  game,
  onAnswer,
  onStart,
  onFireworks,
}: {
  game: GameState;
  onAnswer: (index: number) => void;
  onStart: () => void;
  onFireworks: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const question = questions[game.question];
  const { stageIndex, platformIndex, jumpCount } = getStageProgress(
    game.question,
  );
  useEffect(() => {
    if (
      game.phase === "question" ||
      game.phase === "victory" ||
      game.phase === "gameover"
    )
      heading.current?.focus({ preventScroll: true });
  }, [game.question, game.phase === "victory", game.phase === "gameover"]);
  if (game.phase === "intro")
    return (
      <aside className="quest-panel intro-panel">
        <div className="panel-topline">
          <span>UNA MISSIONE SPECIALE</span>
          <PixelIcon name="spark" />
        </div>
        <div className="intro-spark">
          <PixelIcon name="spark" />
        </div>
        <span className="eyebrow">QUESTA STORIA È PER TE</span>
        <h2>
          Buon Compleanno,
          <br />
          <span>Susanna!</span>{" "}
          <span className="text-heart" aria-label="con amore">
            ♥
          </span>
        </h2>
        <p>
          {stages.length} tappe, {questions.length} domande e un mare di
          sorprese.
        </p>
        <p className="intro-invitation">
          Pronta per un’avventura
          <br />
          che non smette di sorprenderti?
        </p>
        <button className="primary-button" onClick={onStart}>
          Inizia la magia <PixelIcon name="arrow" />
        </button>
        <div className="intro-rules">
          <span>
            <PixelIcon name="heart" /> 3 VITE
          </span>
          <i>·</i>
          <span>{questions.length} DOMANDE</span>
          <i>·</i>
          <span>{stages.length} TAPPE</span>
        </div>
        <p className="control-tip">
          Scegli la risposta. Al salto pensiamo noi.
        </p>
      </aside>
    );
  if (game.phase === "gameover")
    return (
      <aside className="quest-panel ending-panel">
        <div className="panel-topline">
          <span>PICCOLA PAUSA GELATO</span>
          <PixelIcon name="heart" />
        </div>
        <div className="ending-symbol">♡</div>
        <h2 ref={heading} tabIndex={-1}>
          Anche le avventuriere
          <br />
          si prendono una pausa.
        </h2>
        <p>
          Tre cuori finiti? Nessun dramma.
          <br />
          Una sfogliatella, un bel respiro…
          <br />e si ricomincia!
        </p>
        <p className="panel-note">Il viaggio ti aspetta ancora, Susanna.</p>
        <button className="primary-button" onClick={onStart}>
          Riprova, Susanna! <PixelIcon name="replay" />
        </button>
        <p className="control-tip">
          Si riparte da Napoli, con tutti e tre i cuori.
        </p>
      </aside>
    );
  if (game.phase === "victory")
    return (
      <aside className="quest-panel victory-panel">
        <div className="panel-topline">
          <span>MISSIONE COMPLETATA!</span>
          <PixelIcon name="spark" />
        </div>
        <h2 ref={heading} tabIndex={-1}>
          Auguri
          <br />
          <span>infiniti!</span>
        </h2>
        <div className="birthday-message">
          {birthday.message.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <button className="primary-button" onClick={onFireworks}>
          Ancora fuochi d’artificio <PixelIcon name="spark" />
        </button>
        <button className="secondary-button" onClick={onStart}>
          <PixelIcon name="replay" /> Rivivi l’avventura
        </button>
      </aside>
    );
  const locked = game.phase !== "question";
  const success = ["correct", "walking", "jumping", "traveling"].includes(
    game.phase,
  );
  return (
    <aside className="quest-panel question-panel">
      <div className="panel-topline">
        <span>LA SFIDA DI SUSANNA</span>
        <span>
          {String(game.question + 1).padStart(2, "0")} / {questions.length}
        </span>
      </div>
      <div className="question-progress" aria-hidden="true">
        {Array.from({ length: jumpCount }, (_, i) => (
          <i
            key={i}
            className={
              i < platformIndex || (i === platformIndex && success)
                ? "done"
                : i === platformIndex
                  ? "active"
                  : ""
            }
          />
        ))}
      </div>
      <span className="eyebrow">
        TAPPA {stageIndex + 1} · SALTO {platformIndex + 1} DI {jumpCount}
      </span>
      <h2 ref={heading} tabIndex={-1}>
        {question.title}
      </h2>
      <div
        className="answers"
        role="group"
        aria-label={`Risposte alla domanda ${game.question + 1}`}
      >
        {question.answers.map((answer, i) => (
          <button
            key={`${game.question}-${i}`}
            className={`answer-button ${game.mistakes.includes(i) ? "incorrect" : ""} ${game.selected === i && success ? "correct" : ""}`}
            onClick={() => onAnswer(i)}
            disabled={locked || game.mistakes.includes(i)}
          >
            <span className="answer-letter">
              {game.selected === i && success ? (
                <PixelIcon name="check" />
              ) : game.mistakes.includes(i) ? (
                "×"
              ) : (
                ["A", "B", "C"][i]
              )}
            </span>
            <span>{answer.text}</span>
          </button>
        ))}
      </div>
      <div
        className={`feedback ${success ? "feedback-success" : game.feedback ? "feedback-wrong" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {game.feedback ? (
          <>
            <PixelIcon name={success ? "spark" : "heart"} />
            <span>{game.feedback}</span>
          </>
        ) : (
          <>
            <PixelIcon name="spark" />
            <span>Ogni risposta giusta, un salto verso la sorpresa.</span>
          </>
        )}
      </div>
      <div className="panel-bottom">
        {success
          ? "UN ALTRO SALTO, UN ALTRO SORRISO…"
          : "IL TUO SUPERPOTERE? ESSERE TE STESSA."}
      </div>
    </aside>
  );
}
