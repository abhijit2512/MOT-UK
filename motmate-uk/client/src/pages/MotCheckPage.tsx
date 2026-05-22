import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import VoiceButton from '../components/VoiceButton';
import MotResultCard from '../components/MotResultCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { api } from '../services/api';
import { MotResponse } from '../types';
import { extractRegistrationFromSpeech } from '../utils/format';

export default function MotCheckPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('reg') ?? '';
  const [reg, setReg] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MotResponse | null>(null);
  const [voiceMsg, setVoiceMsg] = useState<string | null>(null);

  async function run(value: string) {
    const v = value.trim();
    if (!v) {
      setError('Please enter a registration number.');
      return;
    }
    setError(null);
    setLoading(true);
    setData(null);
    try {
      const res = await api.checkMot(v);
      setData(res);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-run if a ?reg= is in the URL on first load.
  useEffect(() => {
    if (initial) run(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParams(reg ? { reg } : {});
    run(reg);
  }

  function onTranscript(text: string) {
    const extracted = extractRegistrationFromSpeech(text);
    if (extracted) {
      setVoiceMsg(`Heard: "${text}" → ${extracted}`);
      setReg(extracted);
      setParams({ reg: extracted });
      run(extracted);
    } else {
      setVoiceMsg(`Couldn’t find a registration in: "${text}". Try saying "Check MOT for AB12 CDE".`);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Check a vehicle’s MOT</h1>
      <p className="mt-2 text-slate-600">
        Enter a UK registration, or use voice — try saying <em>“Check MOT for AB12 CDE”</em>.
      </p>

      <form onSubmit={onSubmit} className="mt-6 card p-5">
        <label className="label" htmlFor="reg">Registration number</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="reg"
            value={reg}
            onChange={(e) => setReg(e.target.value)}
            placeholder="AB12 CDE"
            className="input uppercase tracking-widest font-semibold"
            autoComplete="off"
          />
          <button type="submit" className="btn-primary">
            <Search className="w-4 h-4" /> Check MOT
          </button>
        </div>
        <div className="mt-3">
          <VoiceButton onTranscript={onTranscript} />
          {voiceMsg && <p className="mt-2 text-xs text-slate-500">{voiceMsg}</p>}
        </div>
      </form>

      <div className="mt-6">
        {loading && <LoadingSpinner label="Checking MOT…" />}
        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {data && !loading && <MotResultCard result={data.result} mockMode={data.mockMode} />}
      </div>
    </div>
  );
}
