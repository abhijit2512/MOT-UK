import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface Props {
  onTranscript: (text: string) => void;
}

// Minimal types so we don't depend on dom.speech typings.
type SR = any;

function getSpeechRecognition(): SR | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function VoiceButton({ onTranscript }: Props) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    setSupported(!!getSpeechRecognition());
  }, []);

  const start = () => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setSupported(false);
      setMessage('Voice search is not supported in this browser. Try Chrome on desktop, or type the registration manually.');
      return;
    }
    setMessage(null);
    const recog = new SR();
    recog.lang = 'en-GB';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onstart = () => setListening(true);
    recog.onerror = (e: any) => {
      setListening(false);
      setMessage(`Voice error: ${e.error}. Please try again or type manually.`);
    };
    recog.onend = () => setListening(false);
    recog.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? '';
      onTranscript(text);
    };
    recog.start();
    recogRef.current = recog;
  };

  const stop = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={listening ? stop : start}
        className={`btn ${listening ? 'bg-rose-600 text-white hover:bg-rose-700' : 'btn-secondary'}`}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
      >
        {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        {listening ? 'Listening…' : 'Voice search'}
      </button>
      {!supported && (
        <p className="mt-2 text-xs text-slate-500">
          Voice search isn’t available here. Use a recent Chrome/Edge browser or type the plate manually.
        </p>
      )}
      {message && <p className="mt-2 text-xs text-rose-600">{message}</p>}
    </div>
  );
}
