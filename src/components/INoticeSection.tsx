import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { EasterEggTrigger } from './EasterEggTrigger';
import { EasterEgg } from '../types';

interface INoticeSectionProps {
  onContinue: () => void;
  onDiscoverEgg?: (egg: EasterEgg) => void;
  discoveredEggs?: string[];
}

interface ObservationPanel {
  num: string;
  title: string;
  text: string;
  highlight?: string;
  type: 'ambition' | 'moments' | 'unsaid' | 'you';
}

export const INoticeSection: React.FC<INoticeSectionProps> = ({
  onContinue,
  onDiscoverEgg,
  discoveredEggs = [],
}) => {
  // Sequence stages:
  // 0: Opening initial line ("Adnan, there's something I wanted you to know...")
  // 1: Second opening reveal typewriter ("I may not always say it, but I notice the little things.")
  // 2: 4 observation panels (revealed one by one or in view)
  // 3: Panels fade, Main Personal Message reveals ("I don't need a big reason to appreciate you... Sometimes, it's simply because you're you.")
  // 4: Signature & "That's all I wanted you to know." + Continue button
  const [stage, setStage] = useState<number>(0);
  const [activePanelIdx, setActivePanelIdx] = useState<number>(0);
  const [isLightSweep, setIsLightSweep] = useState<boolean>(false);

  // Typewriter state for opening line
  const fullTypewriterText = "I may not always say it, but I notice the little things.";
  const partALength = "I may not always say it, ".length;
  const [typedIndex, setTypedIndex] = useState<number>(0);
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  const observations: ObservationPanel[] = [
    {
      num: '01',
      title: 'YOUR AMBITION',
      text: "I notice your ambition  the things you're working toward, the dreams you carry, and the person you're trying to become.",
      type: 'ambition',
    },
    {
      num: '02',
      title: 'THE LITTLE MOMENTS',
      text: "I remember the random conversations, the silly moments, the teasing, and all those little things that probably felt ordinary at the time but somehow became memories I'll always keep.",
      type: 'moments',
    },
    {
      num: '03',
      title: 'THE THINGS YOU DON\'T SAY',
      text: "I know you don't always say everything you're thinking. Sometimes, the quiet moments say enough.",
      type: 'unsaid',
    },
    {
      num: '04',
      title: 'YOU',
      text: 'And somewhere between all those little moments, you became someone genuinely important to me.',
      highlight: 'genuinely important to me.',
      type: 'you',
    },
  ];

  // Stage timeline transitions
  useEffect(() => {
    // 0 -> 1: Immediate start
    const t1 = setTimeout(() => {
      setStage(1);
    }, 40);

    return () => {
      clearTimeout(t1);
    };
  }, []);

  // Fast smooth typewriter typing loop
  useEffect(() => {
    if (stage < 1) return;

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx += 2; // Fast 2-char jump
      if (currentIdx >= fullTypewriterText.length) {
        currentIdx = fullTypewriterText.length;
        setTypedIndex(currentIdx);
        clearInterval(interval);
        setIsTypingComplete(true);
        // Swiftly transition to Stage 2
        setTimeout(() => {
          setStage((prev) => (prev < 2 ? 2 : prev));
          soundEngine.playBellChime(587.33, 0.09);
        }, 300);
      } else {
        setTypedIndex(currentIdx);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [stage]);

  // Click-to-skip handler for the opening stage
  const handleSkipToPanels = () => {
    if (stage < 2) {
      setTypedIndex(fullTypewriterText.length);
      setIsTypingComplete(true);
      setStage(2);
      soundEngine.playBellChime(587.33, 0.09);
    }
  };

  const handleNextPanel = () => {
    if (activePanelIdx < observations.length - 1) {
      const nextIdx = activePanelIdx + 1;
      setActivePanelIdx(nextIdx);
      soundEngine.playBellChime(659.25 + nextIdx * 80, 0.12);
    } else {
      // Transition to Main Message stage (Stage 3)
      setStage(3);
      soundEngine.playBellChime(880.0, 0.14);
      setTimeout(() => {
        setStage(4);
      }, 500);
    }
  };

  const handlePanelDirectClick = (idx: number) => {
    setActivePanelIdx(idx);
    soundEngine.playBellChime(587.33 + idx * 70, 0.1);
  };

  const handleProceedToMessage = () => {
    setStage(3);
    soundEngine.playBellChime(880.0, 0.14);
    setTimeout(() => {
      setStage(4);
    }, 400);
  };

  const handleFinalContinue = () => {
    soundEngine.playBellChime(783.99, 0.15);
    setIsLightSweep(true);
    setTimeout(() => {
      onContinue();
    }, 200);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center select-none overflow-hidden">
      {/* Dim atmospheric backdrop specific to Chapter 3 */}
      <div className="fixed inset-0 bg-[#02050D]/65 backdrop-blur-[3px] pointer-events-none -z-10 transition-opacity duration-1000" />

      {/* Blue light sweep effect for section transition */}
      {isLightSweep && (
        <motion.div
          initial={{ x: '-100%', opacity: 0.8 }}
          animate={{ x: '200%', opacity: [0.8, 1, 0] }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="fixed inset-0 bg-gradient-to-r from-transparent via-[#22D3EE]/30 to-transparent pointer-events-none z-50 transform -skew-x-12"
        />
      )}

      <div className="max-w-4xl z-10 w-full flex flex-col items-center">
        {/* Chapter Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/60 border border-[#2563EB]/30 text-cyan-400 text-xs tracking-widest uppercase mb-4 font-mono"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Chapter 3 • I Notice</span>
          {onDiscoverEgg && (
            <div className="ml-1 pl-1 border-l border-cyan-500/30">
              <EasterEggTrigger
                id="egg-wishes-crescent"
                onDiscover={onDiscoverEgg}
                isDiscovered={discoveredEggs.includes('egg-wishes-crescent')}
              />
            </div>
          )}
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.15 }}
          className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider text-white mb-2"
        >
          I NOTICE MORE THAN YOU THINK
        </motion.h2>

        {/* ========================================================
            OPENING SEQUENCE (STAGES 0 & 1)
           ======================================================== */}
        <div
          onClick={handleSkipToPanels}
          className="min-h-[80px] flex flex-col items-center justify-center my-3 cursor-pointer"
          title={stage < 2 ? "Click to skip directly to observations" : ""}
        >
          <AnimatePresence mode="wait">
            {stage >= 0 && (
              <motion.div
                key="opening-phase"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-2"
              >
                {/* Initial glowing line */}
                <p className="text-cyan-300/90 text-sm sm:text-base font-serif italic tracking-wide drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">
                  Adnan, there's something I wanted you to know...
                </p>

                {/* Second line typewriter reveal */}
                {stage >= 1 && (() => {
                  const visibleText = fullTypewriterText.slice(0, typedIndex);
                  const visiblePartA = visibleText.slice(0, Math.min(typedIndex, partALength));
                  const visiblePartB = typedIndex > partALength ? visibleText.slice(partALength) : '';

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="text-slate-300 text-sm sm:text-base font-light max-w-lg leading-relaxed text-center"
                    >
                      <span>{visiblePartA}</span>
                      {visiblePartB && (
                        <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
                          {visiblePartB}
                        </span>
                      )}
                      {/* Intimate glowing typewriter caret */}
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                        className={`inline-block ml-0.5 w-[2px] h-3.5 sm:h-4 bg-cyan-400 align-middle shadow-[0_0_8px_#22d3ee] ${
                          isTypingComplete ? 'opacity-25' : 'opacity-100'
                        }`}
                      />
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================
            STAGE 2: FOUR ELEGANT OBSERVATION PANELS
           ======================================================== */}
        <AnimatePresence mode="wait">
          {stage === 2 && (
            <motion.div
              key="observation-panels-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-3xl flex flex-col items-center my-4"
            >
              {/* Observation Selector Tabs (Minimalist & Non-generic) */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
                {observations.map((item, idx) => {
                  const isActive = activePanelIdx === idx;
                  return (
                    <button
                      key={item.num}
                      onClick={() => handlePanelDirectClick(idx)}
                      id={`panel-tab-${item.num}`}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono tracking-widest transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB]/40 border border-[#22D3EE] text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'bg-[#0B1528]/60 border border-[#2563EB]/20 text-slate-400 hover:text-slate-200 hover:border-[#2563EB]/40'
                      }`}
                    >
                      <span>{item.num}</span>
                      <span className="hidden sm:inline ml-1.5 opacity-80">{item.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Glassmorphic Panel */}
              <div className="relative w-full min-h-[200px] flex items-center justify-center">
                {(() => {
                  const current = observations[activePanelIdx];
                  return (
                    <motion.div
                      key={current.num}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="relative w-full rounded-2xl p-6 sm:p-8 text-left bg-[#0B1528]/95 border border-[#22D3EE]/35 shadow-[0_10px_25px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                      {/* Panel Header */}
                      <div className="flex items-center justify-between mb-4 border-b border-[#2563EB]/20 pb-3">
                        <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
                          Observation {current.num} / 04
                        </span>
                        <span className="text-xs font-cinzel text-slate-300 tracking-wider">
                          {current.title}
                        </span>
                      </div>

                      {/* Observation Text */}
                      <div className="text-[#F8FAFC] text-base sm:text-lg sm:leading-relaxed font-serif italic mb-6">
                        {current.highlight ? (
                          <p>
                            <span>And somewhere between all those little moments, </span>
                            <br className="hidden sm:inline" />
                            <span>you became someone </span>
                            <span className="text-cyan-200 font-semibold drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                              genuinely important to me.
                            </span>
                          </p>
                        ) : (
                          <p>"{current.text}"</p>
                        )}
                      </div>

                      {/* Navigation / Progression within panels */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-1.5">
                          {observations.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 rounded-full transition-all duration-200 ${
                                i === activePanelIdx
                                  ? 'w-6 bg-cyan-400 shadow-[0_0_6px_#22d3ee]'
                                  : 'w-2 bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={handleNextPanel}
                          className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/30 hover:bg-[#2563EB] border border-cyan-400/30 hover:border-cyan-400 text-xs font-mono text-cyan-200 hover:text-white transition-colors cursor-pointer"
                        >
                          <span>
                            {activePanelIdx < observations.length - 1
                              ? 'Next Observation'
                              : 'Read Message'}
                          </span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Quick Skip / Advance Option */}
              <div className="mt-4 flex items-center justify-center">
                <button
                  onClick={handleProceedToMessage}
                  className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-widest cursor-pointer"
                >
                  View full message →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            STAGE 3 & 4: THE MAIN PERSONAL MESSAGE & SIGNATURE
           ======================================================== */}
        <AnimatePresence mode="wait">
          {stage >= 3 && (
            <motion.div
              key="main-personal-message-block"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => setStage(4)}
              className="w-full max-w-2xl flex flex-col items-center my-6 text-center cursor-pointer"
              title={stage < 4 ? "Click to reveal continue button" : ""}
            >
              {/* Highlight Card Backdrop */}
              <div className="relative w-full rounded-2xl p-8 sm:p-10 bg-gradient-to-b from-[#0B1B33]/80 via-[#0B1528]/90 to-[#040810]/95 border border-[#22D3EE]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(34,211,238,0.25)] flex flex-col items-center">
                {/* Central Soft Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Line 1: "I don't need a big reason to appreciate you." */}
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="text-lg sm:text-2xl text-slate-200 font-serif italic tracking-wide mb-3"
                >
                  "I don't need a big reason to appreciate you."
                </motion.p>

                {/* Line 2 with Tiny Glowing Star: "Sometimes, I simply appreciate you because you're you. ✨" */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="inline-flex items-center justify-center gap-2 text-xl sm:text-3xl text-white font-serif font-medium tracking-wide my-2"
                >
                  <span>Sometimes, I simply appreciate you because you're you.</span>
                  <motion.span
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.7, 1, 0.7],
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-block text-[#22D3EE] drop-shadow-[0_0_10px_#22d3ee]"
                  >
                    <Star className="w-5 h-5 fill-cyan-400 text-cyan-300 inline -mt-1" />
                  </motion.span>
                </motion.div>

                {/* Signature: "— Ifra" (Subtle handwritten style note) */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="w-full flex justify-end mt-8 pr-2"
                >
                  <span className="font-serif italic text-base sm:text-lg text-cyan-300/80 tracking-widest">
                    — Ifra
                  </span>
                </motion.div>
              </div>

              {/* Transition Prompt & Continue Button */}
              {stage >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-8 flex flex-col items-center space-y-3"
                >
                  <p className="text-xs sm:text-sm text-slate-400 font-light tracking-wide font-serif italic">
                    That's all I wanted you to know.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    id="continue-to-gift-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFinalContinue();
                    }}
                    className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.65)] transition-all duration-300 cursor-pointer"
                  >
                    <span>There's more waiting for you</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
