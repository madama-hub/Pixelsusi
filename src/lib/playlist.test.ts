import { test } from "node:test";
import assert from "node:assert/strict";
import { Playlist } from "./playlist.ts";
import type { MusicState } from "./playlist.ts";

class FakeMedia extends EventTarget {
  private source = "";
  muted = false;
  paused = true;
  ended = false;
  currentTime = 0;
  preload: HTMLMediaElement["preload"] = "none";
  played: string[] = [];
  failure: Error | null = null;
  get src() {
    return this.source;
  }
  set src(value: string) {
    this.source = value;
    this.ended = false;
    this.currentTime = 0;
  }
  play() {
    this.played.push(this.src);
    if (this.failure) return Promise.reject(this.failure);
    this.paused = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }
  finish() {
    this.ended = true;
    this.paused = true;
    this.dispatchEvent(new Event("ended"));
  }
}
const flush = () => new Promise<void>((resolve) => queueMicrotask(resolve));
function setup() {
  const media = new FakeMedia();
  let state: MusicState = { track: 0, status: "idle" };
  const playlist = new Playlist(
    media,
    ["modugno.mp3", "murolo.mp3", "pavarotti.mp3"],
    (next) => {
      state = next;
    },
  );
  return { media, playlist, state: () => state };
}

test("no music before Inizia; one synchronous play call despite repeated starts", async () => {
  const { media, playlist, state } = setup();
  assert.deepEqual(media.played, []);
  playlist.start();
  playlist.start();
  assert.deepEqual(media.played, ["modugno.mp3"]);
  await flush();
  assert.equal(state().status, "playing");
});
test("the same unlocked player plays all three songs and loops back to Modugno", async () => {
  const { media, playlist, state } = setup();
  playlist.start();
  await flush();
  media.finish();
  assert.deepEqual(media.played, ["modugno.mp3", "murolo.mp3"]);
  assert.equal(media.currentTime, 0);
  await flush();
  assert.deepEqual(state(), { track: 1, status: "playing" });
  media.finish();
  await flush();
  assert.deepEqual(state(), { track: 2, status: "playing" });
  assert.equal(media.src, "pavarotti.mp3");
  media.finish();
  await flush();
  assert.deepEqual(state(), { track: 0, status: "playing" });
  assert.equal(media.currentTime, 0);
  assert.deepEqual(media.played, [
    "modugno.mp3", "murolo.mp3", "pavarotti.mp3", "modugno.mp3",
  ]);
  media.finish();
  await flush();
  assert.deepEqual(state(), { track: 1, status: "playing" });
  assert.equal(media.src, "murolo.mp3");
});
test("mute keeps position and applies to the next track; replay cannot overlap or rewind music", async () => {
  const { media, playlist } = setup();
  playlist.start();
  await flush();
  media.currentTime = 42;
  playlist.setMuted(true);
  assert.equal(media.muted, true);
  assert.equal(media.currentTime, 42);
  assert.equal(media.paused, false);
  playlist.start();
  assert.equal(media.currentTime, 42);
  media.finish();
  await flush();
  assert.equal(media.muted, true);
  playlist.setMuted(false);
  assert.equal(media.muted, false);
  assert.deepEqual(media.played, ["modugno.mp3", "murolo.mp3"]);
});
test("an autoplay rejection is recoverable without losing the current track", async () => {
  const { media, playlist, state } = setup();
  media.failure = Object.assign(new Error("Gesture needed"), {
    name: "NotAllowedError",
  });
  playlist.start();
  await flush();
  assert.equal(state().status, "blocked");
  media.failure = null;
  playlist.resume();
  await flush();
  assert.equal(state().status, "playing");
  media.failure = Object.assign(new Error("Gesture needed"), {
    name: "NotAllowedError",
  });
  media.finish();
  await flush();
  assert.deepEqual(state(), { track: 1, status: "blocked" });
  media.failure = null;
  playlist.resume();
  await flush();
  assert.equal(media.src, "murolo.mp3");
  assert.equal(state().status, "playing");
});
test("media errors and interruptions expose retry; disposal stops audio and removes listeners", async () => {
  const { media, playlist, state } = setup();
  playlist.start();
  await flush();
  media.pause();
  assert.equal(state().status, "blocked");
  playlist.resume();
  await flush();
  media.dispatchEvent(new Event("error"));
  assert.equal(state().status, "error");
  playlist.dispose();
  assert.equal(media.paused, true);
  media.finish();
  assert.deepEqual(media.played, ["modugno.mp3", "modugno.mp3"]);
});
