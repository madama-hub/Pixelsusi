import { useEffect, useReducer, useRef, useState } from "react";
import { assets, birthday } from "./data/config";
import { getStageProgress, questions } from "./data/questions";
import { durations, gameReducer, initialState, MAX_LIVES } from "./lib/game";
import { gameAudio } from "./lib/audio";
import { PixelIcon } from "./components/PixelIcon";
import { QuestionPanel } from "./components/QuestionPanel";
import { Scene } from "./components/Scene";
import { StartScreen } from "./components/StartScreen";
import { LevelBackdrop } from "./components/LevelBackdrop";
import { soundtrack } from "./data/music";
import { Playlist } from "./lib/playlist";
import type { MusicState } from "./lib/playlist";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(gameAudio.muted);
  const [music, setMusic] = useState<MusicState>({ track: 0, status: "idle" });
  const audio = useRef<HTMLAudioElement>(null);
  const playlist = useRef<Playlist | null>(null);

  useEffect(() => {
    const player = new Playlist(
      audio.current!,
      soundtrack.map((track) => track.src),
      setMusic,
    );
    playlist.current = player;
    player.setMuted(gameAudio.muted);
    return () => {
      player.dispose();
      playlist.current = null;
    };
  }, []);

  const begin = () => {
    // Both audio systems are unlocked directly inside this tap, before rendering.
    gameAudio.unlock();
    playlist.current?.start();
    setEntered(true);
  };
  const toggleMute = () => {
    gameAudio.unlock();
    const next = !muted;
    gameAudio.setMuted(next);
    playlist.current?.setMuted(next);
    if (!next && (music.status === "blocked" || music.status === "error"))
      playlist.current?.resume();
    setMuted(next);
  };

  return (
    <>
      <audio
        ref={audio}
        src={soundtrack[0].src}
        preload="metadata"
        aria-label="Musica dell’avventura"
      />
      {/* Warm the next song, including the first song when the playlist loops. */}
      <audio
        src={entered ? soundtrack[(music.track + 1) % soundtrack.length].src : undefined}
        preload={entered ? "auto" : "none"}
        aria-hidden="true"
      />
      {entered ? (
        <Adventure
          muted={muted}
          music={music}
          onToggleMute={toggleMute}
          onResumeMusic={() => playlist.current?.resume()}
        />
      ) : (
        <StartScreen onBegin={begin} />
      )}
    </>
  );
}

