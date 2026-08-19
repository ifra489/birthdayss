import React, { useState, useRef, useEffect } from 'react';
import { Settings, Sparkles, PartyPopper, Check, X, BookmarkCheck, Award } from 'lucide-react';
import { ParticleIntensity, EasterEgg } from '../types';
import { EASTER_EGGS } from '../utils/easterEggs';
import { KeepsakeCardModal } from './KeepsakeCardModal';

interface SettingsModalProps {
  particleIntensity: ParticleIntensity;
  setParticleIntensity: (intensity: ParticleIntensity) => void;
  celebrationMode: boolean;
  setCelebrationMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  discoveredEggs?: string[];
  onOpenEggModal?: (egg: EasterEgg) => void;
}

export const SettingsControl: React.FC<SettingsModalProps> = ({
  particleIntensity,
  setParticleIntensity,
  celebrationMode,
  setCelebrationMode,
  discoveredEggs = [],
  onOpenEggModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeepsake, setShowKeepsake] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const intensities: { id: ParticleIntensity; label: string; desc: string }[] = [
    { id: 'low', label: 'Subtle', desc: 'Calm and minimal stars' },
    { id: 'normal', label: 'Balanced', desc: 'Default starry atmosphere' },
    { id: 'cinematic', label: 'Dense', desc: 'Rich glowing constellation' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="experience-settings-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 sm:p-2 rounded-full border transition-all duration-300 backdrop-blur-md flex items-center justify-center cursor-pointer ${
          isOpen
            ? 'bg-[#2563EB] border-[#22D3EE] text-white shadow-[0_0_12px_rgba(34,211,238,0.5)]'
            : 'bg-[#0B1220]/80 border-[#2563EB]/30 text-[#CBD5E1]/70 hover:text-white hover:border-[#22D3EE]/50 hover:bg-[#0B1B33]'
        }`}
        title="Experience & Secrets Settings"
        aria-label="Experience & Secrets Settings"
      >
        <Settings className={`w-3.5 h-3.5 transition-transform duration-500 ${isOpen ? 'rotate-90 text-white' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-80 p-4 rounded-2xl bg-[#0B1220]/95 border border-[#2563EB]/40 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-left z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#2563EB]/20 pb-2.5 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F8FAFC]">
              <Settings className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Atmosphere & Keepsakes</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#CBD5E1]/50 hover:text-white rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Keepsake Shortcut */}
          <div className="mb-3.5">
            <button
              onClick={() => {
                setShowKeepsake(true);
                setIsOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-[#0B1B33]/80 hover:bg-[#2563EB]/30 border border-[#2563EB]/40 text-left transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#22D3EE]" />
                <div>
                  <div className="text-xs font-semibold text-[#F8FAFC]">Keepsake Card</div>
                  <div className="text-[10px] text-[#CBD5E1]/60">Download commemorative PNG token</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#22D3EE] font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                View ↗
              </span>
            </button>
          </div>

          {/* Secret Notes Discovered Tracker */}
          <div className="mb-3.5 p-3 rounded-xl bg-[#050A14]/70 border border-[#2563EB]/25">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC]">
                <BookmarkCheck className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Secret Notes</span>
              </div>
              <span className="text-[11px] font-mono text-[#22D3EE] font-bold">
                {discoveredEggs.length}/5 Found
              </span>
            </div>

            <div className="space-y-1.5 mt-2 max-h-28 overflow-y-auto pr-1">
              {EASTER_EGGS.map((egg) => {
                const isFound = discoveredEggs.includes(egg.id);
                return (
                  <button
                    key={egg.id}
                    disabled={!isFound}
                    onClick={() => {
                      if (isFound && onOpenEggModal) {
                        onOpenEggModal(egg);
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full text-left p-1.5 px-2 rounded-lg text-[10px] font-mono flex items-center justify-between transition-all ${
                      isFound
                        ? 'bg-[#2563EB]/20 hover:bg-[#2563EB]/40 border border-[#22D3EE]/30 text-[#E2E8F0] cursor-pointer'
                        : 'bg-transparent text-[#CBD5E1]/40 border border-dashed border-[#1E293B] cursor-not-allowed'
                    }`}
                  >
                    <span className="truncate">
                      #{egg.number}: {isFound ? egg.title : 'Hidden secret detail...'}
                    </span>
                    <span className="shrink-0 ml-1 text-[#22D3EE]">
                      {isFound ? 'Read ↗' : 'Locked'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Celebration Mode Toggle */}
          <div className="mb-3.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#CBD5E1]/60 block mb-1.5">
              Celebration Mode
            </label>
            <button
              id="toggle-celebration-mode-btn"
              onClick={() => setCelebrationMode((prev) => !prev)}
              className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-xs font-medium cursor-pointer ${
                celebrationMode
                  ? 'bg-[#2563EB]/25 border-[#22D3EE]/60 text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : 'bg-[#050A14]/80 border-[#2563EB]/20 text-[#CBD5E1]/70 hover:border-[#2563EB]/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <PartyPopper className={`w-4 h-4 ${celebrationMode ? 'text-[#22D3EE] animate-bounce' : 'text-[#CBD5E1]/40'}`} />
                <span>Birthday Confetti</span>
              </div>
              <div
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${
                  celebrationMode ? 'bg-[#22D3EE]' : 'bg-[#1E293B]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    celebrationMode ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Particle Intensity Selector */}
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#CBD5E1]/60 block mb-1.5">
              Star Density
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {intensities.map((item) => {
                const isSelected = particleIntensity === item.id;
                return (
                  <button
                    key={item.id}
                    id={`intensity-btn-${item.id}`}
                    onClick={() => setParticleIntensity(item.id)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] border-[#22D3EE] text-white shadow-[0_0_10px_rgba(37,99,235,0.5)] font-bold'
                        : 'bg-[#050A14]/80 border-[#2563EB]/20 text-[#CBD5E1]/70 hover:border-[#2563EB]/40 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Keepsake Modal from Settings */}
      <KeepsakeCardModal
        isOpen={showKeepsake}
        onClose={() => setShowKeepsake(false)}
      />
    </div>
  );
};


