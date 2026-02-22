
import React from 'react';
import { VoiceName, Gender } from '../types';

interface VoiceSelectorProps {
  value: VoiceName;
  onChange: (voice: VoiceName) => void;
  label?: string;
  genderFilter?: Gender;
}

const VOICES: { name: VoiceName; desc: string; gender: Gender }[] = [
  { name: 'Kore', desc: 'Warm & Professional', gender: 'female' },
  { name: 'Puck', desc: 'Energetic & Youthful', gender: 'male' },
  { name: 'Charon', desc: 'Deep & Authoritative', gender: 'male' },
  { name: 'Fenrir', desc: 'Clear & Neutral', gender: 'male' },
  { name: 'Zephyr', desc: 'Calm & Soothing', gender: 'female' },
];

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ value, onChange, label, genderFilter }) => {
  const filteredVoices = genderFilter ? VOICES.filter(v => v.gender === genderFilter) : VOICES;

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {filteredVoices.map((v) => (
          <button
            key={v.name}
            type="button"
            onClick={() => onChange(v.name)}
            className={`p-3 rounded-xl border text-left transition-all hover:shadow-sm ${
              value === v.name
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className={`font-semibold text-sm ${value === v.name ? 'text-indigo-700' : 'text-slate-900'}`}>
                {v.name}
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold ${v.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {v.gender}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{v.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
