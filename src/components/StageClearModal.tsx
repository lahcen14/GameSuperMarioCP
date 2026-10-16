import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Coins, Award, ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface StageClearModalProps {
  stageId: number;
  stageNameAr: string;
  score: number;
  coins: number;
  stars: number;
  isLastStage: boolean;
  onNextStage: () => void;
  onReplay: () => void;
  onWorldMap: () => void;
  onViewCertificate?: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  stageId,
  stageNameAr,
  score,
  coins,
  stars,
  isLastStage,
  onNextStage,
  onReplay,
  onWorldMap,
  onViewCertificate,
}) => {
  useEffect(() => {
    retroAudio.playStageClear();

    // Trigger colorful confetti shower
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-500/70 rounded-3xl shadow-2xl overflow-hidden text-center p-6 space-y-6">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-xs font-bold text-emerald-300">
            <Trophy className="w-3.5 h-3.5" />
            <span>تم إنجاز المرحلة بنجاح!</span>
          </div>
          <h2 className="text-2xl font-black text-white">{stageNameAr}</h2>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`p-2 rounded-2xl border transition-all duration-300 ${
                starIndex <= stars
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/40 border-slate-700 text-slate-600 scale-95'
              }`}
            >
              <Star className={`w-8 h-8 ${starIndex <= stars ? 'fill-amber-400 animate-bounce' : ''}`} />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-200">
          <div className="flex flex-col items-center gap-1 p-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>النقاط المكتسبة</span>
            </div>
            <span className="text-xl font-black text-cyan-300 tabular-nums">{score}</span>
          </div>

          <div className="flex flex-col items-center gap-1 p-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>العملات المجمعة</span>
            </div>
            <span className="text-xl font-black text-amber-300 tabular-nums">{coins}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {isLastStage && onViewCertificate ? (
            <button
              onClick={onViewCertificate}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-pink-900/40 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Trophy className="w-5 h-5" />
              <span>استلام شهادة التخرج الرسمية</span>
            </button>
          ) : (
            <button
              onClick={onNextStage}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>المرحلة التالية ({stageId + 1})</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة المرحلة</span>
            </button>

            <button
              onClick={onWorldMap}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              خريطة المراحل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