function Adventure({
  muted,
  music,
  onToggleMute,
  onResumeMusic,
}: {
  muted: boolean;
  music: MusicState;
  onToggleMute: () => void;
  onResumeMusic: () => void;
}) {
  const [game, dispatch] = useReducer(gameReducer, initialState);
  const [loaded, setLoaded] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [burst, setBurst] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [fireworkNotice, setFireworkNotice] = useState("");
  const ready = loaded === Object.keys(assets).length && !loadError;
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    const timeout = window.setTimeout(() => {
      if (!cancelled) setLoadError(true);
    }, 30000);
    setLoaded(0);
    setLoadError(false);
    let count = 0;
    for (const source of Object.values(assets)) {
      const image = new Image();
      image.onload = () => {
        if (cancelled) return;
        count++;
        setLoaded(count);
        if (count === Object.keys(assets).length) window.clearTimeout(timeout);
      };
      image.onerror = () => {
        if (!cancelled) setLoadError(true);
      };
      image.src = source;
      images.push(image);
    }
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [attempt]);
  useEffect(() => {
    const delay = durations[game.phase];
    if (delay === undefined) return;
    const timer = window.setTimeout(() => dispatch({ type: "TICK" }), delay);
    return () => window.clearTimeout(timer);
  }, [game.phase]);
  useEffect(() => {
    if (game.phase === "correct") gameAudio.play("correct");
    if (game.phase === "wrong") gameAudio.play("wrong");
    if (game.phase === "jumping") gameAudio.play("jump");
    if (game.phase === "victory") gameAudio.play("victory");
  }, [game.phase]);
  useEffect(() => {
    if (!fireworkNotice) return;
    const timer = window.setTimeout(() => setFireworkNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [fireworkNotice, burst]);
  const start = () => {
    gameAudio.unlock();
    gameAudio.play("start");
    dispatch({ type: "RESTART" });
    setFireworkNotice("");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  if (!ready)
    return (
      <main className="loading-screen">
        <LevelBackdrop city="napoli" />
        <PixelIcon name="spark" className="loading-spark" />
        <span className="eyebrow">UN’AVVENTURA INFINITA</span>
        <h1>
          {loadError
            ? "La magia si è fermata un attimo."
            : "Prepariamo la magia…"}
        </h1>
        {loadError ? (
          <>
            <p>
              Non siamo riusciti a caricare tutte le immagini.
              <br />
              Controlla la connessione e riprova.
            </p>
            <button
              className="primary-button"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Riprova <PixelIcon name="replay" />
            </button>
          </>
        ) : (
          <>
            <div
              className="loading-bar"
              role="progressbar"
              aria-label="Caricamento delle immagini"
              aria-valuemin={0}
              aria-valuemax={Object.keys(assets).length}
              aria-valuenow={loaded}
            >
              <span
                style={{
                  width: `${(loaded / Object.keys(assets).length) * 100}%`,
                }}
              />
            </div>
            <p>Un po’ di sole, un pizzico di magia e tanto amore.</p>
          </>
        )}
      </main>
    );
  const { environment, stage } = getStageProgress(game.question);
  const intro = game.phase === "intro";
  return (
    <div className={`app-shell ${intro ? "is-intro" : "is-playing"}`}>
      <LevelBackdrop city={stage.city} />
      <header className="topbar flex items-center justify-between gap-3">
        <a
          href="#avventura"
          className="brand"
          aria-label="Susanna, vai all’avventura"
        >
          <span className="brand-icon">
            <PixelIcon name="spark" />
          </span>
          <span>
            SUSANNA<small>BIRTHDAY ADVENTURE</small>
          </span>
        </a>
        <div
          className={`header-actions flex items-center gap-3 ${music.status === "blocked" || music.status === "error" ? "needs-music-retry" : ""}`}
        >
          <div className="music-label" aria-live="polite">
            <span>
              {music.status === "blocked" || music.status === "error"
                ? "MUSICA IN PAUSA"
                : muted
                  ? "MUSICA IN SILENZIO"
                  : "IN ASCOLTO"}
            </span>
            <strong>{soundtrack[music.track].artist}</strong>
            <small>{soundtrack[music.track].title}</small>
          </div>
          {(music.status === "blocked" || music.status === "error") && (
            <button className="music-retry" onClick={onResumeMusic}>
              Riprendi musica
            </button>
          )}
          <button
            className="icon-button sound-button"
            onClick={onToggleMute}
            aria-label={muted ? "Attiva i suoni" : "Disattiva i suoni"}
            aria-pressed={muted}
          >
            <PixelIcon name={muted ? "mute" : "sound"} />
            <span>{muted ? "OFF" : "ON"}</span>
          </button>
        </div>
      </header>
      <main id="avventura">
        <div className="page-heading">
          <div>
            <div className="overline">
              <span />{" "}
              {intro
                ? "UN GIORNO SPECIALE. UNA PERSONA SPECIALE."
                : game.phase === "victory"
                  ? "TUTTE LE STRADE PORTANO A TE."
                  : "IL VIAGGIO PIÙ BELLO È QUELLO INSIEME."}
            </div>
            <h1>
              Un’avventura <span>infinita.</span>
              <PixelIcon name="spark" />
            </h1>
          </div>
          {intro ? (
            <p className="heading-aside">
              Un piccolo mondo di pixel.
              <br />
              <span>Un grandissimo augurio.</span>
            </p>
          ) : (
            <div className="lives-panel">
              <span className="lives-label">I TUOI CUORI</span>
              <div
                className="hearts"
                role="img"
                aria-label={`${game.lives} vite rimaste su ${MAX_LIVES}`}
              >
                {Array.from({ length: MAX_LIVES }, (_, i) => (
                  <PixelIcon
                    key={i}
                    name="heart"
                    className={`${i < game.lives ? "heart-full" : "heart-empty"} ${game.phase === "wrong" && i === game.lives ? "heart-lost" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="game-layout">
          <Scene game={game} burst={burst} />
          <QuestionPanel
            game={game}
            onStart={start}
            onAnswer={(answer) => {
              gameAudio.unlock();
              dispatch({ type: "ANSWER", answer });
            }}
            onFireworks={() => {
              gameAudio.unlock();
              gameAudio.play("firework");
              setBurst((value) => value + 1);
              setFireworkNotice("Il cielo si accende di nuovo per te!");
              document.querySelector(".scene-frame")?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
                block: "center",
              });
            }}
          />
        </div>
        <div className="sr-only" role="status" aria-live="polite">
          {fireworkNotice ||
            (!intro
              ? `${environment.name}. ${game.lives} cuori rimasti. Domanda ${game.question + 1} di ${questions.length}.`
              : "")}
        </div>
        <div className="under-game">
          <span>
            <PixelIcon name="heart" /> FATTO CON AFFETTO, DA DORJAN E GAIA
          </span>
          <button
            className="help-button"
            onClick={() => setShowHelp((value) => !value)}
            aria-expanded={showHelp}
            aria-controls="game-help"
          >
            {showHelp ? "Chiudi le istruzioni −" : "Come si gioca +"}
          </button>
        </div>
        {showHelp && (
          <div id="game-help" className="help-panel">
            <h2>Piccole istruzioni per una grande avventura</h2>
            <p>
              Scegli una delle tre risposte. Se è giusta, Susanna salta da sola
              alla prossima piattaforma. Se sbagli, perdi un cuore e puoi
              riprovare. Hai tre cuori per {questions.length} domande. Raggiungi
              l’ultima piattaforma di ogni tappa per continuare il viaggio. A
              zero cuori puoi ricominciare da Napoli. Puoi attivare o
              disattivare i suoni in alto. Nessuna corsa: prenditi tutto il
              tempo che vuoi!
            </p>
          </div>
        )}
      </main>
      <footer>
        <span>UN’AVVENTURA INFINITA</span>
        <span>
          {birthday.date.toUpperCase()} <span className="footer-heart">♥</span>
        </span>
      </footer>
    </div>
  );
}
