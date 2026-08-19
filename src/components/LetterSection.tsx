import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Feather } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { EasterEggTrigger } from './EasterEggTrigger';
import { EasterEgg } from '../types';

interface LetterSectionProps {
  onContinue: () => void;
  onDiscoverEgg?: (egg: EasterEgg) => void;
  discoveredEggs?: string[];
}

const inkBleedContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.008,
      delayChildren: 0.02,
    },
  },
};

const inkBleedItemVariants = {
  hidden: {
    opacity: 0,
    y: 3,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export const LetterSection: React.FC<LetterSectionProps> = ({
  onContinue,
  onDiscoverEgg,
  discoveredEggs = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenLetter = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    soundEngine.playWaxSealBreak();

    setTimeout(() => {
      soundEngine.playUnwrapSound();
      setIsOpen(true);
      setIsOpening(false);
    }, 150);
  };

  const handleContinue = () => {
    soundEngine.playBellChime(587.33, 0.15);
    onContinue();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center select-none">
      <div className="max-w-2xl z-10 w-full flex flex-col items-center">
        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/80 border border-[#2563EB]/30 text-[#22D3EE] text-xs tracking-widest uppercase mb-4 font-mono shadow-[0_0_15px_rgba(34,211,238,0.15)]"
        >
          <Feather className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>CHAPTER 5 • A LETTER FOR YOU</span>
        </motion.div>

        {/* Envelope & Letter Container */}
        <div className="w-full flex flex-col items-center mt-2">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="closed-envelope-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center my-4"
              >
                {/* Visual Luxury Navy/Black Envelope */}
                <div
                  id="interactive-envelope"
                  onClick={handleOpenLetter}
                  className={`group relative w-80 sm:w-96 h-52 sm:h-60 rounded-2xl bg-gradient-to-b from-[#0B1426] via-[#080E1A] to-[#030712] border border-[#2563EB]/40 p-6 flex flex-col items-center justify-center cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(37,99,235,0.25)] hover:border-[#22D3EE]/70 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-400 backdrop-blur-xl ${
                    isOpening ? 'scale-95 blur-[1px]' : ''
                  }`}
                >
                  {/* Silver Foil Trim Accents */}
                  <div className="absolute inset-2 border border-slate-400/20 rounded-xl pointer-events-none" />

                  {/* Envelope Flap Triangle */}
                  <div className="absolute top-0 inset-x-0 h-24 border-b border-cyan-500/20 bg-gradient-to-b from-[#111C33] to-transparent clip-path-triangle opacity-90" />

                  {/* Animated Breaking Wax Seal with Monogram 'A' */}
                  <div className="relative z-20 flex items-center justify-center my-1">
                    {!isOpening ? (
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-[#0284C7] border-2 border-cyan-300/90 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.45),inset_0_2px_4px_rgba(255,255,255,0.35)] ring-2 ring-cyan-400/30 group-hover:ring-cyan-300/60 transition-all cursor-pointer"
                      >
                        {/* Decorative Wax Drip Edges */}
                        <div className="absolute -inset-1 rounded-full border border-cyan-400/20 blur-[1px] animate-pulse" />
                        <div className="absolute top-0 left-2 w-3 h-2 bg-blue-600/40 rounded-full blur-[1px]" />
                        <div className="absolute bottom-1 right-2 w-3 h-2 bg-cyan-400/40 rounded-full blur-[1px]" />

                        {/* Inner embossed stamp ring */}
                        <div className="w-11 h-11 rounded-full border border-cyan-200/50 flex items-center justify-center bg-gradient-to-tr from-[#0F172A] to-[#1E3A8A]">
                          <span className="font-cinzel text-xl font-bold text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            A
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      /* Breaking and Fading Wax Seal Animation */
                      <div className="relative w-16 h-16 flex items-center justify-center pointer-events-none">
                        {/* Central Flash Burst */}
                        <motion.div
                          initial={{ scale: 0.5, opacity: 1 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className="absolute w-12 h-12 rounded-full bg-cyan-300 blur-sm -z-10"
                        />

                        {/* Left Breaking Shard */}
                        <motion.div
                          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: -28,
                            y: -14,
                            rotate: -35,
                            opacity: 0,
                            scale: 0.75,
                          }}
                          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                          className="absolute left-0 w-8 h-16 overflow-hidden flex items-center justify-end"
                        >
                          <div className="w-16 h-16 -mr-8 rounded-full bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-[#0284C7] border-2 border-cyan-300/80 shadow-lg flex items-center justify-center">
                            <span className="font-cinzel text-xl font-bold text-white pr-4">A</span>
                          </div>
                        </motion.div>

                        {/* Right Breaking Shard */}
                        <motion.div
                          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: 28,
                            y: 12,
                            rotate: 40,
                            opacity: 0,
                            scale: 0.75,
                          }}
                          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                          className="absolute right-0 w-8 h-16 overflow-hidden flex items-center justify-start"
                        >
                          <div className="w-16 h-16 -ml-8 rounded-full bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-[#0284C7] border-2 border-cyan-300/80 shadow-lg flex items-center justify-center">
                            <span className="font-cinzel text-xl font-bold text-white pl-4">A</span>
                          </div>
                        </motion.div>

                        {/* Wax Fragment Particles */}
                        {[...Array(6)].map((_, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                              x: (Math.cos((idx * Math.PI) / 3) * 36) + (Math.random() * 8 - 4),
                              y: (Math.sin((idx * Math.PI) / 3) * 36) + (Math.random() * 8 - 4),
                              opacity: 0,
                              scale: 0.3,
                            }}
                            transition={{ duration: 0.55, delay: idx * 0.02, ease: 'easeOut' }}
                            className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-cyan-300 to-white shadow-[0_0_6px_#22D3EE]"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Envelope Text */}
                  <p className="mt-4 font-poppins text-base sm:text-lg text-[#F8FAFC] tracking-wide font-medium">
                    For Adnan
                  </p>
                  <p className="text-xs text-[#CBD5E1]/70 font-poppins font-light mt-1">
                    Open when you're ready.
                  </p>
                </div>

                {/* Open Button */}
                <button
                  id="open-letter-btn"
                  onClick={handleOpenLetter}
                  disabled={isOpening}
                  className="mt-8 group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0B1B33] hover:bg-[#2563EB] text-[#F8FAFC] border border-[#2563EB]/50 hover:border-[#22D3EE] font-poppins font-semibold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 cursor-pointer"
                >
                  <Feather className="w-3.5 h-3.5 text-[#22D3EE] group-hover:scale-110 transition-transform" />
                  <span>Open when you're ready ✉️</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="opened-letter-sheet"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl text-left"
              >
                {/* Vintage Physical Handwritten Parchment Letter Sheet */}
                <div className="relative rounded-2xl vintage-parchment-sheet border border-[#2563EB]/40 p-7 sm:p-10 sm:pl-14 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_10px_25px_-5px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden transition-transform duration-300">
                  {/* Subtle Red Margin Line */}
                  <div className="absolute top-0 bottom-0 left-6 sm:left-9 w-[1.5px] bg-rose-400/20 pointer-events-none" />

                  {/* Horizontal Paper Crease in the middle */}
                  <div className="absolute top-1/2 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute top-[calc(50%+1px)] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

                  {/* Top Gilded Header Edge */}
                  <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/40 to-transparent" />

                  {/* Wax Seal Stamp in corner */}
                  <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-[#0284C7] border-2 border-cyan-400/60 shadow-lg shadow-cyan-950/80 flex items-center justify-center ring-2 ring-cyan-500/20">
                      <span className="font-cinzel text-xs font-bold text-cyan-200">A</span>
                    </div>
                    {onDiscoverEgg && (
                      <EasterEggTrigger
                        id="egg-letter-seal"
                        onDiscover={onDiscoverEgg}
                        isDiscovered={discoveredEggs.includes('egg-letter-seal')}
                      />
                    )}
                  </div>

                  {/* Header: "My love," in Poppins font */}
                  <div className="border-b border-[#2563EB]/25 pb-3 mb-6 pr-14">
                    <h3 className="font-poppins text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight mt-1 font-semibold">
                      My love,
                    </h3>
                  </div>

                  {/* Letter Body in Poppins font with staggered ink-bleed absorption animation */}
                  <motion.div
                    variants={inkBleedContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-5 text-[#CBD5E1] font-poppins text-sm sm:text-base leading-relaxed sm:leading-loose font-normal"
                  >
                    <motion.p variants={inkBleedItemVariants}>
                      I honestly don't know where to begin.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      I've tried to put my feelings into words so many times, but somehow, whenever it's about you, words never seem to be enough. How do I explain what you've become to me? How do I explain how someone who was once simply a person I talked to slowly became someone whose presence became such an important part of my everyday life?
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      I still think about how naturally everything between us started. There wasn't some perfect moment when I knew exactly what you would become to me. It happened quietly, through conversations, little jokes, random talks, and all those ordinary moments that I didn't realize I would one day treasure so much.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants} className="text-[#F8FAFC] font-medium text-base sm:text-lg text-cyan-100">
                      And now, when I look back, I realize that somewhere along the way, you became my person.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      I love so many little things about you.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      I love the way you talk to me. I love your voice, your laugh, your little habits, and even the things you probably don't realize I notice. Sometimes you do something so small that you probably forget it five minutes later, but somehow I remember it.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants} className="text-[#22D3EE] font-medium tracking-wide">
                      That's the thing about you.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants} className="text-[#F8FAFC] font-semibold text-lg sm:text-xl">
                      I notice you.
                    </motion.p>

                    <motion.div variants={inkBleedItemVariants} className="pl-3 sm:pl-4 border-l-2 border-cyan-400/40 space-y-1.5 text-slate-200">
                      <p>I notice when you're excited about something.</p>
                      <p>I notice when something is bothering you even when you don't say it.</p>
                      <p>I notice the things you're working toward and the person you're trying to become.</p>
                      <p>I notice the little changes in your voice, your mood, and the way you talk.</p>
                    </motion.div>

                    <motion.p variants={inkBleedItemVariants} className="text-cyan-200 font-medium">
                      And maybe I don't always tell you, but I notice more than you think.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      There are little things that belong only to us.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      Things no one else would understand.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      Things that can make me smile just because I remember them.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      You have also changed my ordinary days in ways you probably don't realize.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      There are days when everything feels exhausting or overwhelming, and then your message appears on my screen.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      Sometimes it's just a simple message.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      Sometimes it's a random conversation.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      Sometimes it's something completely silly.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants} className="text-[#F8FAFC] font-medium text-cyan-100">
                      But somehow, it can change my entire mood.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      I don't think you realize how much happiness you can bring into my life without even trying.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      And maybe that's why being loved by you feels so special to me.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      Not because everything is always perfect.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      Not because we never have difficult moments.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants} className="text-[#22D3EE] font-semibold text-base sm:text-lg">
                      But because even through everything, I still choose you.
                    </motion.p>

                    <motion.div variants={inkBleedItemVariants} className="space-y-1 text-slate-300">
                      <p>And I hope you know that you don't have to be perfect for me.</p>
                      <p>You don't have to have everything figured out.</p>
                      <p>You don't have to be strong every single day.</p>
                    </motion.div>

                    <motion.div variants={inkBleedItemVariants} className="space-y-1 text-slate-300">
                      <p>You can have bad days.</p>
                      <p>You can feel tired.</p>
                      <p>You can be confused.</p>
                      <p>You can have moments when you don't know what comes next.</p>
                    </motion.div>

                    <motion.p variants={inkBleedItemVariants} className="text-[#F8FAFC] font-medium text-cyan-200">
                      I just want you to know that I believe in you even on the days when you might not believe in yourself.
                    </motion.p>

                    <motion.div variants={inkBleedItemVariants} className="space-y-2 text-slate-200">
                      <p>I hope Allah opens doors for you that you never expected.</p>
                      <p>I hope your hard work turns into something beautiful.</p>
                      <p>I hope you become proud of the person you see when you look at yourself.</p>
                      <p>And on the days when things don't go your way, I hope you remember that one difficult day doesn't define your whole journey.</p>
                    </motion.div>

                    <motion.p variants={inkBleedItemVariants} className="text-[#22D3EE] font-semibold text-base sm:text-lg">
                      Keep going, Adnan.<br />
                      You have so much ahead of you.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      And yes, there are moments when I wish the distance between us didn't exist.
                    </motion.p>

                    <motion.div variants={inkBleedItemVariants} className="space-y-1 text-slate-300">
                      <p>I wish I could simply be there.</p>
                      <p>Not through a screen.</p>
                      <p>Not through a phone call.</p>
                      <p>Not through messages.</p>
                      <p className="text-white font-medium">Just there.</p>
                    </motion.div>

                    <motion.div variants={inkBleedItemVariants} className="pl-3 sm:pl-4 border-l-2 border-cyan-400/40 space-y-1 text-slate-200">
                      <p>Sitting beside you.</p>
                      <p>Listening to you talk.</p>
                      <p>Laughing at something stupid.</p>
                      <p>Going somewhere together.</p>
                      <p>Eating together.</p>
                      <p>Having those completely ordinary moments that couples sometimes take for granted.</p>
                    </motion.div>

                    <motion.p variants={inkBleedItemVariants} className="text-[#F8FAFC] font-medium">
                      I want those ordinary moments with you.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants}>
                      I want the kind of memories that don't need a camera because we'll remember them anyway.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants} className="text-[#22D3EE] font-medium text-base sm:text-lg">
                      And maybe that's what I look forward to the most — the day when “I wish you were here” finally becomes “I'm glad you're here.”
                    </motion.p>

                    <motion.div variants={inkBleedItemVariants} className="space-y-1 text-slate-300">
                      <p>Until then, I'll keep every little moment we have.</p>
                      <p>Every conversation.</p>
                      <p>Every laugh.</p>
                      <p>Every silly argument.</p>
                      <p>Every late-night talk.</p>
                      <p>Every “good morning.”</p>
                      <p>Every “goodnight.”</p>
                      <p>Every moment when you made me smile without even knowing it.</p>
                    </motion.div>

                    <motion.p variants={inkBleedItemVariants} className="text-cyan-200">
                      Because somehow, all of those little things became part of our story.
                    </motion.p>

                    <motion.div variants={inkBleedItemVariants} className="space-y-2 text-slate-200">
                      <p>
                        And if I could choose one thing for us, it wouldn't be a perfect life. It wouldn't be a life without problems. It would simply be a life where, no matter how difficult things become, we keep finding our way back to each other.
                      </p>
                      <p className="text-cyan-100">
                        Where we continue growing.<br />
                        Where we continue understanding each other.<br />
                        Where we never stop choosing us.
                      </p>
                    </motion.div>

                    <motion.p variants={inkBleedItemVariants}>
                      I don't know exactly what the future will look like.
                    </motion.p>

                    <motion.div variants={inkBleedItemVariants} className="space-y-2 text-slate-200">
                      <p>But when I imagine the beautiful parts of it, somehow, you're there.</p>
                      <p>I imagine finally meeting you.</p>
                      <p>Finally seeing you in front of me instead of through a screen.</p>
                      <p>Finally getting to give you the hug I've been saving.</p>
                      <p className="text-cyan-200 font-medium">And probably laughing because after waiting so long, one hug won't feel nearly long enough. 🤍</p>
                    </motion.div>

                    <motion.div variants={inkBleedItemVariants} className="pt-2 space-y-1.5 text-slate-200">
                      <p className="font-medium text-white">Until that day comes, I want you to know something very simple:</p>
                      <p className="text-cyan-300 font-semibold text-base sm:text-lg">I'm proud of you.</p>
                      <p className="text-cyan-300 font-semibold text-base sm:text-lg">I'm grateful for you.</p>
                      <p className="text-cyan-300 font-semibold text-base sm:text-lg">I pray for you.</p>
                      <p className="text-cyan-300 font-semibold text-base sm:text-lg">I believe in you.</p>
                      <p className="text-slate-300 pt-1">Not just because of the way you make me feel, but because of who you are.</p>
                    </motion.div>

                    <motion.div variants={inkBleedItemVariants} className="space-y-1 text-slate-300">
                      <p>Thank you for all the little things you do.</p>
                      <p>Thank you for every conversation.</p>
                      <p>Thank you for every memory.</p>
                      <p>Thank you for making an ordinary day feel a little less ordinary.</p>
                      <p className="text-white font-medium">And thank you for becoming someone so important to me without even realizing it was happening.</p>
                    </motion.div>

                    <motion.div variants={inkBleedItemVariants} className="space-y-1.5 text-slate-200">
                      <p>Maybe that's what I love most about our story.</p>
                      <p>It wasn't forced.</p>
                      <p>It wasn't planned.</p>
                      <p>It just happened.</p>
                      <p className="text-cyan-200 font-medium text-base sm:text-lg">And somewhere along the way, you became you and you became mine.</p>
                    </motion.div>

                    <motion.p variants={inkBleedItemVariants} className="text-slate-200">
                      So on your birthday, more than anything, I pray that Allah gives you a life filled with peace, success, happiness, good health, and everything your heart quietly wishes for.
                    </motion.p>

                    <motion.p variants={inkBleedItemVariants} className="text-slate-200">
                      And if Allah allows it, I hope one day we look back at this chapter from a completely different place and smile at how far we've come.
                    </motion.p>

                    <motion.div variants={inkBleedItemVariants} className="pt-2 space-y-1.5">
                      <p className="text-[#94A3B8] italic">Until then...</p>
                      <p className="text-white font-medium">Keep dreaming.</p>
                      <p className="text-white font-medium">Keep growing.</p>
                      <p className="text-white font-medium">Keep becoming the person you're meant to be.</p>
                      <p className="text-slate-200 pt-2 leading-relaxed">
                        And remember that somewhere, there is a girl who notices the little things about you, remembers the moments you probably forgot, prays for your happiness, believes in your dreams, and loves you more than these words could ever explain.
                      </p>
                    </motion.div>

                    <motion.div variants={inkBleedItemVariants} className="pt-4 pb-2 border-t border-[#2563EB]/25">
                      <p className="text-slate-300">
                        I hope this little corner of the internet reminds you of one thing:
                      </p>
                      <p className="text-[#22D3EE] font-semibold text-lg sm:text-xl pt-2 tracking-wide font-poppins">
                        You are deeply loved. Always.
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Signature Footer */}
                  <div className="mt-8 pt-6 border-t border-[#2563EB]/25 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <p className="text-xs sm:text-sm font-poppins italic text-[#94A3B8]">
                      Some things are easier to write than to say.
                    </p>
                    <div className="text-right">
                      <p className="font-poppins text-2xl sm:text-3xl text-[#22D3EE] font-bold tracking-tight">
                        — Ifra 🌙
                      </p>
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                <div className="mt-8 flex justify-center">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    id="letter-continue-btn"
                    onClick={handleContinue}
                    className="group inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-poppins font-semibold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-300 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
