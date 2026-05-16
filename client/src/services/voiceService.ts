// Light-weight wrapper around the browser Web Speech API.
// Browser support is variable (best in Chrome/Edge). The UI must handle
// the "not supported" case gracefully.

// Minimal typings - the DOM lib doesn't ship SpeechRecognition types yet.
interface SpeechRecognitionResultLike {
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isVoiceSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function extractRegistration(transcript: string): string | null {
  const upper = transcript.toUpperCase();
  // Find the longest sequence of [A-Z0-9 ] that looks like a UK plate.
  // Strategy: strip leading "CHECK MOT FOR" / "CHECK MOT" / "MOT" if present, then
  // strip non-alphanumerics and keep last 5–8 chars.
  const cleaned = upper.replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = cleaned.split(' ');
  // Try to find a run of tokens whose concatenation looks like a plate.
  for (let len = tokens.length; len > 0; len--) {
    for (let start = 0; start + len <= tokens.length; start++) {
      const candidate = tokens.slice(start, start + len).join('');
      if (/^[A-Z0-9]{5,8}$/.test(candidate) && /[0-9]/.test(candidate) && /[A-Z]/.test(candidate)) {
        return candidate;
      }
    }
  }
  // Fall back: just the alphanumerics
  const stripped = upper.replace(/[^A-Z0-9]/g, '');
  if (stripped.length >= 5 && stripped.length <= 8) return stripped;
  return null;
}

export interface VoiceController {
  stop: () => void;
}

export function startListening(opts: {
  onResult: (transcript: string) => void;
  onError: (message: string) => void;
  onEnd?: () => void;
}): VoiceController | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.lang = 'en-GB';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  recognition.onresult = (e) => {
    const transcript = e.results[0]?.[0]?.transcript ?? '';
    opts.onResult(transcript);
  };
  recognition.onerror = (e) => {
    opts.onError(e.error ?? 'voice recognition error');
  };
  recognition.onend = () => {
    opts.onEnd?.();
  };
  recognition.start();
  return { stop: () => recognition.stop() };
}
