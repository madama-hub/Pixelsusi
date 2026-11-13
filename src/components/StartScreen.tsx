import { assets } from "../data/config";
import { LevelBackdrop } from "./LevelBackdrop";
import { PixelIcon } from "./PixelIcon";

export function StartScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <main className="start-screen">
      <LevelBackdrop city="napoli" />
      <div className="start-card">
        <div className="start-stars" aria-hidden="true">
          <PixelIcon name="spark" />
          <PixelIcon name="spark" />
          <PixelIcon name="spark" />
        </div>
        <span className="eyebrow">UN PICCOLO MONDO, TUTTO PER TE</span>
        <div className="start-character" aria-hidden="true">
          <div
            className="sprite sprite-idle"
            style={{ backgroundImage: `url("${assets.spriteSheet}")` }}
          />
        </div>
        <h1>
          Susanna<span>Un’avventura infinita</span>
        </h1>
        <p>
          Un viaggio di pixel, musica
          <br />e bellissime sorprese.
        </p>
        <button className="primary-button start-button" onClick={onBegin}>
          Inizia <PixelIcon name="arrow" />
        </button>
        <span className="start-note">
          <PixelIcon name="sound" /> La tua avventura comincia con una canzone.
        </span>
        <div className="start-signature">
          FATTO CON AFFETTO, DA DORJAN E GAIA <PixelIcon name="heart" />
        </div>
      </div>
    </main>
  );
}
