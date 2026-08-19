import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Download, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';
import { KeepsakeCardModal } from './KeepsakeCardModal';

interface FinalSurpriseSectionProps {
  onRestart: () => void;
}

export const FinalSurpriseSection: React.FC<FinalSurpriseSectionProps> = ({ onRestart }) => {
  const [hasContinued, setHasContinued] = useState<boolean>(false);
  const [showKeepsakeModal, setShowKeepsakeModal] = useState<boolean>(false);

  // Trigger crisp celebration confetti
  const triggerCelebrationConfetti = () => {
    soundEngine.playSuccessSound();

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#F8FAFC', '#22D3EE', '#3B82F6', '#CBD5E1', '#E2E8F0', '#F43F5E'],
      scalar: 0.85,
      ticks: 140,
    });
  };

  const handleContinue = () => {
    soundEngine.playBellChime(783.99, 0.18);
    setHasContinued(true);
    triggerCelebrationConfetti();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center select-none overflow-hidden">
      <div className="max-w-2xl z-10 w-full flex flex-col items-center">
        {/* Chapter 10 Tag */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/90 border border-[#2563EB]/30 text-cyan-400 text-xs tracking-widest uppercase mb-6 font-mono"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>CHAPTER 10 • THE LAST THING</span>
        </motion.div>

        {/* Main Content Container: Center aligned, with exact text & line breaks */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full rounded-3xl bg-[#0B1528]/95 border border-[#22D3EE]/35 p-7 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(37,99,235,0.25)] text-center overflow-hidden"
        >
          {/* Subtle central radial light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Style Requirement 3: Make "HAPPY  BIRTHDAY ADNAN ❤️" bold and slightly bigger */}
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.03 }}
            className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-8 drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            HAPPY  BIRTHDAY ADNAN ❤️
          </motion.h2>

          {/* Style Requirement 2 & 4: Center aligned with exact line breaks */}
          <div className="space-y-6 text-center font-poppins text-base sm:text-lg text-[#CBD5E1] leading-relaxed">
            {/* Paragraph 1 */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.06 }}
              className="space-y-1"
            >
              <p>Thank you for existing.</p>
              <p>Thank you for choosing me from miles away.</p>
              <p>Thank you for being worth the wait.</p>
            </motion.div>

            {/* Love declaration */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.09 }}
              className="space-y-1 text-[#22D3EE] font-medium text-lg sm:text-xl"
            >
              <p>I love you &nbsp; And you're mine</p>
            </motion.div>

            {/* Paragraph 2 */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.12 }}
              className="space-y-1 text-[#F8FAFC] font-medium"
            >
              <p>This website ends here.</p>
              <p>But "us" is just starting.</p>
            </motion.div>

            {/* Paragraph 3 */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="space-y-1 text-slate-300 italic"
            >
              <p>P.S. I'm saving the biggest hug for when we meet.</p>
              <p>Now go eat cake for me too 🎂</p>
            </motion.div>

            {/* Paragraph 4: Sign-off */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.18 }}
              className="pt-4 border-t border-[#2563EB]/25"
            >
              <p className="font-poppins font-semibold text-lg sm:text-xl text-[#22D3EE] tracking-wide">
                - Yours, Me
              </p>
            </motion.div>
          </div>

          {/* Style Requirement 5: Keep the "Continue" button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mt-8 flex flex-col items-center justify-center space-y-4"
          >
            {!hasContinued ? (
              <button
                id="chapter9-continue-btn"
                onClick={handleContinue}
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-poppins font-semibold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition-all duration-300 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2"
              >
                <button
                  id="open-keepsake-modal-btn"
                  onClick={() => setShowKeepsakeModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-poppins font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Keepsake Card (PNG)</span>
                </button>

                <button
                  id="replay-from-beginning-btn"
                  onClick={onRestart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B1B33]/80 hover:bg-[#0B1B33] border border-[#2563EB]/40 hover:border-[#22D3EE] text-[#CBD5E1] hover:text-white text-xs font-poppins font-semibold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay ↻</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Keepsake Card Modal */}
      <KeepsakeCardModal
        isOpen={showKeepsakeModal}
        onClose={() => setShowKeepsakeModal(false)}
      />
    </div>
  );
};
