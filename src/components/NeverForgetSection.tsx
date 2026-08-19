import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Sparkles, ArrowRight, Compass, Shield, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';
import { EasterEgg } from '../types';
import { EasterEggTrigger } from './EasterEggTrigger';

interface NeverForgetSectionProps {
  onContinue: () => void;
  onDiscoverEgg?: (egg: EasterEgg) => void;
  discoveredEggs?: string[];
}

interface ReminderCard {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
  accent: string;
}

export const NeverForgetSection: React.FC<NeverForgetSectionProps> = ({
  onContinue,
  onDiscoverEgg,
  discoveredEggs = [],
}) => {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const cards: ReminderCard[] = [
    {
      id: 1,
      title: '01 FOR YOU',
      message: 'I know you have big dreams.\nKeep going. Even on the days you feel tired,\nsmall progress is still progress.',
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      accent: 'border-l-[#22D3EE]',
    },
    {
      id: 2,
      title: '02 FROM ME',
      message: "You don't have to be okay all the time.\nBad days are allowed.\nJust remember I'm here, even from far away.",
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      accent: 'border-l-[#3B82F6]',
    },
    {
      id: 3,
      title: '03 FOR US',
      message: "Don't lose yourself while waiting for 'us'.\nI'm becoming better too.\nSo that when we meet, we meet as our best versions.",
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      accent: 'border-l-[#F43F5E]',
    },
  ];

  const handleCardClick = (id: number, event: React.MouseEvent) => {
    soundEngine.playStarClickSound();
    setSelectedCardId(selectedCardId === id ? null : id);

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 16,
      spread: 45,
      origin: { x, y },
      colors: ['#22D3EE', '#3B82F6', '#CBD5E1'],
      ticks: 120,
      scalar: 0.7,
    });
  };

  const handleContinue = () => {
    soundEngine.playBellChime(587.33, 0.15);
    onContinue();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center select-none">
      <div className="max-w-4xl z-10 w-full flex flex-col items-center">
        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/80 border border-[#2563EB]/30 text-[#22D3EE] text-xs tracking-widest uppercase mb-4 font-mono shadow-[0_0_15px_rgba(34,211,238,0.15)]"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>CHAPTER 6 • THREE REMINDERS</span>
        </motion.div>

        {/* Heading: "A few things to keep with you..." */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-white mb-10"
        >
          A few things to keep with you...
        </motion.h2>

        {/* 3 Minimal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
          {cards.map((card, idx) => {
            const isExpanded = selectedCardId === card.id;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.04 * idx }}
                whileHover={{ y: -4, scale: 1.02 }}
                id={`never-forget-card-${card.id}`}
                onClick={(e) => handleCardClick(card.id, e)}
                className={`relative group rounded-2xl p-7 text-left cursor-pointer transition-all duration-300 border border-l-4 ${card.accent} overflow-hidden backdrop-blur-xl ${
                  isExpanded
                    ? 'bg-[#0B1B33]/90 border-[#22D3EE]/60 shadow-[0_0_25px_rgba(34,211,238,0.25)] ring-1 ring-[#22D3EE]/30'
                    : 'bg-[#0B1B33]/45 hover:bg-[#0B1B33]/70 border-[#2563EB]/25 hover:border-[#22D3EE]/40 shadow-lg shadow-black/40'
                }`}
              >
                {/* Background glow node */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#2563EB]/10 rounded-full blur-xl group-hover:bg-[#22D3EE]/15 pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#050A14]/70 border border-[#2563EB]/30 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <span className="text-xs font-mono text-[#CBD5E1]/40">
                    0{card.id}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#22D3EE] mb-3 font-mono">
                  {card.title}
                </h3>

                <p className="text-sm sm:text-base font-normal text-[#F8FAFC] leading-relaxed font-poppins whitespace-pre-line">
                  "{card.message}"
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Hidden Easter Egg 3 */}
        {onDiscoverEgg && (
          <div className="mb-6">
            <EasterEggTrigger
              id="egg-things-spark"
              onDiscover={onDiscoverEgg}
              isDiscovered={discoveredEggs.includes('egg-things-spark')}
            />
          </div>
        )}

        {/* Action Button */}
        <div className="min-h-[60px] flex flex-col items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            id="continue-to-sky-btn"
            onClick={handleContinue}
            className="group inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
