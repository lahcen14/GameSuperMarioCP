import React from 'react';
import { STAGES_CONFIG } from '../data/questions';
import { PlayerProgress } from '../types/game';
import { Star, Lock, Play, ArrowRight, Trophy, BookOpen, Settings } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface WorldMapProps {
  progress: PlayerProgress;
  onSelectStage: (stageId: number) => void;
  onBackToTitle: () => void;
  onOpenEncyclopedia: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  progress,
  onSelectStage,
  onBackToTitle,
  onOpenEncyclopedia,
  onOpenAchievements,
  onOpenSettings,
}) => {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 overflow-y-auto">
      {/* Background Matrix/Grid decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between gap-4 py-3 border-b border-slate-800">
        <button
          onClick={() => {
            retroAudio.playJump();
            onBackToTitle();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>القائمة الرئيسية</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            خريطة مراحل عالم الحاسوب
          </h1>
          <p className="text-xs text-slate-400">اختر المرحلة لبدء المغامرة التعليمية</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              retroAudio.playJump();
              onOpenAchievements();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-colors"
            title="الأوسمة والإنجازات"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              retroAudio.playJump();
              onOpenEncyclopedia();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-cyan-400 text-xs font-bold transition-colors"
            title="الموسوعة وبنك الأسئلة"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              retroAudio.playJump();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
            title="الإعدادات"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Map Cards */}
      <main className="relative z-10 max-w-5xl mx-auto w-full flex-1 py-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STAGES_CONFIG.map((stage, idx) => {
            const isUnlocked = progress.unlockedStages.includes(stage.id);
            const isCompleted = progress.completedStages.includes(stage.id);
            const stars = progress.stageStars[stage.id] || 0;
            const highScore = progress.stageHighScores[stage.id] || 0;

            return (
              <div
                key={stage.id}
                className={`relative rounded-3xl border-2 transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-500/70 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1'
                    : 'bg-slate-950/70 border-slate-800/80 opacity-60'
                }`}
              >
                {/* Stage Theme Header Banner */}
                <div
                  className="p-4 border-b border-slate-800 relative overflow-hidden"
                  style={{ backgroundColor: `${stage.bgColor}30` }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-lg border font-mono"
                      style={{
                        color: stage.accentColor,
                        borderColor: `${stage.primaryColor}50`,
                        backgroundColor: `${stage.primaryColor}20`,
                      }}
                    >
                      المرحلة {stage.id}
                    </span>

                    {/* Stars achieved */}
                    {isUnlocked && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-0.5">{stage.nameAr}</h3>
                  <span className="text-xs text-slate-400 block font-medium">{stage.subtitleAr}</span>
                </div>

                {/* Stage Description & Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-300 leading-relaxed">{stage.descriptionAr}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>{stage.questionsCount} محطات تعليمية</span>
                    {highScore > 0 && (
                      <span className="text-cyan-400 font-semibold tabular-nums">
                        أعلى نتيجة: {highScore}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="p-4 pt-0">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        retroAudio.playJump();
                        onSelectStage(stage.id);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                      style={{
                        backgroundColor: stage.primaryColor,
                      }}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isCompleted ? 'العب مجدداً' : 'انطلق للمرحلة'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-500 font-medium text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                      <span>أكمل المرحلة السابقة لفتحها</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
