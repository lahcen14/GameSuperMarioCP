import React from 'react';
import { BADGES_LIST } from '../data/questions';
import { PlayerProgress } from '../types/game';
import { Trophy, X, Compass, Monitor, Cpu, HardDrive, Wrench, Coins, Award, CheckCircle2, Lock } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface AchievementsModalProps {
  progress: PlayerProgress;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ progress, onClose }) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'Monitor':
        return <Monitor className="w-6 h-6" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      case 'HardDrive':
        return <HardDrive className="w-6 h-6" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6" />;
      case 'Coins':
        return <Coins className="w-6 h-6" />;
      case 'Award':
        return <Award className="w-6 h-6" />;
      case 'Trophy':
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white">لوحة الأوسمة والإنجازات</h2>
              <span className="text-xs text-slate-400">
                أكمل التحديات الميدانية والأسئلة لفتح كافة الأوسمة التقنية
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              retroAudio.playJump();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                      : 'bg-slate-800/40 border-slate-700 text-slate-600'
                  }`}
                >
                  {getBadgeIcon(badge.iconName)}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-100">{badge.nameAr}</h3>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{badge.descriptionAr}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
