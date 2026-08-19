import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';
import { EasterEggTrigger } from './EasterEggTrigger';
import { EasterEgg } from '../types';

interface GiftBoxSectionProps {
  onContinue: () => void;
  onDiscoverEgg?: (egg: EasterEgg) => void;
  discoveredEggs?: string[];
}

export const GiftBoxSection: React.FC<GiftBoxSectionProps> = ({
  onContinue,
  onDiscoverEgg,
  discoveredEggs = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [noteStep, setNoteStep] = useState<number>(0);

  const handleOpenGift = () => {
    if (isOpen) return;
    soundEngine.playUnwrapSound();
    setIsOpen(true);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22D3EE', '#3B82F6', '#CBD5E1', '#FFFFFF'],
      ticks: 150,
    });

    // Swift instant reveal of the playful note
    setNoteStep(3);
  };

  const handleSkipNote = () => {
    if (noteStep < 3) {
      setNoteStep(3);
    }
  };

  const handleContinue = () => {
    soundEngine.playBellChime(587.33, 0.15);
    onContinue();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 text-center select-none">
      <div className="max-w-xl z-10 w-full flex flex-col items-center">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/80 border border-[#2563EB]/30 text-[#22D3EE] text-xs tracking-widest uppercase mb-4 font-mono shadow-[0_0_15px_rgba(34,211,238,0.15)]"
        >
          <Gift className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>CHAPTER 4 • A SAFE SPACE</span>
        </motion.div>

        {/* Heading: "Not every birthday gift comes in a box." */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.04 }}
          className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#F8FAFC] mb-4"
        >
          Not every birthday gift comes in a box.
        </motion.h2>

        {/* Interactive 3D Gift Box */}
        <div className="relative my-4 flex flex-col items-center justify-center">
          {/* Cyan/Blue back aura */}
          <div
            className={`absolute w-64 h-64 rounded-full transition-all duration-700 pointer-events-none blur-3xl ${
              isOpen ? 'bg-cyan-500/25 scale-125' : 'bg-blue-600/15 scale-90'
            }`}
          />

          <div
            onClick={handleOpenGift}
            className="relative cursor-pointer group flex flex-col items-center select-none"
            id="interactive-gift-box"
          >
            {/* Gift Lid */}
            <motion.div
              animate={
                isOpen
                  ? { y: -80, rotate: -12, opacity: 0.95, scale: 1.05 }
                  : { y: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-20 w-44 sm:w-52 h-12 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-t-md border-t border-x border-cyan-400/40 shadow-xl flex items-center justify-center overflow-hidden"
            >
              {/* Ribbon Bow on Lid */}
              <div className="absolute -top-3 w-8 h-4 border-2 border-cyan-300 rounded-full bg-[#0B1B33] shadow-md shadow-cyan-400/30" />
              {/* Vertical Ribbon on Lid */}
              <div className="w-6 h-full bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-500 shadow-sm" />
              {/* Horizontal Silver Trim */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-300/40" />
            </motion.div>

            {/* Gift Body */}
            <div className="relative z-10 w-40 sm:w-48 h-36 bg-gradient-to-b from-[#0B1B33] via-[#0B1220] to-[#050A14] rounded-b-lg border-b border-x border-cyan-500/30 shadow-2xl shadow-black/80 flex items-center justify-center overflow-hidden -mt-1">
              {/* Vertical Ribbon on Body */}
              <div className="w-6 h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-700 shadow-inner" />
              {/* Horizontal Ribbon on Body */}
              <div className="absolute inset-x-0 h-6 bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-700 opacity-90" />

              {/* Radiant Light Beam when Open */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 via-sky-300/30 to-white/40 pointer-events-none flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-cyan-200 animate-pulse" />
                </motion.div>
              )}
            </div>

            {/* Pedestal shadow with hidden easter egg */}
            <div className="relative w-52 h-4 bg-black/60 rounded-full blur-md -mt-2 flex items-center justify-end">
              {onDiscoverEgg && (
                <div className="absolute -right-4 -bottom-2">
                  <EasterEggTrigger
                    id="egg-gift-ribbon"
                    onDiscover={onDiscoverEgg}
                    isDiscovered={discoveredEggs.includes('egg-gift-ribbon')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button & Revealed Playful Message */}
        <div className="mt-8 min-h-[190px] flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="open-gift-btn-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  id="open-the-gift-btn"
                  onClick={handleOpenGift}
                  className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0B1B33]/80 hover:bg-[#2563EB] text-[#F8FAFC] border border-[#2563EB]/40 hover:border-[#2563EB] font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 cursor-pointer"
                >
                  <span>Open it 🎁</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="gift-revealed-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={handleSkipNote}
                className="flex flex-col items-center w-full max-w-lg cursor-pointer"
                title={noteStep < 3 ? "Click to reveal full note" : ""}
              >
                {/* Playful Revealed Note Card */}
                <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#0B1B33]/85 border border-[#2563EB]/40 backdrop-blur-2xl shadow-2xl text-center space-y-3 mb-6">
                  {noteStep >= 1 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[#CBD5E1] text-base sm:text-lg font-light leading-relaxed"
                    >
                      "I couldn't exactly wrap a birthday surprise..."
                    </motion.p>
                  )}

                  {noteStep >= 2 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-white text-lg sm:text-xl font-medium leading-relaxed"
                    >
                      "So I made you a little corner of the internet instead. 😂"
                    </motion.p>
                  )}

                  {noteStep >= 3 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[#22D3EE] font-serif italic text-base sm:text-lg pt-1"
                    >
                      Pretty decent gift, right?
                    </motion.p>
                  )}
                </div>

                {noteStep >= 3 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    id="keep-going-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinue();
                    }}
                    className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-300 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
