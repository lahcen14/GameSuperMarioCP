import React from 'react';
import { Play, Map, BookOpen, Trophy, Settings, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';
import { PlayerProgress } from '../types/game';

interface TitleScreenProps {
  progress: PlayerProgress;
  isMuted: boolean;
  onToggleMute: () => void;
  onUpdatePlayerName?: (name: string) => void;
  onStartGame: () => void;
  onOpenMap: () => void;
  onOpenEncyclopedia: () => void;
  onOpenAchievements: () => void;
  onOpenCertificate: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  progress,
  isMuted,
  onToggleMute,
  onStartGame,
  onOpenMap,
  onOpenEncyclopedia,
  onOpenAchievements,
  onOpenCertificate,
  onOpenSettings,
}) => {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Background cyber scanlines and circuit mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with game badge, sound toggle & certificate link */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-semibold">منصة تعليمية تفاعلية · علوم الحاسوب والعتاد</span>
        </div>

        <div className="flex items-center gap-2">
          {progress.hasCompletedFinalBoss ? (
            <button
              onClick={() => {
                retroAudio.playJump();
                onOpenCertificate();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/60 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all shadow-md animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>شهادتك المعتمدة</span>
            </button>
          ) : (
            <button
              onClick={() => {
                retroAudio.playJump();
                onOpenCertificate();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              title="معاينة نموذج شهادة إتمام المغامرة"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>نموذج الشهادة المعتمدة</span>
            </button>
          )}

          <button
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              onToggleMute();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Central Hero Banner & Menu */}
      <main className="relative z-10 max-w-xl mx-auto w-full text-center space-y-4 my-auto py-4">
        {/* Animated Game Logo */}
        <div className="space-y-2">
          <div className="inline-block p-3.5 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/20 relative">
            <div className="w-16 h-16 mx-auto flex items-center justify-center relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center shadow-lg">
                <span className="font-pixel text-xl text-slate-950 font-black">CWA</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            مغامرة عالم الحاسوب
          </h1>
          <p className="font-pixel text-[11px] sm:text-xs text-cyan-400 tracking-wider">
            COMPUTER WORLD ADVENTURE
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
            رحلة المنصات والقفز الكلاسيكية لاستكشاف مكونات الحاسوب والعتاد والبرمجيات عبر محطات تعليمية وتحديات تفاعلية مشوقة!
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5 max-w-sm mx-auto pt-3">
          <button
            onClick={() => {
              retroAudio.playJump();
              onStartGame();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>{progress.completedStages.length > 0 ? 'متابعة المغامرة' : 'ابدأ المغامرة'}</span>
          </button>

          <button
            onClick={() => {
              retroAudio.playJump();
              onOpenMap();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Map className="w-4 h-4 text-cyan-400" />
            <span>خريطة المراحل (5 مراحل)</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                retroAudio.playJump();
                onOpenEncyclopedia();
              }}
              className="py-2.5 px-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>بنك الأسئلة (105+)</span>
            </button>

            <button
              onClick={() => {
                retroAudio.playJump();
                onOpenAchievements();
              }}
              className="py-2.5 px-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>الأوسمة ({progress.unlockedBadges.length}/8)</span>
            </button>
          </div>

          <button
            onClick={() => {
              retroAudio.playJump();
              onOpenSettings();
            }}
            className="w-full py-2 px-4 rounded-xl text-slate-400 hover:text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>الإعدادات والتحكم بالصوت</span>
          </button>
        </div>
      </main>

      {/* Footer with Developer / Creator Name exclusively at bottom of the interface */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full pt-4 pb-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>مغامرة عالم الحاسوب التعليمية · مناسبة لجميع الأجهزة</span>
        </div>

        {/* Developer Attribution Card at the bottom */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/50 text-amber-300 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>فكرة وتطوير وإشراف:</span>
          <strong className="text-amber-200 font-extrabold text-xs sm:text-sm underline decoration-amber-400/50 underline-offset-4">
            الأستاذ بوشريط لحسن
          </strong>
        </div>
      </footer>
    </div>
  );
};
