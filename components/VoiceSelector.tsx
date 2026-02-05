
import React from 'react';
import { VoiceName } from '../types';

interface VoiceSelectorProps {
  value: VoiceName;
  onChange: (voice: VoiceName) => void;
  label?: string;
}

const VOICES: { name: VoiceName; desc: string }[] = [
  { name: 'Kore', desc: 'Warm & Professional' },
  { name: 'Puck', desc: 'Energetic & Youthful' },
  { name: 'Charon', desc: 'Deep & Authoritative' },
  { name: 'Fenrir', desc: 'Clear & Neutral' },
  { name: 'Zephyr', desc: 'Calm & Soothing' },
];

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ value, onChange, label }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {VOICES.map((v) => (
          <button
            key={v.name}
            onClick={() => onChange(v.name)}
            className={`p-3 rounded-xl border text-left transition-all hover:shadow-sm ${
              value === v.name
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`font-semibold text-sm ${value === v.name ? 'text-indigo-700' : 'text-slate-900'}`}>
              {v.name}
            </div>
            <div className="text-xs text-slate-500">{v.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
