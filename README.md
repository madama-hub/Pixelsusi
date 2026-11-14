# Susanna — Un’avventura infinita

A personal pixel-art birthday adventure for Susanna, 14 November 2026. React + Vite + TypeScript + Tailwind CSS; no backend, login, paid service, or runtime network dependencies.

## Run locally

Use Node.js 22.18+ (or a newer supported LTS release).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To test on an iPhone on the same Wi-Fi, use the Network URL printed by `npm run dev`. Tap **Inizia** on the opening screen to enter the birthday experience and start the music. The header mute button controls both music and game sounds.

```sh
npm test       # Game rules, route, replay, music order, mute, and audio recovery
npm run build # TypeScript checks and the production bundle in dist/
npm run preview
```

## Deploy to Vercel

Import this folder as a Vercel project (normally through your Git repository). Choose the **Vite** framework preset, build command **`npm run build`**, and output directory **`dist`**. No environment variables or server setup are needed. Alternatively run `npx vercel` from this directory after signing into your own Vercel account. The project has been prepared for deployment; no hosted deployment is included.

## Personalize

- `src/data/questions.ts`: 26 questions, three answers each, and individual success messages. Every answer to the genero question is deliberately correct. Keep one question per jump in each stage.
- `src/data/journey.ts`: route order and every landing coordinate. The route is Napoli (questions 1–4), Casal di Principe (5–10), Caserta (11–15), Salerno (16–20), and Marina di Camerota as the final destination (21–26). Each stage reaches the final platform before the wallpaper changes.
- `src/data/config.ts`: birthday message, date, and supplied artwork imports.
- `src/data/music.ts`: the three supplied songs and their playback order; the playlist loops continuously.
- `src/lib/game.ts`: three-heart rules and feedback/animation timing.
- `src/components/Scene.tsx`: the sprite sheet poses and illustrated journey.
- `src/styles.css`: responsive pixel-art design and CSS animation.
- `src/components/LevelBackdrop.tsx`: a softly blurred page backdrop that crossfades with the current level; the playable artwork stays sharp.

## Structure

```text
Images/                 Original supplied PNGs, unchanged
music/                  Original supplied MP3 tracks, unchanged
public/spark.svg        Pixel-art favicon
src/
  components/           Scene, fireworks, questions, pixel icons
  data/                 Editable questions and birthday configuration
  lib/                  Game state machine, rule tests, and Web Audio sounds
  App.tsx               Preloading and game orchestration
  main.tsx              Entry point and locally bundled fonts
  styles.css            Layout and animation
```

The supplied sprite sheet already has transparency; the six poses are displayed directly as a 3 × 2 CSS atlas. Idle, two walking frames, jump, and victory use the original pixels. The five original wallpapers retain their full aspect ratio and lettering. Platforms are aligned to the art with percentage coordinates, with a gold platform added at the final landing.

The game preloads all six used images, with an error/retry screen. Fonts are bundled locally. Sound effects are synthesized using Web Audio after a user gesture. The opening Inizia tap starts Domenico Modugno’s “Tu si na cosa grande pe me”, followed by Roberto Murolo’s “Malafemmena” and Luciano Pavarotti’s “’O Sole Mio”. After the third song, playback loops back to Modugno and repeats the same order continuously. The next song is preloaded while the current song plays, using the same unlocked audio element for playback on Safari. Music continues through game retries/replays without restarting or overlapping. If the browser interrupts playback, “Riprendi musica” retries the current song. Only the mute preference is saved in local storage; reloading starts a new adventure. The state machine ignores answer taps during feedback and animation, and disables already-tried wrong answers. Timers and animation frames are cleaned up on unmount. Reduced-motion preferences shorten jumps and soften celebration effects.

Earlier revisions were checked on phone and desktop layouts. The latest route, backdrop, looping playlist, and enlarged credits have not been browser-tested; build and test runs were skipped at the user's request.
