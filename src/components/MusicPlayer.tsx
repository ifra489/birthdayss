import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, CloudRain, Orbit, Music, Sliders } from 'lucide-react';
import { soundEngine, SoundscapeMode } from '../utils/soundEngine';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentMode, setCurrentMode] = useState<SoundscapeMode>('birthday');
  const [volume, setVolume] = useState<number>(0.35);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showMenu]);

  const handleTogglePlay = () => {
    const playing = soundEngine.toggleMusic((status) => {
      setIsPlaying(status);
    });
    setIsPlaying(playing);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleModeSelect = (mode: SoundscapeMode) => {
    setCurrentMode(mode);
    soundEngine.setMode(mode);
    if (!isPlaying) {
      handleTogglePlay();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  const soundscapes: { id: SoundscapeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'birthday',
      label: 'Birthday Lullaby',
      icon: <Music className="w-3.5 h-3.5 text-[#22D3EE]" />,
      desc: 'Sweet music-box Happy Birthday melody & warm celestial pads',
    },
    {
      id: 'celestial',
      label: 'Deep Starlight',
      icon: <Orbit className="w-3.5 h-3.5 text-[#60A5FA]" />,
      desc: 'Peaceful celestial ambient chords & crystal chimes',
    },
    {
      id: 'rain',
      label: 'Midnight Rain',
      icon: <CloudRain className="w-3.5 h-3.5 text-[#93C5FD]" />,
      desc: 'Gentle night rain & warm soothing harmonic pads',
    },
    {
      id: 'zen',
      label: 'Cosmic Zen',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />,
      desc: 'Mystical pentatonic resonance & tranquil bell tones',
    },
  ];

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2" ref={menuRef}>
      {/* Soundscape Track Selector & Play Button */}
      <button
        id="ambient-music-toggle-btn"
        onClick={handleTogglePlay}
        className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-bold tracking-widest uppercase transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer ${
          isPlaying
            ? 'bg-[#0B1220]/80 border-[#22D3EE]/50 text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.25)]'
            : 'bg-[#0B1220]/60 border-[#2563EB]/20 text-[#CBD5E1]/70 hover:border-[#2563EB]/50 hover:text-white'
        }`}
        title={isPlaying ? 'Pause background atmosphere' : 'Play peaceful background atmosphere'}
      >
        <span className="relative flex h-2 w-2">
          {isPlaying && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isPlaying ? 'bg-[#22D3EE]' : 'bg-[#CBD5E1]/40'
            }`}
          ></span>
        </span>

        {isPlaying ? (
          <div className="flex items-center gap-2">
            <span>
              {currentMode === 'birthday'
                ? '🎂 Birthday'
                : currentMode === 'rain'
                ? '🌧️ Rain'
                : currentMode === 'zen'
                ? '🧘 Zen'
                : '♪ Starlight'}
            </span>
            {/* Animated mini sound bars */}
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#22D3EE] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5"></span>
              <span className="w-0.5 bg-[#3B82F6] rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-3"></span>
              <span className="w-0.5 bg-[#22D3EE] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2"></span>
              <span className="w-0.5 bg-white rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.1s] h-3.5"></span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span>♪ Play Music</span>
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </button>

      {/* Soundscape / Volume Settings Toggle */}
      <button
        id="soundscape-menu-btn"
        onClick={() => setShowMenu(!showMenu)}
        className={`p-2 rounded-full border transition-all backdrop-blur-md cursor-pointer ${
          showMenu
            ? 'bg-[#2563EB] border-[#22D3EE] text-white shadow-[0_0_10px_rgba(34,211,238,0.4)]'
            : 'bg-[#0B1220]/70 border-[#2563EB]/25 text-[#CBD5E1]/60 hover:text-white hover:border-[#2563EB]/50'
        }`}
        title="Choose Soundscape & Atmosphere"
      >
        <Sliders className="w-3.5 h-3.5" />
      </button>

      {/* Quick Mute Toggle */}
      {isPlaying && (
        <button
          id="music-mute-btn"
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-[#0B1220]/70 border border-[#2563EB]/20 text-[#CBD5E1]/60 hover:text-white hover:border-[#2563EB]/50 transition-all backdrop-blur-md cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#22D3EE]" />}
        </button>
      )}

      {/* Sleek Moon Emblem */}
      <div className="w-8 h-8 rounded-full border border-white/10 bg-[#0B1220]/50 backdrop-blur-md flex items-center justify-center text-xs shadow-md">
        🌙
      </div>

      {/* Soundscape Selector Popover Menu */}
      {showMenu && (
        <div className="absolute top-full right-0 mt-3 w-72 p-4 rounded-2xl bg-[#0B1220]/95 border border-[#2563EB]/40 shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-left z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#2563EB]/20 pb-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F8FAFC]">
              <Music className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Soundscape Modes</span>
            </div>
            <span className="text-[10px] font-mono text-[#22D3EE]">
              {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>

          {/* Soundscape List */}
          <div className="space-y-2 mb-4">
            {soundscapes.map((track) => {
              const isCurrent = currentMode === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleModeSelect(track.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                    isCurrent
                      ? 'bg-[#2563EB]/25 border-[#22D3EE]/60 text-white shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                      : 'bg-[#050A14]/70 border-[#2563EB]/20 text-[#CBD5E1]/70 hover:border-[#2563EB]/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-xs text-[#F8FAFC]">
                      {track.icon}
                      <span>{track.label}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[9px] font-mono text-[#22D3EE] font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#CBD5E1]/60 font-light leading-relaxed pl-5.5">
                    {track.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="pt-2 border-t border-[#2563EB]/20">
            <div className="flex items-center justify-between text-[11px] text-[#CBD5E1]/70 mb-1.5">
              <span>Volume</span>
              <span className="font-mono text-[#22D3EE]">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

