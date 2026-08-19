export type SectionId = 
  | 'intro'
  | 'reveal'
  | 'wishes'
  | 'gift'
  | 'letter'
  | 'never-forget'
  | 'night-sky'
  | 'choice'
  | 'heart-message'
  | 'finale';

export type ParticleIntensity = 'low' | 'normal' | 'cinematic';

export interface EasterEgg {
  id: string;
  number: number;
  title: string;
  secretMessage: string;
  hint: string;
  location: string;
  iconName: 'compass' | 'flame' | 'crescent' | 'feather' | 'nebula' | 'sparkle' | 'gift' | 'bookmark';
}

export interface WishCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'briefcase' | 'moon' | 'star';
  message: string;
  arabicPhrase?: string;
  details: string;
}

export interface NeverForgetCard {
  id: number;
  message: string;
  expandedContext: string;
  subtext: string;
}

export interface SkyStar {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
  word: string;
  arabic: string;
  meaning: string;
  isClicked: boolean;
}

export interface SoundState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}
