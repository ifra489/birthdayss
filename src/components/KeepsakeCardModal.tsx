import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Sparkles, X, Award, Heart } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface KeepsakeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeepsakeCardModal: React.FC<KeepsakeCardModalProps> = ({ isOpen, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  // Helper for automated canvas text wrapping
  const renderWrappedCanvasText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = startY;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight;
  };

  const handleDownloadImage = () => {
    setIsDownloading(true);
    soundEngine.playSuccessSound();

    try {
      // High-resolution canvas (1200 x 850)
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // 1. Deep midnight gradient background
        const grad = ctx.createLinearGradient(0, 0, 1200, 850);
        grad.addColorStop(0, '#040812');
        grad.addColorStop(0.35, '#0B1B33');
        grad.addColorStop(0.7, '#07101E');
        grad.addColorStop(1, '#02050D');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 850);

        // 2. Star dust particles
        for (let i = 0; i < 180; i++) {
          const sx = Math.random() * 1200;
          const sy = Math.random() * 850;
          const radius = Math.random() * 1.6 + 0.3;
          const alpha = 0.2 + Math.random() * 0.75;
          ctx.beginPath();
          ctx.arc(sx, sy, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
          ctx.fill();
        }

        // 3. Ambient blue/cyan glow in center
        const radialGlow = ctx.createRadialGradient(600, 420, 20, 600, 420, 450);
        radialGlow.addColorStop(0, 'rgba(37, 99, 235, 0.22)');
        radialGlow.addColorStop(0.6, 'rgba(34, 211, 238, 0.08)');
        radialGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGlow;
        ctx.fillRect(0, 0, 1200, 850);

        // 4. Outer & Inner decorative border
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, 1100, 750);

        ctx.strokeStyle = 'rgba(37, 99, 235, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(62, 62, 1076, 726);

        // Corner diamond accents
        const corners = [
          [50, 50],
          [1150, 50],
          [50, 800],
          [1150, 800],
        ];
        corners.forEach(([cx, cy]) => {
          ctx.beginPath();
          ctx.arc(cx, cy, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#22D3EE';
          ctx.fill();
        });

        // 5. Header tag (kept well within maxWidth 900)
        ctx.font = 'bold 15px "Courier New", monospace';
        ctx.fillStyle = '#22D3EE';
        ctx.textAlign = 'center';
        ctx.fillText('OFFICIAL BIRTHDAY COMMEMORATIVE KEEPSAKE • 2026', 600, 125);

        // 6. Name Title
        ctx.font = 'bold 48px "Cinzel", Georgia, serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('ADNAN', 600, 190);

        // 7. Subheading
        ctx.font = 'italic 19px Georgia, serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('May Allah write barakah, peace, and ease in every single step.', 600, 230);

        // 8. Divider line
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(420, 260);
        ctx.lineTo(780, 260);
        ctx.stroke();

        // 9. Main Body Quotes (Using wrapped text helper to guarantee zero overflow)
        ctx.font = '22px Georgia, serif';
        ctx.fillStyle = '#E2E8F0';
        ctx.textAlign = 'center';
        let curY = 320;

        curY = renderWrappedCanvasText(
          ctx,
          '"On your birthday, I don’t just wish you a single happy day.',
          600,
          curY,
          920,
          32
        );

        ctx.font = 'italic bold 23px Georgia, serif';
        ctx.fillStyle = '#38BDF8';
        curY = renderWrappedCanvasText(
          ctx,
          'I wish you a beautiful year, and an even more beautiful life ahead."',
          600,
          curY + 8,
          920,
          34
        );

        // Blessings paragraph
        ctx.font = '18px Georgia, serif';
        ctx.fillStyle = '#CBD5E1';
        curY = renderWrappedCanvasText(
          ctx,
          'May your heart always find calm, your efforts meet immense success, and every dream you quietly work towards be realized with ease.',
          600,
          curY + 24,
          880,
          28
        );

        // 10. Wax seal emblem
        const sealY = Math.max(curY + 45, 595);
        ctx.beginPath();
        ctx.arc(600, sealY, 34, 0, Math.PI * 2);
        const sealGrad = ctx.createLinearGradient(566, sealY - 34, 634, sealY + 34);
        sealGrad.addColorStop(0, '#1E3A8A');
        sealGrad.addColorStop(1, '#0284C7');
        ctx.fillStyle = sealGrad;
        ctx.fill();
        ctx.strokeStyle = '#22D3EE';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.font = 'bold 22px "Cinzel", Georgia, serif';
        ctx.fillStyle = '#E0F2FE';
        ctx.fillText('A', 600, sealY + 8);

        // 11. Footer note & Signature
        ctx.font = 'italic 17px Georgia, serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('Handcrafted with sincere prayers & thought,', 600, sealY + 68);

        ctx.font = 'bold 34px "Caveat", cursive, Georgia, serif';
        ctx.fillStyle = '#22D3EE';
        ctx.fillText('— Ifra 🌙', 600, sealY + 115);

        // 12. Trigger image download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'Adnan-Birthday-Keepsake-2026.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // Fallback
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-[#0B1528] border border-[#2563EB]/40 rounded-3xl p-4 sm:p-8 md:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-center my-6 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#050A14]/80 border border-[#2563EB]/30 text-[#CBD5E1]/70 hover:text-white hover:border-[#22D3EE] transition-all cursor-pointer z-20"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1B33]/80 border border-[#22D3EE]/30 text-[#22D3EE] text-[10px] tracking-[0.25em] uppercase font-bold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Digital Keepsake Token</span>
          </div>

          {/* Keepsake Visual Card Preview */}
          <div
            ref={cardRef}
            className="relative w-full rounded-2xl bg-gradient-to-b from-[#0B1B33]/90 via-[#0B1528]/95 to-[#040810] border border-[#22D3EE]/40 p-5 sm:p-7 md:p-8 text-left shadow-2xl overflow-hidden mb-6 backdrop-blur-xl"
          >
            {/* Subtle glow backdrop */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header row with Badge & Monogram Seal */}
            <div className="flex items-center justify-between border-b border-[#2563EB]/25 pb-3 mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#22D3EE] font-bold">
                  Commemorative Card • 2026
                </p>
                <h3 className="font-cinzel text-xl sm:text-2xl text-white font-bold tracking-wider mt-0.5">
                  ADNAN
                </h3>
              </div>

              {/* Monogram Seal */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-[#0284C7] border-2 border-cyan-400/80 shadow-md shadow-cyan-950 flex items-center justify-center flex-shrink-0">
                <span className="font-cinzel text-xs font-bold text-cyan-200">A</span>
              </div>
            </div>

            {/* Message Body with clean font sizing and balanced line breaks */}
            <div className="space-y-3 font-serif text-sm sm:text-base text-[#CBD5E1] leading-relaxed break-words my-4">
              <p className="text-[#F8FAFC] font-semibold text-base sm:text-lg">
                Happy Birthday! 🌙
              </p>
              <p className="italic text-slate-300">
                "On your birthday, I don’t just wish you a single happy day. I wish you a beautiful year, and an even more beautiful life ahead."
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                May your heart always find peace, your efforts meet immense success, and every dream you quietly work towards be realized with ease.
              </p>
            </div>

            {/* Footer row */}
            <div className="pt-3.5 border-t border-[#2563EB]/25 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] sm:text-xs font-serif italic text-[#94A3B8]">
                Made with sincere prayers,
              </span>
              <span className="font-handwriting text-2xl sm:text-3xl text-[#22D3EE] font-bold">
                — Ifra 🌙
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              id="download-keepsake-btn"
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating High-Res...' : 'Save & Download Card (PNG)'}</span>
            </button>
          </div>

          <p className="text-[11px] text-[#CBD5E1]/50 mt-4 font-light">
            You can download this high-resolution card to your device and keep it saved forever.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
