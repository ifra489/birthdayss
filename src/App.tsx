/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionId, ParticleIntensity, EasterEgg } from './types';
import { NightSkyCanvas } from './components/NightSkyCanvas';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { MusicPlayer } from './components/MusicPlayer';
import { NavigationProgress } from './components/NavigationProgress';
import { EasterEggModal } from './components/EasterEggModal';
import { EASTER_EGGS, getEasterEggStorage, saveEasterEggDiscovery } from './utils/easterEggs';
import { soundEngine } from './utils/soundEngine';

// 10 Chapters
import { IntroSection } from './components/IntroSection';
import { BirthdayRevealSection } from './components/BirthdayRevealSection';
import { ThreeWishesSection } from './components/ThreeWishesSection';
import { GiftBoxSection } from './components/GiftBoxSection';
import { LetterSection } from './components/LetterSection';
import { NeverForgetSection } from './components/NeverForgetSection';
import { NightSkyContemplationSection } from './components/NightSkyContemplationSection';
import { BirthdayChoiceSection } from './components/BirthdayChoiceSection';
import { HeartMessageSection } from './components/HeartMessageSection';
import { FinalSurpriseSection } from './components/FinalSurpriseSection';

const SECTIONS: SectionId[] = [
  'intro',
  'reveal',
  'wishes',
  'gift',
  'letter',
  'never-forget',
  'night-sky',
  'choice',
  'heart-message',
  'finale',
];

const sectionContainerVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

const introContainerVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

