
import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName, SpeakerConfig } from "../types";
import { decodeBase64, createWavBlob } from "../utils/audioUtils";

const API_KEY = process.env.API_KEY || '';

export async function generateAIText(
  prompt: string,
  mode: 'SINGLE' | 'MULTI',
  language: 'en' | 'ar',
  speakers: SpeakerConfig[]
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: `You are a creative writer. Generate a ${mode === 'SINGLE' ? 'monologue' : 'dialogue'} in ${language === 'en' ? 'English' : 'Arabic'}. 
      ${mode === 'MULTI' ? `The dialogue is between ${speakers[0].name} and ${speakers[1].name}. Format it as:
      ${speakers[0].name}: [text]
      ${speakers[1].name}: [text]` : 'Just provide the text for the monologue.'}
      Keep it concise (under 100 words).`,
    }
  });

  const response = await model;
  return response.text || '';
}

export async function generateTTS(
  text: string,
  mode: 'SINGLE' | 'MULTI',
  speakers: SpeakerConfig[],
  language: 'en' | 'ar'
): Promise<{ blob: Blob; url: string }> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const langContext = language === 'ar' 
    ? "The input is in Arabic. Please ensure correct pronunciation and accent." 
    : "The input is in English.";

  let config: any = {
    responseModalities: [Modality.AUDIO],
  };

  let prompt = text;

  if (mode === 'SINGLE') {
    config.speechConfig = {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: speakers[0].voice },
      },
    };
    prompt = `Convert the following text to speech. ${langContext}\n\nText: ${text}`;
  } else {
    // Multi-speaker mode (max 2)
    config.speechConfig = {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: speakers.map(s => ({
          speaker: s.name,
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: s.voice }
          }
        }))
      }
    };
    
    // In multi-speaker mode, we need a specific prompt format
    prompt = `TTS the following conversation between ${speakers[0].name} and ${speakers[1].name}. ${langContext}\n\n`;
    // We expect the user to have provided formatted text, but if not we try to guide it
    if (!text.includes(':')) {
       // Simple split for demo purposes if no speakers are tagged
       const lines = text.split('\n').filter(l => l.trim());
       lines.forEach((line, i) => {
         const speakerName = speakers[i % 2].name;
         prompt += `${speakerName}: ${line}\n`;
       });
    } else {
       prompt += text;
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config,
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received from Gemini API.");
    }

    const pcmBytes = decodeBase64(base64Audio);
    const wavBlob = createWavBlob(pcmBytes, 24000);
    const url = URL.createObjectURL(wavBlob);

    return { blob: wavBlob, url };
  } catch (error) {
    console.error("TTS Generation Error:", error);
    throw error;
  }
}
