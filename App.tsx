
import React, { useState, useCallback, useEffect } from 'react';
import { SpeakerConfig, TTSMode, Language, GeneratedAudio, VoiceName } from './types';
import { generateTTS } from './services/geminiService';
import { VoiceSelector } from './components/VoiceSelector';
import { 
  Play, 
  Download, 
  Trash2, 
  Languages, 
  Users, 
  User, 
  Mic2, 
  Settings2, 
  MessageSquareQuote,
  Loader2,
  Volume2,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<TTSMode>(TTSMode.SINGLE);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [speakers, setSpeakers] = useState<SpeakerConfig[]>([
    { id: '1', name: 'Speaker A', voice: 'Kore' },
    { id: '2', name: 'Speaker B', voice: 'Puck' },
  ]);
  const [loading, setLoading] = useState(false);
  const [audioResult, setAudioResult] = useState<GeneratedAudio | null>(null);
  const [history, setHistory] = useState<GeneratedAudio[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleVoiceChange = (index: number, voice: VoiceName) => {
    const newSpeakers = [...speakers];
    newSpeakers[index].voice = voice;
    setSpeakers(newSpeakers);
  };

  const handleNameChange = (index: number, name: string) => {
    const newSpeakers = [...speakers];
    newSpeakers[index].name = name;
    setSpeakers(newSpeakers);
  };

  const onGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter some text to convert.");
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      const activeSpeakers = mode === TTSMode.SINGLE ? [speakers[0]] : speakers;
      const result = await generateTTS(text, mode, activeSpeakers, language);
      
      const newAudio: GeneratedAudio = {
        ...result,
        timestamp: Date.now(),
        text: text.length > 50 ? text.substring(0, 47) + '...' : text,
        speakerCount: activeSpeakers.length
      };

      setAudioResult(newAudio);
      setHistory(prev => [newAudio, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to generate audio. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setAudioResult(null);
  };

  const exampleArabic = "مرحباً بكم في لومينا! نحن نقدم أفضل تقنية تحويل النص إلى كلام باللغة العربية والإنجليزية.";
  const exampleEnglish = "Welcome to Lumina TTS! We provide high-quality text-to-speech conversion for both English and Arabic.";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Mic2 size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Lumina <span className="text-indigo-600">TTS</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setLanguage(l => l === Language.ENGLISH ? Language.ARABIC : Language.ENGLISH)}
               className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors"
             >
               <Languages size={18} className="text-indigo-600" />
               {language === Language.ENGLISH ? 'English' : 'العربية'}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Controls */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings2 size={20} className="text-indigo-600" />
                Configuration
              </h2>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setMode(TTSMode.SINGLE)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === TTSMode.SINGLE ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                >
                  <User size={16} /> Solo
                </button>
                <button 
                  onClick={() => setMode(TTSMode.MULTI)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === TTSMode.MULTI ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                >
                  <Users size={16} /> Duo
                </button>
              </div>
            </div>

            {/* Voice Selectors */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">1</span>
                  <input 
                    type="text" 
                    value={speakers[0].name}
                    onChange={(e) => handleNameChange(0, e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-slate-700 placeholder:text-slate-300"
                    placeholder="Enter speaker name..."
                  />
                </div>
                <VoiceSelector value={speakers[0].voice} onChange={(v) => handleVoiceChange(0, v)} />
              </div>

              {mode === TTSMode.MULTI && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">2</span>
                    <input 
                      type="text" 
                      value={speakers[1].name}
                      onChange={(e) => handleNameChange(1, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-slate-700 placeholder:text-slate-300"
                      placeholder="Enter speaker name..."
                    />
                  </div>
                  <VoiceSelector value={speakers[1].voice} onChange={(v) => handleVoiceChange(1, v)} />
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquareQuote size={20} className="text-indigo-600" />
                Input Text
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setText(language === Language.ENGLISH ? exampleEnglish : exampleArabic)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Use Example
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                dir={language === Language.ARABIC ? 'rtl' : 'ltr'}
                className={`w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-slate-800 ${language === Language.ARABIC ? 'font-noto-arabic' : 'font-inter'}`}
                placeholder={mode === TTSMode.MULTI 
                  ? `${speakers[0].name}: Hello!\n${speakers[1].name}: Hi there, how are you?` 
                  : "Type something for Lumina to say..."}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                {text.length} characters
              </div>
            </div>

            {mode === TTSMode.MULTI && (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-amber-800 text-xs">
                <Info size={16} className="shrink-0" />
                <p>For best results in Duo mode, format your text as: <b>{speakers[0].name}: Hi</b> followed by <b>{speakers[1].name}: Hello</b> on a new line.</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={onGenerate}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Volume2 size={24} />
                  Convert to Speech
                </>
              )}
            </button>
          </section>
        </div>

        {/* Results and History */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Play size={20} className="text-indigo-600" />
              Latest Generation
            </h2>
            
            {audioResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <p className="text-sm text-slate-600 italic">"{audioResult.text}"</p>
                  <audio controls className="w-full h-10" src={audioResult.url} autoPlay />
                  <div className="flex gap-2">
                    <a 
                      href={audioResult.url} 
                      download={`lumina-tts-${Date.now()}.wav`}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <Download size={18} /> Download WAV
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                <Volume2 size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No audio generated yet</p>
              </div>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">History</h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                )}
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Your generation history is empty.</p>
                ) : (
                  history.map((item, idx) => (
                    <div key={item.timestamp} className="p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.speakerCount > 1 ? 'bg-pink-500' : 'bg-indigo-500'}`} />
                          <span className="text-xs font-medium text-slate-400">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <a 
                          href={item.url} 
                          download={`lumina-tts-${item.timestamp}.wav`}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-all"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                      <p className="text-sm text-slate-800 line-clamp-1 mb-2">{item.text}</p>
                      <audio controls className="w-full h-8 scale-90 -ml-2" src={item.url} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 py-3 px-4 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs text-slate-500">
          <p>© 2024 Lumina TTS Engine</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Gemini 2.5 Active</span>
            <span className="flex items-center gap-1 text-indigo-600 font-medium">Native PCM 24kHz</span>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default App;