export default function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('intro');
  const [unlockedSections, setUnlockedSections] = useState<SectionId[]>(['intro']);
  const [particleIntensity, setParticleIntensity] = useState<ParticleIntensity>('normal');
  const [celebrationMode, setCelebrationMode] = useState<boolean>(false);
  const [discoveredEggs, setDiscoveredEggs] = useState<string[]>(() => getEasterEggStorage());
  const [activeEggModal, setActiveEggModal] = useState<EasterEgg | null>(null);

  const handleDiscoverEgg = useCallback((egg: EasterEgg) => {
    const updated = saveEasterEggDiscovery(egg.id);
    setDiscoveredEggs(updated);
    setActiveEggModal(egg);
  }, []);

  const unlockAndNavigate = useCallback((nextSection: SectionId) => {
    setUnlockedSections((prev) => (prev.includes(nextSection) ? prev : [...prev, nextSection]));
    setCurrentSection(nextSection);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentSection('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Auto-start ambient background music on first user interaction so it stays playing continuously
  useEffect(() => {
    const handleFirstInteraction = () => {
      soundEngine.startMusic();
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Keyboard navigation handler - Only allow going back to already completed chapters, NO FORWARD SKIPPING
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // Allow only backward navigation to previously visited chapters
      if (e.key === 'ArrowLeft') {
        const currentIndex = SECTIONS.indexOf(currentSection);
        if (currentIndex > 0) {
          const prev = SECTIONS[currentIndex - 1];
          if (unlockedSections.includes(prev)) {
            e.preventDefault();
            setCurrentSection(prev);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, unlockedSections]);

  // Keep scroll position reset on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  return (
    <div className="relative min-h-screen w-full bg-[#050A14] text-[#F8FAFC] selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden flex flex-col">
      {/* Dynamic Animated Starry Background Canvas */}
      <NightSkyCanvas
        intensity={
          currentSection === 'finale'
            ? 'finale'
            : currentSection === 'night-sky'
            ? 'cinematic'
            : particleIntensity
        }
      />

      {/* Optional Birthday Confetti Overlay */}
      <CelebrationOverlay active={celebrationMode} />

      {/* Sleek Header Bar */}
      <header className="relative z-20 flex justify-between items-center px-6 sm:px-12 pt-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col text-left">
          <span className="text-[10px] tracking-[0.3em] text-[#22D3EE] uppercase font-bold mb-1">
            Private Experience
          </span>
          <h1 className="text-xl sm:text-2xl font-serif italic text-[#CBD5E1]">
            Hey Adnan...
          </h1>
        </div>

        {/* Floating Audio Controller in Top Right */}
        <MusicPlayer />
      </header>

      {/* Main Experience Screen with Animated Transitions */}
      <main className="relative z-10 flex-1 w-full flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {currentSection === 'intro' && (
            <motion.section
              key="section-intro"
              variants={introContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <IntroSection
                onEnter={() => unlockAndNavigate('reveal')}
                onDiscoverEgg={handleDiscoverEgg}
                discoveredEggs={discoveredEggs}
              />
            </motion.section>
          )}

          {currentSection === 'reveal' && (
            <motion.section
              key="section-reveal"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <BirthdayRevealSection
                onContinue={() => unlockAndNavigate('wishes')}
                onDiscoverEgg={handleDiscoverEgg}
                discoveredEggs={discoveredEggs}
              />
            </motion.section>
          )}

          {currentSection === 'wishes' && (
            <motion.section
              key="section-wishes"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <ThreeWishesSection
                onContinue={() => unlockAndNavigate('gift')}
                onDiscoverEgg={handleDiscoverEgg}
                discoveredEggs={discoveredEggs}
              />
            </motion.section>
          )}

          {currentSection === 'gift' && (
            <motion.section
              key="section-gift"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <GiftBoxSection
                onContinue={() => unlockAndNavigate('letter')}
                onDiscoverEgg={handleDiscoverEgg}
                discoveredEggs={discoveredEggs}
              />
            </motion.section>
          )}

          {currentSection === 'letter' && (
            <motion.section
              key="section-letter"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <LetterSection
                onContinue={() => unlockAndNavigate('never-forget')}
                onDiscoverEgg={handleDiscoverEgg}
                discoveredEggs={discoveredEggs}
              />
            </motion.section>
          )}

          {currentSection === 'never-forget' && (
            <motion.section
              key="section-never-forget"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <NeverForgetSection
                onContinue={() => unlockAndNavigate('night-sky')}
                onDiscoverEgg={handleDiscoverEgg}
                discoveredEggs={discoveredEggs}
              />
            </motion.section>
          )}

          {currentSection === 'night-sky' && (
            <motion.section
              key="section-night-sky"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <NightSkyContemplationSection
                onContinue={() => unlockAndNavigate('choice')}
                onDiscoverEgg={handleDiscoverEgg}
                discoveredEggs={discoveredEggs}
              />
            </motion.section>
          )}

          {currentSection === 'choice' && (
            <motion.section
              key="section-choice"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <BirthdayChoiceSection onContinue={() => unlockAndNavigate('heart-message')} />
            </motion.section>
          )}

          {currentSection === 'heart-message' && (
            <motion.section
              key="section-heart-message"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <HeartMessageSection onContinue={() => unlockAndNavigate('finale')} />
            </motion.section>
          )}

          {currentSection === 'finale' && (
            <motion.section
              key="section-finale"
              variants={sectionContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <FinalSurpriseSection onRestart={handleRestart} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Discrete Bottom Chapter Indicator & Navigator */}
      <NavigationProgress
        currentSection={currentSection}
        onSelectSection={(section) => setCurrentSection(section)}
        unlockedSections={unlockedSections}
        particleIntensity={particleIntensity}
        setParticleIntensity={setParticleIntensity}
        celebrationMode={celebrationMode}
        setCelebrationMode={setCelebrationMode}
        discoveredEggs={discoveredEggs}
        onOpenEggModal={setActiveEggModal}
      />

      {/* Interactive Easter Egg Discovery Modal */}
      <EasterEggModal
        egg={activeEggModal}
        onClose={() => setActiveEggModal(null)}
        discoveredCount={discoveredEggs.length}
        totalCount={EASTER_EGGS.length}
      />

      {/* Sleek Bottom Accent Line */}
      <div className="fixed bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/40 to-transparent pointer-events-none z-30" />
    </div>
  );
}
