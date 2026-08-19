import { EasterEgg } from '../types';

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'egg-intro-star',
    number: 1,
    title: 'Secret Note #1',
    secretMessage: 'You actually found it. 😂',
    hint: 'A tiny shimmering star resting by the intro corner',
    location: 'Chapter 1: The Intro',
    iconName: 'sparkle',
  },
  {
    id: 'egg-gift-ribbon',
    number: 2,
    title: 'Secret Note #2',
    secretMessage: 'Yes, I really made all this for you.',
    hint: 'A tiny secret gleam beside the gift box base',
    location: 'Chapter 4: The Gift',
    iconName: 'gift',
  },
  {
    id: 'egg-things-spark',
    number: 3,
    title: 'Secret Note #3',
    secretMessage: 'Okay, you definitely explored everything.',
    hint: 'A small glowing seal beneath the cards',
    location: 'Chapter 6: Little Things',
    iconName: 'bookmark',
  },
  {
    id: 'egg-sky-star',
    number: 4,
    title: 'Secret Note #4',
    secretMessage: 'Still looking? 👀',
    hint: 'A faint star in the deep cosmic background',
    location: 'Chapter 7: The Night Sky',
    iconName: 'nebula',
  },
  {
    id: 'egg-letter-seal',
    number: 5,
    title: 'Secret Note #5',
    secretMessage: "You're probably smiling right now. I hope so.",
    hint: 'A secret watermark hidden near the letter',
    location: 'Chapter 5: The Letter',
    iconName: 'feather',
  },
];

export const getEasterEggById = (id: string): EasterEgg | undefined => {
  return EASTER_EGGS.find((egg) => egg.id === id);
};

export const getEasterEggStorage = (): string[] => {
  try {
    const saved = localStorage.getItem('adnan_birthday_easter_eggs');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveEasterEggDiscovery = (id: string): string[] => {
  try {
    const current = getEasterEggStorage();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem('adnan_birthday_easter_eggs', JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch {
    return [id];
  }
};

