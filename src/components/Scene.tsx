import type { CSSProperties } from "react";
import { assets } from "../data/config";
import { environments, stages } from "../data/journey";
import type { CityId } from "../data/journey";
import { getStageProgress, questions } from "../data/questions";
import type { GameState } from "../lib/game";
import { Fireworks } from "./Fireworks";
import { PixelIcon } from "./PixelIcon";

export function Scene({ game, burst }: { game: GameState; burst: number }) {
  const { stage, stageIndex, environment, platformIndex, jumpCount } =
    getStageProgress(game.question);
  const from = environment.platforms[platformIndex];
  const to = environment.platforms[platformIndex + 1];
  const landed = game.phase === "traveling" || game.phase === "victory";
  const position = landed ? to : from;
  const finalJump = game.question === questions.length - 1;
  const celebrating = game.phase === "victory";
  const unlocked = [
    "correct",
    "walking",
    "jumping",
    "traveling",
    "victory",
  ].includes(game.phase);
  const pose =
    game.phase === "jumping"
      ? "jump"
      : game.phase === "walking"
        ? "walk"
        : celebrating
          ? "victory"
          : "idle";
  // Scale gently with height so Susanna fits the small, high platforms without
  // cropping her head at the top or her feet at the right edge of the artwork.
  const fromSize = Math.min(15, from.y * 0.5);
  const toSize = Math.min(15, to.y * 0.5);
  const movement = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${landed ? toSize : fromSize}%`,
    "--from-size": `${fromSize}%`,
    "--to-size": `${toSize}%`,
    "--from-x": `${from.x}%`,
    "--from-y": `${from.y}%`,
    "--to-x": `${to.x}%`,
    "--to-y": `${to.y}%`,
    "--mid-x": `${(from.x + to.x) / 2}%`,
    "--mid-y": `${Math.max((fromSize + toSize) * 0.83 + 1, Math.min(from.y, to.y) - 14)}%`,
  } as CSSProperties;
  return (
    <section
      className="scene-column"
      aria-label={`L’avventura a ${environment.name}`}
    >
      <div className="scene-frame">
        <div
          className="scene"
          data-stage={stage.id}
          data-platform={landed ? platformIndex + 1 : platformIndex}
        >
          {Object.entries(environments).map(([id, item]) => (
            <img
              key={id}
              src={assets[id as CityId]}
              className={`city-background ${id === stage.city ? "is-active" : ""}`}
              alt={
                id === stage.city
                  ? `${item.name}: paesaggio pixel art con piattaforme di maiolica, fiori e luci mediterranee`
                  : ""
              }
              aria-hidden={id !== stage.city}
              draggable="false"
            />
          ))}
          <div className="ambient-sparkles" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: `${15 + ((i * 37) % 79)}%`,
                  top: `${29 + ((i * 19) % 62)}%`,
                  animationDelay: `${-i * 0.39}s`,
                }}
              />
            ))}
          </div>
          {!["intro", "victory", "gameover"].includes(game.phase) && (
            <div
              className={`platform-marker ${unlocked ? "unlocked" : ""}`}
              style={{ left: `${to.x}%`, top: `${to.y}%` }}
              aria-hidden="true"
            >
              <PixelIcon name="spark" />
            </div>
          )}
          {finalJump && (
            <div
              className={`golden-platform ${unlocked ? "revealed" : ""}`}
              style={{ left: `${to.x - 7}%`, top: `${to.y}%`, width: "14%" }}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          )}
          <div
            key={`${stage.id}-${game.question}-${game.phase === "jumping" ? "jump" : "still"}`}
            className={`actor ${game.phase === "jumping" ? "actor-jumping" : ""} ${game.phase === "wrong" ? "actor-hurt" : ""}`}
            style={movement}
            role="img"
            aria-label={`Susanna ${pose === "jump" ? "salta alla prossima piattaforma" : celebrating ? "festeggia il suo compleanno" : "sulla piattaforma"}`}
          >
            <div
              className={`sprite sprite-${pose}`}
              style={{ backgroundImage: `url("${assets.spriteSheet}")` }}
            />
            <span className="character-shadow" />
          </div>
          {celebrating && (
            <div
              className="pixel-cake"
              style={{ left: `${to.x - 7}%`, top: `${to.y - 9}%` }}
              aria-label="Torta di compleanno"
            >
              <i className="candle" />
              <i className="icing" />
              <i className="cake-base" />
            </div>
          )}
          <Fireworks
            active={game.phase === "intro" || celebrating}
            burst={burst}
          />
          {game.phase !== "intro" && (
            <div
              className="scene-hud"
              aria-label={`Domanda ${game.question + 1} di ${questions.length}. ${game.lives} vite rimaste`}
            >
              <span>
                {game.question + 1} / {questions.length}
              </span>
              <span className="scene-hud-hearts">
                {[0, 1, 2].map((i) => (
                  <PixelIcon
                    key={i}
                    name="heart"
                    className={i < game.lives ? "heart-full" : "heart-empty"}
                  />
                ))}
              </span>
            </div>
          )}
          {game.phase === "traveling" && (
            <div className="travel-curtain">
              <PixelIcon name="spark" />
              <span>La magia continua…</span>
            </div>
          )}
          {game.phase === "intro" && (
            <div className="scene-caption">
              <span className="live-dot" /> UN VIAGGIO FATTO CON AMORE
            </div>
          )}
          {celebrating && (
            <div className="scene-caption victory-caption">
              <PixelIcon name="heart" /> AUGURI INFINITI, SUSANNA!
            </div>
          )}
        </div>
      </div>
      <div className="stage-status">
        <span>
          TAPPA {stageIndex + 1} / {stages.length}
        </span>
        <span
          className="platform-dots"
          aria-label={`${landed ? platformIndex + 1 : platformIndex} salti completati su ${jumpCount}`}
        >
          {environment.platforms.slice(1).map((_, i) => (
            <i
              key={i}
              className={
                i < platformIndex || (landed && i === platformIndex)
                  ? "done"
                  : ""
              }
            />
          ))}
        </span>
      </div>
    </section>
  );
}
