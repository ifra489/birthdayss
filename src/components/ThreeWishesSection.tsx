import React from 'react';
import { INoticeSection } from './INoticeSection';
import { EasterEgg } from '../types';

interface ThreeWishesSectionProps {
  onContinue: () => void;
  onDiscoverEgg?: (egg: EasterEgg) => void;
  discoveredEggs?: string[];
}

export const ThreeWishesSection: React.FC<ThreeWishesSectionProps> = (props) => {
  return <INoticeSection {...props} />;
};

