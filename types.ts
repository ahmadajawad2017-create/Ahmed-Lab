
export type VoiceName = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';

export type Gender = 'male' | 'female';

export interface SpeakerConfig {
  id: string;
  name: string;
  voice: VoiceName;
  gender: Gender;
}

export enum TTSMode {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI'
}

export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar'
}

export interface GeneratedAudio {
  url: string;
  blob: Blob;
  timestamp: number;
  text: string;
  speakerCount: number;
}
