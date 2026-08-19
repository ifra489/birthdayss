import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Compass, Flame, Moon, Feather, Orbit, Gift, Bookmark, CheckCircle2 } from 'lucide-react';
import { EasterEgg } from '../types';

interface EasterEggModalProps {
  egg: EasterEgg | null;
  onClose: () => void;
  discoveredCount: number;
  totalCount: number;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({
  egg,
  onClose,
  discoveredCount,
  totalCount,
}) => {
  if (!egg) return null;

  const renderIcon = () => {
    switch (egg.iconName) {
      case 'compass':
        return <Compass className="w-7 h-7 text-[#22D3EE] animate-spin" style={{ animationDuration: '12s' }} />;
      case 'flame':
        return <Flame className="w-7 h-7 text-[#FDE047] animate-pulse" />;
      case 'crescent':
        return <Moon className="w-7 h-7 text-[#93C5FD]" />;
      case 'feather':
        return <Feather className="w-7 h-7 text-[#C084FC]" />;
      case 'nebula':
        return <Orbit className="w-7 h-7 text-[#38BDF8] animate-spin" style={{ animationDuration: '8s' }} />;
      case 'gift':
        return <Gift className="w-7 h-7 text-[#22D3EE] animate-bounce" />;
      case 'bookmark':
        return <Bookmark className="w-7 h-7 text-[#60A5FA]" />;
      default:
        return <Sparkles className="w-7 h-7 text-[#22D3EE]" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050A14]/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-md w-full rounded-3xl bg-gradient-to-b from-[#0B1B33]/95 to-[#050A14]/95 border border-[#22D3EE]/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(34,211,238,0.25)] backdrop-blur-2xl text-center z-10 overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#22D3EE]/15 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            id="close-easter-egg-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#CBD5E1]/60 hover:text-white hover:bg-[#2563EB]/20 border border-transparent hover:border-[#2563EB]/40 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-[#0B1220] border border-[#22D3EE]/40 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center relative">
            {renderIcon()}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#2563EB] text-[#F8FAFC] text-[10px] font-mono font-bold flex items-center justify-center shadow-md">
              #{egg.number}
            </div>
          </div>

          {/* Discovered Ribbon */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#22D3EE]/30 text-[#22D3EE] text-[11px] font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-[#22D3EE]" />
            <span>Secret Discovery</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight mb-3">
            {egg.title}
          </h3>

          {/* Location Badge */}
          <div className="text-[11px] font-mono text-[#CBD5E1]/60 mb-5">
            Hidden inside: <span className="text-[#93C5FD] font-semibold">{egg.location}</span>
          </div>

          {/* Secret Message Quote Box */}
          <div className="relative p-5 rounded-2xl bg-[#0B1220]/80 border border-[#2563EB]/25 text-left mb-6 shadow-inner">
            <div className="text-xs sm:text-sm text-[#E2E8F0] font-light leading-relaxed italic">
              "{egg.secretMessage}"
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#050A14]/60 border border-[#2563EB]/20 text-[11px] font-mono text-[#CBD5E1]/70 mb-5">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Collected Secrets</span>
            </div>
            <span className="text-[#22D3EE] font-bold">
              {discoveredCount} of {totalCount} Found
            </span>
          </div>

          {/* Keep Exploring Button */}
          <button
            id="acknowledge-secret-btn"
            onClick={onClose}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-[#F8FAFC] font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
          >
            Keep Exploring Journey
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
