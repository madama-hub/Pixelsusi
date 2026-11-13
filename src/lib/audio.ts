type Sound = "start" | "correct" | "wrong" | "jump" | "victory" | "firework";
const melodies: Record<Sound, number[]> = {
  start: [392, 523.25, 659.25, 783.99],
  correct: [523.25, 659.25, 783.99],
  wrong: [246.94, 196],
  jump: [392, 523.25],
  victory: [523.25, 523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5],
  firework: [659.25, 783.99, 1046.5, 1318.5],
};
class GameAudio {
  private context: AudioContext | null = null;
  private gain: GainNode | null = null;
  muted = false;
  constructor() {
    try {
      this.muted = localStorage.getItem("susanna-muted") === "true";
    } catch {
      /* Private browsing may disable storage. */
    }
  }
  // Called only from a button gesture, including the initial Start button (Safari).
  unlock() {
    try {
      if (!this.context) {
        const AudioConstructor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioConstructor) return;
        this.context = new AudioConstructor();
        this.gain = this.context.createGain();
        this.gain.gain.value = this.muted ? 0 : 0.055;
        this.gain.connect(this.context.destination);
      }
      if (this.context.state === "suspended")
        void this.context.resume().catch(() => {});
    } catch {
      /* Audio is optional; gameplay always works. */
    }
  }
  setMuted(value: boolean) {
    this.muted = value;
    if (this.context && this.gain)
      this.gain.gain.setValueAtTime(
        value ? 0 : 0.055,
        this.context.currentTime,
      );
    try {
      localStorage.setItem("susanna-muted", String(value));
    } catch {
      /* Optional preference. */
    }
  }
  play(sound: Sound) {
    if (
      this.muted ||
      !this.context ||
      !this.gain ||
      this.context.state !== "running"
    )
      return;
    const context = this.context;
    melodies[sound].forEach((frequency, index) => {
      const start = context.currentTime + index * 0.12;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = sound === "wrong" ? "triangle" : "square";
      oscillator.frequency.setValueAtTime(frequency, start);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(0.6, start + 0.008);
      envelope.gain.exponentialRampToValueAtTime(0.001, start + 0.17);
      oscillator.connect(envelope);
      envelope.connect(this.gain!);
      oscillator.start(start);
      oscillator.stop(start + 0.18);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
      };
    });
  }
}
export const gameAudio = new GameAudio();
