import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Compass, Moon } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { EasterEggTrigger } from './EasterEggTrigger';
import { EasterEgg } from '../types';

interface IntroSectionProps {
  onEnter: () => void;
  onDiscoverEgg?: (egg: EasterEgg) => void;
  discoveredEggs?: string[];
}

export const IntroSection: React.FC<IntroSectionProps> = ({
  onEnter,
  onDiscoverEgg,
  discoveredEggs = [],
}) => {
  const [phase, setPhase] = useState<'mystery' | 'cinematic'>('mystery');
  const [cinematicStep, setCinematicStep] = useState<number>(0);

  const handleStartEntrance = () => {
    soundEngine.playBellChime(523.25, 0.2);
    soundEngine.startMusic();
    setPhase('cinematic');
  };

  useEffect(() => {
    if (phase === 'cinematic') {
      const t1 = setTimeout(() => setCinematicStep((prev) => Math.max(prev, 1)), 60);
      const t2 = setTimeout(() => setCinematicStep((prev) => Math.max(prev, 2)), 500);
      const t3 = setTimeout(() => setCinematicStep(3), 950);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [phase]);

  // Allow clicking anywhere in cinematic phase to instantly reveal all text & continue button
  const handleSkipCinematic = () => {
    if (phase === 'cinematic' && cinematicStep < 3) {
      setCinematicStep(3);
    }
  };

  const handleProceedToNext = () => {
    soundEngine.playBellChime(587.33, 0.18);
    soundEngine.startMusic();
    onEnter();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none -top-20 left-1/2 -translate-x-1/2" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none -bottom-20 left-1/2 -translate-x-1/2" />

      <div className="max-w-xl z-10 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === 'mystery' ? (
            <motion.div
              key="mystery-entrance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center w-full"
            >
              {/* Subtle decorative badge with hidden easter egg */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1220]/70 border border-[#2563EB]/30 text-[#22D3EE] text-[10px] tracking-[0.3em] uppercase font-mono mb-10 backdrop-blur-md relative"
              >
                <Moon className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
                <span>Chapter 1 • Mystery</span>
                {onDiscoverEgg && (
                  <div className="ml-1 pl-1 border-l border-[#2563EB]/40">
                    <EasterEggTrigger
                      id="egg-intro-star"
                      onDiscover={onDiscoverEgg}
                      isDiscovered={discoveredEggs.includes('egg-intro-star')}
                    />
                  </div>
                )}
              </motion.div>

              {/* Main Line 1: "Hey Adnan..." */}
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-[#F8FAFC] mb-4 tracking-tight"
              >
                Hey Adnan...
              </motion.h1>

              {/* Line 2: "Something was made just for you." */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
                className="text-lg sm:text-2xl text-[#CBD5E1]/90 font-light max-w-md mx-auto leading-relaxed mb-10"
              >
                Something was made just for you.
              </motion.p>

              {/* Interactive Glowing Entrance Orb */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative my-4 flex flex-col items-center justify-center cursor-pointer group"
                onClick={handleStartEntrance}
              >
                {/* Outer pulsing halo */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#2563EB]/30 via-[#22D3EE]/20 to-transparent blur-md group-hover:scale-125 transition-transform duration-700 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-[#0B1B33] via-[#0F172A] to-[#0B1220] border border-[#22D3EE]/60 shadow-[0_0_25px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_35px_rgba(34,211,238,0.7)] group-hover:border-[#22D3EE] flex items-center justify-center transition-all duration-300">
                    <Sparkles className="w-7 h-7 text-[#22D3EE] group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>

              {/* Enter Button */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="mt-6"
              >
                <button
                  id="enter-surprise-btn"
                  onClick={handleStartEntrance}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-cyan-400/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span className="relative z-10">Step Inside</span>
                  <ArrowRight className="relative z-10 w-3.5 h-3.5 text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </motion.div>

              {/* Quiet footnote */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-10 text-xs text-slate-400 tracking-wider font-light"
              >
                Turn on your audio for the best experience 🌙
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="cinematic-prologue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={handleSkipCinematic}
              className="flex flex-col items-center justify-center min-h-[380px] space-y-6 max-w-lg cursor-pointer"
              title={cinematicStep < 3 ? "Click to reveal text instantly" : ""}
            >
              {cinematicStep >= 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif italic text-2xl sm:text-3xl text-[#CBD5E1] tracking-wide"
                >
                  "This isn't just another birthday message."
                </motion.p>
              )}

              {cinematicStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="pt-2"
                >
                  <p className="text-xl sm:text-2xl text-[#F8FAFC] font-light leading-relaxed">
                    It's a little piece of my heart, made <span className="text-[#22D3EE] font-medium">just for you</span>.
                  </p>
                </motion.div>
              )}

              {cinematicStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="pt-8"
                >
                  <button
                    id="cinematic-proceed-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceedToNext();
                    }}
                    className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-cyan-400/40 transition-all duration-300 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
