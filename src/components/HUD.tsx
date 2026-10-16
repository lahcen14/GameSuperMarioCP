import React from 'react';
import { Heart, Coins, Award, Volume2, VolumeX, Pause, HelpCircle } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface HUDProps {
  hearts: number;
  maxHearts: number;
  score: number;
  coins: number;
  stageNameAr: string;
  solvedCount: number;
  totalTerminals: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onOpenHelp: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  hearts,
  maxHearts,
  score,
  coins,
  stageNameAr,
  solvedCount,
  totalTerminals,
  isMuted,
  onToggleMute,
  onPause,
  onOpenHelp,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-3 pointer-events-none select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Hearts & Coins */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg pointer-events-auto">
          {/* Hearts */}
          <div className="flex items-center gap-1" title="نقاط الحياة">
            {Array.from({ length: maxHearts }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-transform ${
                  i < hearts
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-600 fill-slate-800 scale-90'
                }`}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-slate-700 mx-1" aria-hidden="true" />

          {/* Coins */}
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm tabular-nums" title="العملات المجمعة">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{coins}</span>
          </div>

          <div className="h-4 w-px bg-slate-700 mx-1" aria-hidden="true" />

          {/* Score */}
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-sm tabular-nums" title="النقاط">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>{score}</span>
          </div>
        </div>

        {/* Center: Stage Name & Terminal Progress */}
        <div className="hidden sm:flex items-center gap-2.5 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-4 py-1.5 rounded-xl shadow-lg pointer-events-auto">
          <span className="font-bold text-sm text-slate-200">{stageNameAr}</span>
          <span className="text-slate-500">·</span>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              محطات الأسئلة: {solvedCount} / {totalTerminals}
            </span>
          </div>
        </div>

        {/* Right: Sound & Pause Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              retroAudio.playJump();
              onToggleMute();
            }}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shadow-lg active:scale-95"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            aria-label="تبديل كتم الصوت"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              onOpenHelp();
            }}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shadow-lg active:scale-95 text-xs font-bold"
            title="تعليمات التحكم"
            aria-label="تعليمات التحكم"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              onPause();
            }}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shadow-lg active:scale-95"
            title="إيقاف مؤقت"
            aria-label="إيقاف مؤقت"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
