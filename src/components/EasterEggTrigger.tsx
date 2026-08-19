import React from 'react';
import { motion } from 'motion/react';
import { Compass, Flame, Moon, Feather, Orbit, Sparkles } from 'lucide-react';
import { getEasterEggById } from '../utils/easterEggs';
import { soundEngine } from '../utils/soundEngine';
import { EasterEgg } from '../types';

interface EasterEggTriggerProps {
  id: string;
  className?: string;
  onDiscover: (egg: EasterEgg) => void;
  isDiscovered?: boolean;
}

export const EasterEggTrigger: React.FC<EasterEggTriggerProps> = ({
  id,
  className = '',
  onDiscover,
  isDiscovered = false,
}) => {
  const egg = getEasterEggById(id);
  if (!egg) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playSecretSound();
    onDiscover(egg);
  };

  const renderIcon = () => {
    switch (egg.iconName) {
      case 'compass':
        return (
          <Compass className="w-3.5 h-3.5 text-[#22D3EE]/80 group-hover:text-[#22D3EE] group-hover:rotate-45 transition-transform duration-500" />
        );
      case 'flame':
        return (
          <Flame className="w-3.5 h-3.5 text-[#FDE047]/80 group-hover:text-[#FDE047] group-hover:scale-125 transition-transform duration-300" />
        );
      case 'crescent':
        return (
          <Moon className="w-3.5 h-3.5 text-[#93C5FD]/80 group-hover:text-[#93C5FD] group-hover:rotate-12 transition-transform duration-300" />
        );
      case 'feather':
        return (
          <Feather className="w-3.5 h-3.5 text-[#C084FC]/80 group-hover:text-[#C084FC] group-hover:rotate-[-20deg] transition-transform duration-300" />
        );
      case 'nebula':
        return (
          <Orbit className="w-3.5 h-3.5 text-[#38BDF8]/80 group-hover:text-[#38BDF8] animate-spin" style={{ animationDuration: '6s' }} />
        );
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]/80" />;
    }
  };

  return (
    <motion.button
      type="button"
      id={`easter-egg-trigger-${id}`}
      onClick={handleClick}
      whileHover={{ scale: 1.25 }}
      whileTap={{ scale: 0.9 }}
      className={`group relative p-1.5 rounded-full backdrop-blur-sm cursor-pointer transition-all duration-300 ${
        isDiscovered
          ? 'bg-[#2563EB]/20 border border-[#22D3EE]/40 text-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.3)]'
          : 'bg-[#0B1220]/40 hover:bg-[#0B1B33]/80 border border-[#2563EB]/20 hover:border-[#22D3EE]/60 text-[#CBD5E1]/60 hover:text-white shadow-sm'
      } ${className}`}
      title={isDiscovered ? `Secret Note #${egg.number}: ${egg.title}` : 'Tap to reveal secret detail'}
      aria-label={`Secret easter egg: ${egg.title}`}
    >
      {renderIcon()}

      {/* Gentle Pulsing halo when not yet discovered */}
      {!isDiscovered && (
        <span className="absolute inset-0 rounded-full bg-[#22D3EE]/20 animate-ping opacity-75 pointer-events-none" />
      )}
    </motion.button>
  );
};
