import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Rocket, Sun, ArrowRight, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';

interface BirthdayChoiceSectionProps {
  onContinue: () => void;
}

export const BirthdayChoiceSection: React.FC<BirthdayChoiceSectionProps> = ({ onContinue }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [revealStep, setRevealStep] = useState<number>(0);

  const choices = [
    {
      id: 'PEACE',
      label: 'MORE PEACE',
      icon: <Moon className="w-4 h-4 text-blue-300" />,
      specificResponse: 'Then may this year give you more calm than chaos.',
    },
    {
      id: 'SUCCESS',
      label: 'MORE SUCCESS',
      icon: <Rocket className="w-4 h-4 text-cyan-400" />,
      specificResponse: 'Then may your hard work meet the right opportunities.',
    },
    {
      id: 'HAPPINESS',
      label: 'MORE HAPPINESS',
      icon: <Sun className="w-4 h-4 text-sky-200" />,
      specificResponse: 'Then may you find reasons to smile in unexpected places.',
    },
  ];

  const handleChoice = (choiceId: string, e: React.MouseEvent) => {
    if (selectedChoice) return;
    setSelectedChoice(choiceId);
    soundEngine.playSuccessSound();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { x, y },
      colors: ['#22D3EE', '#3B82F6', '#CBD5E1', '#FFFFFF'],
      ticks: 150,
    });

    // Swift staged reveal sequence
    setTimeout(() => setRevealStep(1), 60);
    setTimeout(() => setRevealStep(2), 350);
    setTimeout(() => setRevealStep(3), 650);
  };

  const handleSkipReveal = () => {
    if (revealStep < 3) {
      setRevealStep(3);
    }
  };

  const handleContinue = () => {
    soundEngine.playBellChime(587.33, 0.15);
    onContinue();
  };

  const currentChoiceObj = choices.find((c) => c.id === selectedChoice);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center select-none">
      <div className="max-w-3xl z-10 w-full flex flex-col items-center">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/80 border border-[#2563EB]/30 text-[#22D3EE] text-xs tracking-widest uppercase mb-4 font-mono shadow-[0_0_15px_rgba(34,211,238,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>CHAPTER 8 • WHAT WOULD YOU CHOOSE?</span>
        </motion.div>

        {/* Heading: "Okay, birthday boy..." */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-white mb-3"
        >
          Okay, birthday boy...
        </motion.h2>

        {/* Conversational Question */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-[#CBD5E1] text-lg sm:text-xl font-light mb-10 max-w-lg leading-relaxed"
        >
          If I could give you one thing for this year, what would you choose?
        </motion.p>

        {/* 3 Choice Buttons */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xl mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3.5 w-full">
            {choices.map((choice) => {
              const isChosen = selectedChoice === choice.id;
              return (
                <button
                  key={choice.id}
                  id={`choice-btn-${choice.id.toLowerCase()}`}
                  onClick={(e) => handleChoice(choice.id, e)}
                  disabled={!!selectedChoice}
                  className={`px-7 py-3.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                    isChosen
                      ? 'bg-[#2563EB] text-white shadow-[0_0_25px_rgba(37,99,235,0.6)] ring-2 ring-[#22D3EE]/50 scale-105'
                      : selectedChoice
                      ? 'border border-[#2563EB]/20 text-[#CBD5E1]/30 opacity-40 cursor-not-allowed'
                      : 'bg-[#0B1B33]/60 border border-[#2563EB]/40 text-[#F8FAFC] hover:bg-[#2563EB] hover:border-[#2563EB] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  }`}
                >
                  {choice.icon}
                  <span>{choice.label}</span>
                  {isChosen && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Revealed Conversational Reflection */}
        <AnimatePresence>
          {selectedChoice && currentChoiceObj && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={handleSkipReveal}
              className="w-full max-w-xl flex flex-col items-center cursor-pointer"
              title={revealStep < 3 ? "Click to reveal complete message" : ""}
            >
              <div className="p-8 rounded-2xl bg-[#0B1B33]/85 border border-[#2563EB]/40 backdrop-blur-2xl shadow-2xl space-y-4 mb-8 text-center w-full">
                {revealStep >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs uppercase tracking-widest text-[#22D3EE] font-bold font-mono"
                  >
                    "{currentChoiceObj.specificResponse}"
                  </motion.p>
                )}

                {revealStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-lg sm:text-xl text-[#CBD5E1] font-light leading-relaxed"
                  >
                    "But I was never going to let you choose only one. 😂"
                  </motion.p>
                )}

                {revealStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 pt-2"
                  >
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#22D3EE]/50 to-transparent mx-auto" />
                    <p className="text-2xl sm:text-3xl text-white font-serif italic tracking-wide font-medium">
                      "May Allah give you all three."
                    </p>
                  </motion.div>
                )}
              </div>

              {revealStep >= 3 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  id="continue-to-final-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContinue();
                  }}
                  className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1.5 transition-transform" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
