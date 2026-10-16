import React from 'react';
import { RotateCcw, Map, HeartHandshake } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface GameOverModalProps {
  onRetryCheckpoint: () => void;
  onRestartStage: () => void;
  onWorldMap: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onRetryCheckpoint,
  onRestartStage,
  onWorldMap,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-rose-500/70 rounded-3xl shadow-2xl p-6 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
          <HeartHandshake className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-white">لا بأس، المحاولة سر النجاح!</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            في عالم التقنية والبرمجة، كل خطأ هو فرصة للتعلم وتطوير المهارات. يمكنك المتابعة من آخر نقطة حفظ مباشرة.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              retroAudio.playJump();
              onRetryCheckpoint();
            }}
            className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>المتابعة من نقطة الحفظ</span>
          </button>

          <button
            onClick={() => {
              retroAudio.playJump();
              onRestartStage();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            إعادة المرحلة من البداية
          </button>

          <button
            onClick={() => {
              retroAudio.playJump();
              onWorldMap();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Map className="w-3.5 h-3.5" />
            <span>العودة لخريطة المراحل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
