import { create } from 'zustand';

interface LiveSessionState {
  /** Whether a session is currently being recorded */
  isRecording: boolean;
  /** Cat ID for the active session */
  catId: string | null;
  /** Cat emoji for display in the indicator */
  catEmoji: string | null;
  /** Timestamp when recording started (Date.now()) */
  startTime: number | null;
  /** Accumulated pause offset in ms */
  pauseOffset: number;
  /** Whether currently paused */
  isPaused: boolean;
  /** Timestamp when pause started */
  pauseStartedAt: number | null;

  startRecording: (catId: string, catEmoji: string) => void;
  pause: () => void;
  resume: () => void;
  stopRecording: () => { elapsedMs: number };
  clear: () => void;
  getElapsedMs: () => number;
}

export const useLiveSessionStore = create<LiveSessionState>((set, get) => ({
  isRecording: false,
  catId: null,
  catEmoji: null,
  startTime: null,
  pauseOffset: 0,
  isPaused: false,
  pauseStartedAt: null,

  startRecording: (catId, catEmoji) =>
    set({
      isRecording: true,
      catId,
      catEmoji,
      startTime: Date.now(),
      pauseOffset: 0,
      isPaused: false,
      pauseStartedAt: null,
    }),

  pause: () =>
    set({
      isPaused: true,
      pauseStartedAt: Date.now(),
    }),

  resume: () => {
    const { pauseStartedAt, pauseOffset } = get();
    const additionalPause = pauseStartedAt
      ? Date.now() - pauseStartedAt
      : 0;
    set({
      isPaused: false,
      pauseStartedAt: null,
      pauseOffset: pauseOffset + additionalPause,
    });
  },

  stopRecording: () => {
    const elapsed = get().getElapsedMs();
    set({
      isRecording: false,
      isPaused: false,
      pauseStartedAt: null,
    });
    return { elapsedMs: elapsed };
  },

  clear: () =>
    set({
      isRecording: false,
      catId: null,
      catEmoji: null,
      startTime: null,
      pauseOffset: 0,
      isPaused: false,
      pauseStartedAt: null,
    }),

  getElapsedMs: () => {
    const { startTime, pauseOffset, isPaused, pauseStartedAt } = get();
    if (!startTime) return 0;
    const now = Date.now();
    const currentPause =
      isPaused && pauseStartedAt ? now - pauseStartedAt : 0;
    return now - startTime - pauseOffset - currentPause;
  },
}));
