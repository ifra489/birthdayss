import React, { memo } from 'react';
import { SectionId, ParticleIntensity, EasterEgg } from '../types';
import { SettingsControl } from './SettingsControl';
import { Check, Lock } from 'lucide-react';

interface NavigationProgressProps {
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  unlockedSections: SectionId[];
  particleIntensity: ParticleIntensity;
  setParticleIntensity: (intensity: ParticleIntensity) => void;
  celebrationMode: boolean;
  setCelebrationMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  discoveredEggs?: string[];
  onOpenEggModal?: (egg: EasterEgg) => void;
}

interface StepInfo {
  id: SectionId;
  label: string;
}

export const NavigationProgress = memo(function NavigationProgress({
  currentSection,
  onSelectSection,
  unlockedSections,
  particleIntensity,
  setParticleIntensity,
  celebrationMode,
  setCelebrationMode,
  discoveredEggs = [],
  onOpenEggModal,
}: NavigationProgressProps) {
  const steps: StepInfo[] = [
    { id: 'intro', label: 'Intro' },
    { id: 'reveal', label: 'Birthday' },
    { id: 'wishes', label: 'I Notice' },
    { id: 'gift', label: 'The Gift' },
    { id: 'letter', label: 'Letter' },
    { id: 'never-forget', label: 'Reminders' },
    { id: 'night-sky', label: 'Night Sky' },
    { id: 'choice', label: 'Choice' },
    { id: 'heart-message', label: 'My Heart' },
    { id: 'finale', label: 'The Last Thing' },
  ];

  const currentIdx = steps.findIndex((s) => s.id === currentSection);

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex flex-col items-center gap-1.5 px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-[#0B1220]/80 border border-[#2563EB]/30 backdrop-blur-xl shadow-2xl">
        {steps.map((step, idx) => {
          const isCurrent = currentSection === step.id;
          const isUnlocked = unlockedSections.includes(step.id);
          const isCompleted = isUnlocked && !isCurrent && idx < currentIdx;

          return (
            <button
              key={step.id}
              onClick={() => isUnlocked && onSelectSection(step.id)}
              disabled={!isUnlocked}
              id={`nav-dot-${step.id}`}
              className={`group relative flex items-center justify-center transition-all duration-300 ${
                isCurrent
                  ? 'px-2.5 h-6 bg-[#22D3EE] text-[#050A14] font-bold text-[11px] rounded-full shadow-[0_0_15px_#22d3ee] scale-105'
                  : isCompleted
                  ? 'w-6 h-6 rounded-full bg-[#2563EB]/25 border border-[#22D3EE]/40 text-[#22D3EE] hover:bg-[#2563EB]/50 hover:border-[#22D3EE] cursor-pointer'
                  : isUnlocked
                  ? 'w-5 h-5 rounded-full bg-[#2563EB]/30 text-[#CBD5E1] hover:bg-[#2563EB]/50 cursor-pointer text-[10px]'
                  : 'w-4 h-4 rounded-full bg-[#1E293B]/40 border border-[#2563EB]/10 text-[#CBD5E1]/20 cursor-not-allowed opacity-40'
              }`}
              title={
                isCurrent
                  ? `Current: ${step.label} (${idx + 1}/10)`
                  : isUnlocked
                  ? `Revisit: ${step.label} (${idx + 1}/10)`
                  : `Locked: Complete previous chapters first`
              }
            >
              {isCurrent ? (
                <span className="font-mono text-[10px] tracking-tight">{idx + 1}</span>
              ) : isCompleted ? (
                <Check className="w-3 h-3 stroke-[2.5]" />
              ) : isUnlocked ? (
                <span className="font-mono text-[9px]">{idx + 1}</span>
              ) : (
                <Lock className="w-2 h-2 opacity-50" />
              )}

              {/* Tooltip on hover for unlocked chapters */}
              {isUnlocked && (
                <span className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap px-2 py-0.5 rounded bg-[#0B1B33] border border-[#2563EB]/40 text-[10px] text-[#22D3EE] font-mono shadow-md pointer-events-none">
                  {step.label} {isCompleted ? '✓' : ''}
                </span>
              )}
            </button>
          );
        })}

        {/* Settings Menu Button */}
        <div className="pl-1.5 ml-1 border-l border-[#2563EB]/30">
          <SettingsControl
            particleIntensity={particleIntensity}
            setParticleIntensity={setParticleIntensity}
            celebrationMode={celebrationMode}
            setCelebrationMode={setCelebrationMode}
            discoveredEggs={discoveredEggs}
            onOpenEggModal={onOpenEggModal}
          />
        </div>
      </div>
    </div>
  );
});
