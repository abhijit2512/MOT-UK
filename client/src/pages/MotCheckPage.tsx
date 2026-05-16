import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mic, MicOff, Search } from 'lucide-react';
import { checkMot } from '../services/api';
import { MotData } from '../types';
import { cleanRegistration, isValidRegistration } from '../utils/validation';
import { extractRegistration, isVoiceSupported, startListening, VoiceController } from '../services/voiceService';
import MotResultCard from '../components/MotResultCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MotCheckPage() {
  const [params, setParams] = useSearchParams();
  const [reg, setReg] = useState(params.get('reg') ?? '');
  const [data, setData] = useState<MotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState<string | null>(null);
  const controllerRef = useRef<VoiceController | null>(null);
  const voiceSupported = isVoiceSupported();

  const runCheck = useCallback(async (value: string) => {
    setError(null);
    setData(null);
    if (!isValidRegistration(value)) {
      setError('Please enter a valid UK registration number.');
      return;
    }
    setLoading(true);
    try {
      const result = await checkMot(cleanRegistration(value));
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to check MOT.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-run from query string (?reg=...&auto=1)
  useEffect(() => {
    if (params.get('auto') === '1' && params.get('reg')) {
      const r = params.get('reg') ?? '';
      setReg(r);
      runCheck(r);
      // remove auto so it doesn't re-fire
      const next = new URLSearchParams(params);
      next.delete('auto');
      setParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runCheck(reg);
  };

  const startVoice = () => {
    setVoiceMsg(null);
    setError(null);
    const controller = startListening({
      onResult: (transcript) => {
        setVoiceMsg(`Heard: "${transcript}"`);
        const extracted = extractRegistration(transcript);
        if (extracted) {
          setReg(extracted);
          runCheck(extracted);
        } else {
          setError('Could not detect a registration number from speech. Try saying "Check MOT for AB12 CDE".');
        }
      },
      onError: (msg) => {
        setError(`Voice error: ${msg}`);
        setListening(false);
      },
      onEnd: () => setListening(false),
    });
    if (!controller) {
      setError('Voice recognition is not supported in this browser. Please type the registration number.');
      return;
    }
    controllerRef.current = controller;
    setListening(true);
  };

  const stopVoice = () => {
    controllerRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">MOT check</h1>
        <p className="text-slate-600 mt-1">
          Enter a UK registration number, or click the mic and say something like
          <span className="font-medium"> “Check MOT for AB12 CDE”</span>.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card p-4 sm:p-6 space-y-3">
        <label className="label" htmlFor="reg">Registration number</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="reg"
            value={reg}
            onChange={(e) => setReg(e.target.value)}
            placeholder="AB12 CDE"
            className="input text-lg font-semibold uppercase tracking-wider"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search size={16} /> Check
          </button>
          <button
            type="button"
            onClick={listening ? stopVoice : startVoice}
            className={listening ? 'btn-danger' : 'btn-secondary'}
            disabled={!voiceSupported}
            title={voiceSupported ? 'Use voice to search' : 'Voice not supported in this browser'}
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
            {listening ? 'Stop' : 'Voice'}
          </button>
        </div>
        {!voiceSupported && (
          <p className="text-xs text-slate-500">
            Voice recognition is not supported in this browser. Try Chrome or Edge for voice search.
          </p>
        )}
        {voiceMsg && <p className="text-xs text-slate-500">{voiceMsg}</p>}
      </form>

      {loading && (
        <div className="card p-6">
          <LoadingSpinner label="Checking MOT…" />
        </div>
      )}

      {error && (
        <div className="card p-4 border-red-200 bg-red-50 text-red-800">{error}</div>
      )}

      {data && <MotResultCard data={data} />}
    </div>
  );
}
