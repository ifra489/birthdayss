import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Flame, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';
import { EasterEggTrigger } from './EasterEggTrigger';
import { EasterEgg } from '../types';

interface BirthdayRevealSectionProps {
  onContinue: () => void;
  onDiscoverEgg?: (egg: EasterEgg) => void;
  discoveredEggs?: string[];
}

interface Balloon {
  id: number;
  x: number; // percentage across screen 5% to 95%
  delay: number; // in seconds
  duration: number; // in seconds
  size: number; // in px
  colorType: 'cyan' | 'electric-blue' | 'silver' | 'deep-navy' | 'platinum';
  swayAmount: number;
  popped: boolean;
}

export const BirthdayRevealSection: React.FC<BirthdayRevealSectionProps> = ({
  onContinue,
  onDiscoverEgg,
  discoveredEggs = [],
}) => {
  const [isWished, setIsWished] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [sparkleBurst, setSparkleBurst] = useState(false);

  // Generate 5 lightweight floating metallic balloons when candle is blown
  const spawnBalloons = () => {
    const colorTypes: Balloon['colorType'][] = [
      'cyan',
      'electric-blue',
      'silver',
      'deep-navy',
      'platinum',
    ];

    const generated: Balloon[] = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: 12 + i * 19,
      delay: i * 0.15,
      duration: 7 + i * 1.2,
      size: 50 + (i % 2) * 10,
      colorType: colorTypes[i],
      swayAmount: 15,
      popped: false,
    }));

    setBalloons(generated);
  };

  const handlePopBalloon = (id: number, e: React.MouseEvent) => {
    soundEngine.playBellChime(880 + Math.random() * 450, 0.14);
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 16,
      spread: 45,
      origin: { x, y },
      colors: ['#22D3EE', '#3B82F6', '#CBD5E1', '#FFFFFF'],
      ticks: 80,
      scalar: 0.7,
    });
  };

  const triggerCelebrationFireworks = () => {
    // Single crisp, lag-free confetti burst
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.60 },
      colors: ['#22D3EE', '#3B82F6', '#CBD5E1', '#FFFFFF', '#60A5FA'],
      scalar: 0.85,
      ticks: 120,
    });
  };

  const handleMakeWish = () => {
    if (isWished || isBlowing) return;
    setIsBlowing(true);
    soundEngine.playCandleBlowOut();

    setTimeout(() => {
      setIsWished(true);
      setIsBlowing(false);
      setSparkleBurst(true);
      triggerCelebrationFireworks();
      spawnBalloons();
    }, 120);
  };

  const handleCakeTouch = () => {
    if (!isWished) {
      soundEngine.playBellChime(1046.5, 0.1);
      handleMakeWish();
    }
  };

  const handleContinue = () => {
    soundEngine.playBellChime(587.33, 0.15);
    onContinue();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-16 text-center select-none overflow-hidden">
      {/* Floating Midnight Metallic Balloons Layer */}
      {isWished && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
          {balloons.map((balloon) => {
            if (balloon.popped) return null;

            // Style gradient based on metallic palette
            let gradientClass =
              'bg-[radial-gradient(circle_at_35%_28%,#E2E8F0,#38BDF8,#1E3A8A,#080E1A)]';
            let shadowColor = 'rgba(34,211,238,0.4)';

            if (balloon.colorType === 'electric-blue') {
              gradientClass =
                'bg-[radial-gradient(circle_at_35%_28%,#93C5FD,#2563EB,#1E3A8A,#050A14)]';
              shadowColor = 'rgba(37,99,235,0.45)';
            } else if (balloon.colorType === 'silver' || balloon.colorType === 'platinum') {
              gradientClass =
                'bg-[radial-gradient(circle_at_35%_28%,#FFFFFF,#E2E8F0,#94A3B8,#1E293B)]';
              shadowColor = 'rgba(203,213,225,0.4)';
            } else if (balloon.colorType === 'deep-navy') {
              gradientClass =
                'bg-[radial-gradient(circle_at_35%_28%,#60A5FA,#1E293B,#0B1B33,#02050D)]';
              shadowColor = 'rgba(30,58,138,0.4)';
            }

            return (
              <motion.div
                key={balloon.id}
                initial={{
                  y: '105vh',
                  x: `${balloon.x}vw`,
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  y: '-25vh',
                  opacity: [0, 0.95, 0.95, 0],
                  scale: 1,
                }}
                transition={{
                  duration: balloon.duration,
                  delay: balloon.delay,
                  ease: 'easeOut',
                }}
                onClick={(e) => handlePopBalloon(balloon.id, e)}
                style={{ width: balloon.size, height: balloon.size * 1.25 }}
                className="absolute pointer-events-auto cursor-pointer group will-change-transform transform-gpu"
                title="Pop balloon!"
              >
                {/* Balloon Body */}
                <div
                  className={`w-full h-full rounded-[50%_50%_50%_50%/60%_60%_40%_40%] ${gradientClass} border border-white/20 relative shadow-md group-hover:scale-105 transition-transform`}
                >
                  {/* High Gloss Specular Reflection */}
                  <div className="absolute top-2 left-2.5 w-3.5 h-6 bg-white/40 rounded-full rotate-[-25deg]" />
                  <div className="absolute top-3 left-4 w-1.5 h-2.5 bg-white/60 rounded-full rotate-[-25deg]" />

                  {/* Balloon Knot */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-[#0B1528] rounded-b-sm border-t border-cyan-400/40" />

                  {/* Silvery String */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1px] h-20 sm:h-28 bg-gradient-to-b from-cyan-300/60 via-slate-400/30 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="max-w-2xl z-10 flex flex-col items-center">
        {/* Subtitle tag */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/80 border border-[#2563EB]/30 text-[#22D3EE] text-xs tracking-widest uppercase mb-4 font-mono shadow-[0_0_15px_rgba(34,211,238,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>CHAPTER 2 • HAPPY BIRTHDAY</span>
        </motion.div>

        {/* Heading: "Okay... now we can finally say it." */}
        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#CBD5E1] mb-2 tracking-wide"
        >
          Okay... now we can finally say it.
        </motion.h3>

        {/* Big Reveal: "HAPPY BIRTHDAY, ADNAN 🎂" */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-white mb-3"
        >
          HAPPY BIRTHDAY,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-300">
            ADNAN 🎂
          </span>
        </motion.h2>

        {/* Prompt: "Make a wish." */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="text-base sm:text-lg text-cyan-300 font-light mb-6"
        >
          Make a wish.
        </motion.p>

        {/* Beautiful Architectural Midnight Luxury Cake with Candle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          onClick={handleCakeTouch}
          className="relative my-4 flex flex-col items-center justify-center cursor-pointer group"
          title={!isWished ? 'Click cake to blow out candle' : ''}
        >
          {/* Ambient Blue/Cyan Halo around Cake */}
          <div
            className={`absolute w-72 h-72 rounded-full blur-3xl -z-10 pointer-events-none transition-all duration-700 ${
              isWished ? 'bg-cyan-500/20 scale-125' : 'bg-blue-600/15 scale-100 group-hover:bg-cyan-500/25'
            }`}
          />

          {/* Candle Section */}
          <div className="relative flex flex-col items-center z-20">
            {/* Candle Flame / Smoke */}
            <div className="h-16 flex items-end justify-center mb-1">
              {!isWished && !isBlowing && (
                <div className="relative flex flex-col items-center animate-candle">
                  {/* Outer atmospheric aura */}
                  <div className="absolute -top-3 w-8 h-10 rounded-full bg-cyan-400/25 blur-sm animate-pulse" />
                  {/* Glowing Flame Body */}
                  <div className="w-4 h-7 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] bg-gradient-to-t from-cyan-400 via-sky-200 to-white shadow-[0_0_18px_#22d3ee,0_0_35px_#3b82f6]" />
                  {/* Bright inner white core */}
                  <div className="w-1.5 h-3.5 rounded-full bg-white -mt-4 blur-[0.5px]" />
                </div>
              )}

              {isBlowing && (
                <motion.div
                  initial={{ opacity: 1, scaleY: 1 }}
                  animate={{ opacity: 0, scaleY: 0.2, y: -12, x: 8 }}
                  transition={{ duration: 0.8 }}
                  className="w-3.5 h-6 rounded-full bg-cyan-200 blur-[2px]"
                />
              )}

              {isWished && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    y: -38,
                    x: [0, 10, -8, 12],
                  }}
                  transition={{ duration: 2.8, ease: 'easeOut' }}
                  className="flex flex-col items-center"
                >
                  <div className="w-2 h-8 bg-gradient-to-t from-slate-400 to-transparent blur-[1.5px] rounded-full" />
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300/80 -mt-2 animate-pulse" />
                </motion.div>
              )}
            </div>

            {/* Candle Wick */}
            <div className="w-1 h-2.5 bg-slate-700 rounded-t" />

            {/* Candle Body: Luxurious silver & cyan spiral cylinder */}
            <div className="w-4 h-14 bg-gradient-to-b from-[#E2E8F0] via-[#BAE6FD] to-[#94A3B8] rounded-sm shadow-md border border-cyan-300/50 relative overflow-hidden group-hover:border-cyan-300 transition-colors">
              {/* Metallic spiral groove */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(37,99,235,0.3)_50%,transparent_75%)] bg-[length:7px_7px]" />
              <div className="absolute top-0 inset-x-0 h-1 bg-white/80" />
            </div>
          </div>

          {/* Luxurious Multi-Tier Architectural Midnight Cake */}
          <div className="flex flex-col items-center -mt-1 z-10 select-none group-hover:scale-[1.02] transition-transform duration-300">
            {/* TIER 1: Top Tier with Glowing Cyan Frosting Drips */}
            <div className="relative w-40 sm:w-48 h-12 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B1220] rounded-t-xl border-t border-x border-cyan-400/40 shadow-lg flex flex-col justify-between overflow-hidden">
              {/* Top rim frosting highlight */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_8px_#22d3ee]" />

              {/* Decorative scalloped frosting drips */}
              <div className="flex justify-around items-start w-full px-2 pt-0.5 opacity-90">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-2.5 rounded-b-full bg-gradient-to-b from-cyan-300/60 to-transparent"
                  />
                ))}
              </div>

              {/* Silver pearls row */}
              <div className="flex justify-center gap-3.5 pb-1 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_white]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_4px_#22d3ee]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shadow-[0_0_4px_#93c5fd]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_4px_#22d3ee]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_white]" />
              </div>
            </div>

            {/* Mid-tier Accent Trim Band */}
            <div className="w-44 sm:w-52 h-2.5 bg-gradient-to-r from-[#0B1528] via-[#2563EB]/60 to-[#0B1528] border-x border-[#22D3EE]/40 flex items-center justify-center">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent shadow-[0_0_6px_#22d3ee]" />
            </div>

            {/* TIER 2: Main Base Tier with Vertical Gilded Fluting */}
            <div className="relative w-52 sm:w-60 h-16 bg-gradient-to-b from-[#0F172A] via-[#0B1220] to-[#040810] rounded-t-sm border-t border-x border-blue-500/35 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Top gilded trim */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

              {/* Architectural ribbed fluting columns */}
              <div className="w-full flex justify-around px-4 pt-2 opacity-35">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-8 bg-gradient-to-b from-cyan-400/60 via-blue-500/30 to-transparent rounded-full"
                  />
                ))}
              </div>

              {/* Lower ambient neon glow rim */}
              <div className="w-full h-1.5 bg-gradient-to-r from-[#0B1220] via-cyan-500/30 to-[#0B1220] flex items-center justify-center">
                <div className="w-3/4 h-[1px] bg-cyan-400/40" />
              </div>
            </div>

            {/* Luxurious Crystal Pedestal Cake Plate with Ambient Glow */}
            <div className="relative w-64 sm:w-72 h-4 bg-gradient-to-r from-[#1E293B] via-[#475569] to-[#1E293B] rounded-full border border-slate-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(37,99,235,0.3)] -mt-0.5 flex items-center justify-between px-4">
              <div className="w-2 h-1 rounded-full bg-cyan-300/60 blur-[0.5px]" />
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              {onDiscoverEgg && (
                <div className="relative -bottom-2">
                  <EasterEggTrigger
                    id="egg-reveal-flame"
                    onDiscover={onDiscoverEgg}
                    isDiscovered={discoveredEggs.includes('egg-reveal-flame')}
                  />
                </div>
              )}
            </div>

            {/* Pedestal Stand Base */}
            <div className="w-20 h-2 bg-gradient-to-b from-[#334155] to-[#0F172A] rounded-b-md border-b border-slate-500/40 shadow-md" />
          </div>
        </motion.div>

        {/* Action Button or Post-Wish Message */}
        <div className="mt-8 min-h-[120px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!isWished ? (
              <motion.div
                key="make-wish-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  id="make-a-wish-btn"
                  onClick={handleMakeWish}
                  disabled={isBlowing}
                  className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0B1B33]/80 hover:bg-[#2563EB] border border-[#2563EB]/40 hover:border-[#2563EB] text-[#F8FAFC] font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-[#22D3EE] group-hover:scale-110 transition-transform animate-pulse" />
                  <span>Blow Out Candle & Make Wish</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="wish-revealed-text"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="space-y-1">
                  <p className="font-serif text-2xl sm:text-3xl text-white font-normal italic">
                    Wish made.
                  </p>
                  <p className="text-sm sm:text-base text-cyan-300 font-light">
                    Don't tell me what it was. 👀
                  </p>
                </div>

                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  id="continue-after-reveal-btn"
                  onClick={handleContinue}
                  className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-300 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
