import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, ArrowRight, Stars, Lock, Flame, Shield, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';

interface HeartMessageSectionProps {
  onContinue: () => void;
}

interface LoveCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  preview: string;
  fullMessage: string;
  tag: string;
}

// Sequenced Bloom Animation Variants
const heartBloomContainerVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 45px rgba(244,63,94,0.25)',
    transition: {
      duration: 0.35,
      ease: 'easeOut',
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
};

const poemLineVariants = {
  initial: {
    opacity: 0,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
};

export const HeartMessageSection: React.FC<HeartMessageSectionProps> = ({ onContinue }) => {
  const [heartbeatCount, setHeartbeatCount] = useState<number>(0);
  const [isBeating, setIsBeating] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [revealedNotes, setRevealedNotes] = useState<string[]>([]);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  // Soft atmospheric chime on entrance bloom
  useEffect(() => {
    const timer = setTimeout(() => {
      soundEngine.playBellChime(587.33, 0.12);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const loveNotes: LoveCard[] = [
    {
      id: 'meaning',
      title: 'What You Mean To Me',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      preview: 'You are the calm in my busiest days...',
      fullMessage: "You're not just someone I love from far away; you are my peace, my comfort, and the warmest part of my everyday life. When everything feels overwhelming, just thinking of you makes my world calm again.",
      tag: '01 • MY PEACE',
    },
    {
      id: 'prayer',
      title: 'In Every Du\'a',
      icon: <Stars className="w-4 h-4 text-blue-400" />,
      preview: 'Every night before I sleep...',
      fullMessage: "Before I pray for my own dreams, I pray for your strength, your health, your smile, and your success. I ask Allah to protect your gentle heart and surround you with blessings wherever you go.",
      tag: '02 • SINCERE PRAYER',
    },
    {
      id: 'distance',
      title: 'The Miles Between Us',
      icon: <Compass className="w-4 h-4 text-rose-400" />,
      preview: 'Distance is only numbers...',
      fullMessage: "Miles cannot weaken what is anchored in the heart. Every single day of waiting is proof of how real this is. I would choose this distance with you over closeness with anyone else in the entire world.",
      tag: '03 • WORTH THE WAIT',
    },
    {
      id: 'future',
      title: 'My Forever Wish',
      icon: <Heart className="w-4 h-4 text-pink-400" />,
      preview: 'To meet you as our best versions...',
      fullMessage: "May the day come soon when there are no screens between us. May Allah unite us in halal, bless our togetherness, and let us walk through this life and into Jannah together. Ameen.",
      tag: '04 • FOREVER DU\'A',
    },
  ];

  const handleHeartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsBeating(true);
    setHeartbeatCount((prev) => prev + 1);

    // Audio chime with warm harmonics
    const tones = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const pitch = tones[heartbeatCount % tones.length];
    soundEngine.playBellChime(pitch, 0.18);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    // Trigger subtle romantic stardust burst
    const globalX = (rect.left + rect.width / 2) / window.innerWidth;
    const globalY = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 18,
      spread: 60,
      startVelocity: 18,
      origin: { x: globalX, y: globalY },
      colors: ['#22D3EE', '#F43F5E', '#FB7185', '#E2E8F0', '#FFFFFF', '#38BDF8'],
      ticks: 120,
      scalar: 0.8,
    });

    // Spawn animated floating starheart
    const newP = {
      id: Date.now() + Math.random(),
      x: clickX * 100,
      y: clickY * 100,
      size: 14 + Math.random() * 12,
    };
    setFloatingParticles((prev) => [...prev.slice(-12), newP]);

    setTimeout(() => setIsBeating(false), 600);
  };

  const handleNoteSelect = (id: string) => {
    soundEngine.playBellChime(659.25, 0.14);
    setSelectedNote(id);
    if (!revealedNotes.includes(id)) {
      setRevealedNotes((prev) => [...prev, id]);
    }
  };

  const handleProceed = () => {
    soundEngine.playBellChime(783.99, 0.16);
    onContinue();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-16 text-center select-none overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl z-10 w-full flex flex-col items-center">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/80 border border-rose-500/30 text-rose-300 text-xs tracking-widest uppercase mb-4 font-mono shadow-[0_0_15px_rgba(244,63,94,0.2)]"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40 animate-pulse" />
          <span>CHAPTER 9 • FROM MY HEART</span>
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-wider mb-2 drop-shadow-[0_0_25px_rgba(244,63,94,0.3)]"
        >
          A Heart That Beats For You
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="text-slate-300 text-xs sm:text-sm font-light max-w-md mb-8 leading-relaxed font-sans"
        >
          Every word here is written with you in mind. Tap on the heart below to send a heartbeat.
        </motion.p>

        {/* ========================================================================= */}
        {/* THE HEART-SHAPED MESSAGE CENTERPIECE (BLOOM ENTRANCE ANIMATION) */}
        {/* ========================================================================= */}
        <motion.div
          variants={heartBloomContainerVariants}
          initial="initial"
          animate="animate"
          onClick={handleHeartClick}
          className={`group relative w-full max-w-[480px] rounded-3xl px-4 py-8 sm:px-8 sm:py-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 shadow-2xl mb-10 overflow-hidden ${
            isBeating
              ? 'scale-[1.02] shadow-[0_0_60px_rgba(244,63,94,0.5),0_0_80px_rgba(34,211,238,0.3)]'
              : 'hover:scale-[1.01] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(244,63,94,0.2)]'
          }`}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(19, 29, 58, 0.96) 0%, rgba(11, 21, 40, 0.98) 60%, rgba(4, 8, 16, 0.99) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.45)',
          }}
        >
          {/* Ambient Inner Radiant Aura Bloom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, filter: 'blur(30px)' }}
            animate={{ opacity: [0, 0.6, 0.35], scale: [0.6, 1.15, 1.0], filter: 'blur(20px)' }}
            transition={{ duration: 1.8, delay: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-cyan-500/15 to-transparent rounded-3xl pointer-events-none"
          />

          {/* Animated SVG Heart Outline Background Frame */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 sm:opacity-30 group-hover:opacity-40 transition-opacity">
            <svg
              viewBox="0 0 512 512"
              className={`w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] transition-transform duration-500 ${
                isBeating ? 'scale-105' : 'scale-100'
              }`}
              fill="none"
            >
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path
                d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
                stroke="url(#heartGradient)"
                strokeWidth="4"
                strokeDasharray="8 6"
                filter="url(#glow)"
              />
            </svg>
          </div>

          {/* Floating animated sparkles & hearts from taps */}
          {floatingParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 1.5, y: -90 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 text-rose-400"
            >
              ❤️
            </motion.div>
          ))}

          {/* Subtle Heart Pulsing Center Icon */}
          <motion.div variants={poemLineVariants} className="mb-3 sm:mb-4 z-10">
            <motion.div
              animate={{
                scale: isBeating ? [1, 1.25, 1.1, 1.2, 1] : [1, 1.06, 1],
              }}
              transition={{
                duration: isBeating ? 0.6 : 2.5,
                repeat: isBeating ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-rose-500/25 via-pink-500/10 to-cyan-500/20 border border-rose-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)]"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 fill-rose-500" />
            </motion.div>
          </motion.div>

          {/* =================================================================== */}
          {/* THE HEART-SHAPED POEM / MESSAGE (SEQUENCED STAGGER REVEAL) */}
          {/* Formatted with crisp, high-readability modern typography */}
          {/* =================================================================== */}
          <div className="z-10 w-full max-w-sm sm:max-w-md text-center space-y-3 font-sans text-[#F8FAFC] px-1 sm:px-3">
            <motion.p variants={poemLineVariants} className="text-xs sm:text-sm font-bold tracking-widest text-[#22D3EE] uppercase font-mono mb-2">
              ✦ FOR YOU, LOVE ✦
            </motion.p>

            <motion.p variants={poemLineVariants} className="text-sm sm:text-base text-white font-medium leading-relaxed">
              In a world full of billions, my heart chose only you.
            </motion.p>

            <motion.p variants={poemLineVariants} className="text-sm sm:text-base text-cyan-200 font-medium leading-relaxed">
              Across every silent night, you are my most sincere prayer.
            </motion.p>

            <motion.p variants={poemLineVariants} className="text-sm sm:text-base text-rose-200 font-medium leading-relaxed">
              I love your kindness, your warmth, and your gentle voice.
            </motion.p>

            <motion.p variants={poemLineVariants} className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed">
              Even with miles between us, you make me feel safe and cherished.
            </motion.p>

            <motion.p variants={poemLineVariants} className="text-sm sm:text-base text-white font-medium leading-relaxed">
              I don't just want simple moments—I want a blessed lifetime with you.
            </motion.p>

            <motion.p variants={poemLineVariants} className="text-sm sm:text-base text-rose-300 font-semibold leading-relaxed">
              You are my favorite thought, and my home.
            </motion.p>

            <motion.p variants={poemLineVariants} className="text-base sm:text-lg text-[#22D3EE] font-bold tracking-wide pt-2 drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">
              I love you, Adnan ❤️
            </motion.p>

            <motion.p variants={poemLineVariants} className="text-xs sm:text-sm text-slate-300 font-medium">
              — Yours, Ifra 🌙
            </motion.p>
          </div>

          {/* Heartbeat Counter / Interactive prompt */}
          <motion.div variants={poemLineVariants} className="mt-5 sm:mt-6 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050A14]/80 border border-rose-500/30 text-rose-300 text-[11px] font-mono">
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400 animate-ping" />
            <span>
              {heartbeatCount > 0
                ? `Heartbeats Sent: ${heartbeatCount}`
                : 'Tap anywhere to send love'}
            </span>
          </motion.div>
        </motion.div>

        {/* ========================================================================= */}
        {/* INTERACTIVE 4 LOVE NOTE TILES */}
        {/* ========================================================================= */}
        <div className="w-full max-w-3xl mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-[#22D3EE] mb-4">
            ✦ TOUCH TO OPEN A PIECE OF MY HEART ✦
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
            {loveNotes.map((card) => {
              const isSelected = selectedNote === card.id;
              const isRead = revealedNotes.includes(card.id);

              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleNoteSelect(card.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                    isSelected
                      ? 'bg-[#0E1E38]/95 border-rose-400/80 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                      : isRead
                      ? 'bg-[#0B1528]/80 border-[#2563EB]/40 text-slate-300'
                      : 'bg-[#080F1E]/70 border-[#2563EB]/25 hover:border-cyan-400/50 hover:bg-[#0B172E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                      {card.tag}
                    </span>
                    <div className="p-1 rounded-full bg-[#050A14] border border-[#2563EB]/30">
                      {card.icon}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                    <span>{card.title}</span>
                  </h3>

                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {isSelected ? card.fullMessage : card.preview}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-cyan-400/80">
                    <span>{isSelected ? '✦ Open' : 'Tap to read full message →'}</span>
                    {isRead && <span className="text-rose-400">❤️</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTINUE BUTTON TO CHAPTER 10 */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            id="heart-chapter-continue-btn"
            onClick={handleProceed}
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#2563EB] to-[#E11D48] hover:from-[#1D4ED8] hover:to-[#BE123C] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:shadow-[0_0_35px_rgba(244,63,94,0.6)] transition-all duration-300 cursor-pointer"
          >
            <span>One Last Thing</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
