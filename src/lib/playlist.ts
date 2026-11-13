export type MusicState = {
  track: number;
  status: "idle" | "loading" | "playing" | "blocked" | "error" | "finished";
};
type MusicMedia = Pick<
  HTMLMediaElement,
  | "src"
  | "preload"
  | "muted"
  | "paused"
  | "ended"
  | "currentTime"
  | "play"
  | "pause"
  | "addEventListener"
  | "removeEventListener"
>;

// Keep one playback element for both songs: Safari's user-gesture permission
// stays with that element when its source changes at the end of the first song.
export class Playlist {
  private media: MusicMedia;
  private sources: readonly string[];
  private notify: (state: MusicState) => void;
  private track = 0;
  private status: MusicState["status"] = "idle";
  private started = false;
  private disposed = false;
  private request = 0;

  constructor(
    media: MusicMedia,
    sources: readonly string[],
    notify: (state: MusicState) => void,
  ) {
    this.media = media;
    this.sources = sources;
    this.notify = notify;
    media.addEventListener("ended", this.onEnded);
    media.addEventListener("error", this.onError);
    media.addEventListener("pause", this.onPause);
  }
  private update(status: MusicState["status"]) {
    this.status = status;
    this.notify({ track: this.track, status });
  }
  private playCurrent() {
    const request = ++this.request;
    this.update("loading");
    // Do not await anything before play(): Inizia and retries must retain the
    // browser's transient user activation, especially on iPhone Safari.
    try {
      void this.media
        .play()
        .then(() => {
          if (!this.disposed && request === this.request)
            this.update("playing");
        })
        .catch((error: unknown) => this.playFailed(error, request));
    } catch (error) {
      this.playFailed(error, request);
    }
  }
  private playFailed(error: unknown, request: number) {
    if (this.disposed || request !== this.request) return;
    this.update(
      error instanceof Error && error.name === "NotAllowedError"
        ? "blocked"
        : "error",
    );
  }
  start() {
    if (this.started || this.disposed || !this.sources.length) return;
    this.started = true;
    this.media.preload = "auto";
    if (
      !this.media.src.endsWith(encodeURI(this.sources[0])) &&
      this.media.src !== this.sources[0]
    ) {
      this.media.src = this.sources[0];
    }
    this.playCurrent();
  }
  resume() {
    if (!this.started || this.disposed || this.status === "finished") return;
    if (this.status === "error") this.media.src = this.sources[this.track];
    this.playCurrent();
  }
  setMuted(muted: boolean) {
    this.media.muted = muted;
  }
  private onEnded = () => {
    if (
      !this.started ||
      this.disposed ||
      !this.media.ended ||
      this.status === "finished"
    )
      return;
    if (this.track + 1 === this.sources.length) {
      ++this.request;
      this.update("finished");
      return;
    }
    this.track++;
    this.status = "loading";
    this.media.src = this.sources[this.track];
    this.playCurrent();
  };
  private onError = () => {
    if (this.started && !this.disposed) {
      ++this.request;
      this.update("error");
    }
  };
  private onPause = () => {
    if (
      this.started &&
      !this.disposed &&
      !this.media.ended &&
      this.status === "playing"
    )
      this.update("blocked");
  };
  dispose() {
    this.disposed = true;
    ++this.request;
    this.media.removeEventListener("ended", this.onEnded);
    this.media.removeEventListener("error", this.onError);
    this.media.removeEventListener("pause", this.onPause);
    this.media.pause();
  }
}
