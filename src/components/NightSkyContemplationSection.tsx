import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, ArrowRight, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';
import { EasterEgg } from '../types';
import { EasterEggTrigger } from './EasterEggTrigger';

interface SkyBlessingStar {
  id: number;
  label: string;
  arabic: string;
  detail: string;
  isClicked: boolean;
  x: number; // percentage in constellation box
  y: number; // percentage in constellation box
}

interface NightSkyContemplationSectionProps {
  onContinue: () => void;
  onDiscoverEgg?: (egg: EasterEgg) => void;
  discoveredEggs?: string[];
}

export const NightSkyContemplationSection: React.FC<NightSkyContemplationSectionProps> = ({
  onContinue,
  onDiscoverEgg,
  discoveredEggs = [],
}) => {
  const initialStars: SkyBlessingStar[] = [
    {
      id: 1,
      label: 'SUCCESS',
      arabic: 'نجاح',
      detail: 'May your efforts bear fruit.',
      isClicked: false,
      x: 14,
      y: 38,
    },
    {
      id: 2,
      label: 'HEALTH',
      arabic: 'صحة',
      detail: 'May Allah give you strength and good health.\nStay healthy for me, okay? I need you for a long time.',
      isClicked: false,
      x: 26,
      y: 68,
    },
    {
      id: 3,
      label: 'PEACE',
      arabic: 'سلام',
      detail: 'May your heart always find peace.\nEven on stressful days, may you feel calm inside.',
      isClicked: false,
      x: 39,
      y: 28,
    },
    {
      id: 4,
      label: 'LOVE',
      arabic: 'حب',
      detail: 'May our love keep growing,\neven with the distance between us.\nMay Allah make our meeting easy.',
      isClicked: false,
      x: 50,
      y: 72,
    },
    {
      id: 5,
      label: 'GUIDANCE',
      arabic: 'هداية',
      detail: 'May Allah guide you in every decision you take.\nMay He put barakah in your path and your dreams.',
      isClicked: false,
      x: 62,
      y: 32,
    },
    {
      id: 6,
      label: 'HAPPINESS',
      arabic: 'سعادة',
      detail: 'May you always have reasons to smile.\nMay life surprise you with good things.\nYou deserve all the happiness in the world.',
      isClicked: false,
      x: 74,
      y: 66,
    },
    {
      id: 7,
      label: 'US',
      arabic: 'نحن',
      detail: 'May the day come soon when we meet.\nMay Allah bring us together in halal and make it permanent.\nAmeen.',
      isClicked: false,
      x: 86,
      y: 36,
    },
  ];

  const [stars, setStars] = useState<SkyBlessingStar[]>(initialStars);
  const [activeStar, setActiveStar] = useState<SkyBlessingStar | null>(null);

  const discoveredCount = stars.filter((s) => s.isClicked).length;
  const allDiscovered = discoveredCount === 7;

  const handleStarClick = (star: SkyBlessingStar) => {
    // Play subtle high-pitched crystalline star chime
    soundEngine.playStarChime(star.id - 1);
    setActiveStar(star);

    setStars((prev) =>
      prev.map((s) => (s.id === star.id ? { ...s, isClicked: true } : s))
    );

    if (discoveredCount === 6 && !star.isClicked) {
      // 7th star clicked -> Trigger deeper resonant synth chord for constellation completion & soft burst
      setTimeout(() => {
        soundEngine.playConstellationCompleteChord();
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#22D3EE', '#F8FAFC', '#38BDF8', '#60A5FA'],
          scalar: 0.8,
          ticks: 90,
        });
      }, 50);
    }
  };

  const handleRevealAll = () => {
    soundEngine.playConstellationCompleteChord();
    setStars((prev) => prev.map((s) => ({ ...s, isClicked: true })));
    setActiveStar(stars[6]);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#22D3EE', '#F8FAFC', '#38BDF8', '#60A5FA'],
      scalar: 0.8,
      ticks: 90,
    });
  };

  const handleContinue = () => {
    if (!allDiscovered) return;
    soundEngine.playBellChime(587.33, 0.15);
    onContinue();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center select-none">
      <div className="max-w-4xl z-10 w-full flex flex-col items-center">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/80 border border-[#2563EB]/30 text-[#22D3EE] text-xs tracking-widest uppercase mb-4 font-mono shadow-[0_0_15px_rgba(34,211,238,0.15)]"
        >
          <Compass className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>CHAPTER 7 • SEVEN DUAS</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide text-white mb-2"
        >
          Seven Stars. Seven Duas.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="text-slate-400 text-sm sm:text-base font-light max-w-lg mb-6"
        >
          Tap each glowing star in the night sky to reveal its blessing.
        </motion.p>

        {/* Celestial Night Sky Canvas Viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="w-full max-w-3xl relative bg-[#060D1A]/85 border border-[#2563EB]/40 rounded-3xl p-4 sm:p-6 backdrop-blur-2xl mb-8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(37,99,235,0.2)]"
        >
          {/* Header Progress Counter */}
          <div className="flex items-center justify-between mb-3 px-2 text-xs text-[#CBD5E1]/70">
            <span className="flex items-center gap-1.5 text-[#22D3EE] font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{discoveredCount}/7 Stars Discovered</span>
            </span>

            {/* Secret Easter Egg */}
            {onDiscoverEgg && (
              <EasterEggTrigger
                id="egg-sky-star"
                onDiscover={onDiscoverEgg}
                isDiscovered={discoveredEggs.includes('egg-sky-star')}
              />
            )}
          </div>

          {/* Interactive Celestial Sky Field Box */}
          <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl bg-gradient-to-b from-[#0B1528] via-[#060D1A] to-[#02050D] border border-[#2563EB]/25 overflow-hidden flex items-center justify-center">
            {/* Background Twinkling Dots */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* SVG Connecting Constellation Lines between discovered stars */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {stars.map((star, idx) => {
                if (idx === 0) return null;
                const prevStar = stars[idx - 1];
                const isLineActive = star.isClicked && prevStar.isClicked;

                return (
                  <motion.line
                    key={`line-${prevStar.id}-${star.id}`}
                    x1={`${prevStar.x}%`}
                    y1={`${prevStar.y}%`}
                    x2={`${star.x}%`}
                    y2={`${star.y}%`}
                    stroke={isLineActive ? '#22D3EE' : 'rgba(37, 99, 235, 0.15)'}
                    strokeWidth={isLineActive ? (allDiscovered ? '2.5' : '1.5') : '1'}
                    strokeDasharray={isLineActive ? 'none' : '4 4'}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                );
              })}
            </svg>

            {/* 7 Positioned Glowing Stars */}
            {stars.map((star) => (
              <button
                key={star.id}
                id={`sky-star-point-${star.id}`}
                onClick={() => handleStarClick(star)}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer p-2 focus:outline-none"
                title={`${star.label} (${star.arabic})`}
              >
                {/* Glowing Outer Ring */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    star.isClicked
                      ? 'bg-[#22D3EE]/20 border-2 border-[#22D3EE] shadow-[0_0_20px_#22d3ee] scale-110'
                      : 'bg-[#0B1B33]/80 border border-[#2563EB]/50 group-hover:border-[#22D3EE] group-hover:scale-125'
                  }`}
                >
                  <Star
                    className={`w-4 h-4 transition-all duration-300 ${
                      star.isClicked
                        ? 'text-[#22D3EE] fill-[#22D3EE]'
                        : 'text-[#CBD5E1]/60 group-hover:text-[#22D3EE]'
                    }`}
                  />
                </div>

                {/* Star Label Tag */}
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                      star.isClicked
                        ? 'text-[#22D3EE] bg-[#060D1A]/90 border border-[#22D3EE]/40'
                        : 'text-[#94A3B8]/70 bg-[#060D1A]/70'
                    }`}
                  >
                    {star.isClicked ? `${star.label} • ${star.arabic}` : `★ 0${star.id}`}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Star Card */}
          <AnimatePresence mode="wait">
            {activeStar && (
              <motion.div
                key={activeStar.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 rounded-xl bg-[#081222] border border-[#22D3EE]/40 text-center shadow-lg"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#22D3EE] font-bold">
                    ★ {activeStar.label}
                  </span>
                  <span className="text-xs font-mono text-cyan-200 px-2 py-0.5 rounded bg-[#0B1B33] border border-[#2563EB]/40">
                    {activeStar.arabic}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#CBD5E1] font-normal font-poppins leading-relaxed whitespace-pre-line">
                  "{activeStar.detail}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Special ADNAN Constellation Formation when all 7 are unlocked */}
          <AnimatePresence>
            {allDiscovered && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1 }}
                className="mt-6 pt-6 border-t border-[#2563EB]/30 flex flex-col items-center"
              >
                {/* Visual ADNAN Star Map Title */}
                <div className="py-2 px-6 rounded-full bg-[#050A14]/90 border border-[#22D3EE]/50 shadow-[0_0_25px_rgba(34,211,238,0.3)] mb-4">
                  <span className="font-cinzel tracking-[0.3em] text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400">
                    CONSTELLATION: ADNAN
                  </span>
                </div>

                <div className="space-y-1.5 font-serif italic text-base sm:text-lg text-[#CBD5E1] py-2">
                  <p className="text-white font-medium">"Seven stars."</p>
                  <p className="text-[#22D3EE] font-medium">"Seven duas."</p>
                  <p className="text-cyan-100 font-medium">"One birthday."</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Continue Button & Discovery Prompt */}
        <div className="min-h-[60px] flex flex-col items-center justify-center gap-2">
          {!allDiscovered ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0B1220]/80 border border-[#2563EB]/30 text-[#CBD5E1]/70 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Tap all 7 stars to light the constellation ({discoveredCount}/7)</span>
              </div>
              <button
                onClick={handleRevealAll}
                className="text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
              >
                Reveal all 7 duas →
              </button>
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              id="continue-to-choice-btn"
              onClick={handleContinue}
              className="group inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
