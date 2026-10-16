import React, { useState } from 'react';
import { retroAudio } from '../audio/retroAudio';
import { Settings, X, Volume2, VolumeX, Keyboard, RotateCcw, Smartphone, Check } from 'lucide-react';

interface SettingsModalProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isMuted,
  onToggleMute,
  onClose,
  onResetProgress,
}) => {
  const [musicVol, setMusicVol] = useState(retroAudio.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(retroAudio.getSfxVolume());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleToggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    onToggleMute();
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVol(val);
    retroAudio.setMusicVolume(val);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    retroAudio.setSfxVolume(val);
    retroAudio.playCoin();
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">إعدادات اللعبة وعناصر التحكم</h2>
          </div>

          <button
            onClick={() => {
              retroAudio.playJump();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Sound Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-200">التحكم في الصوتيات</span>
              <button
                onClick={handleToggleMute}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  isMuted
                    ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                    : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isMuted ? 'الصوت مكتوم' : 'الصوت مفعل'}</span>
              </button>
            </div>

            {/* Music Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>مستوى صوت الموسيقى (Chiptune 8-bit)</span>
                <span className="tabular-nums font-mono">{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={handleMusicChange}
                disabled={isMuted}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* SFX Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>مستوى صوت المؤثرات والتفاعل (SFX)</span>
                <span className="tabular-nums font-mono">{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={handleSfxChange}
                disabled={isMuted}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Controls Guide */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>دليل أزرار التحكم</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 block">الحركة يميناً ويساراً</span>
                <p>مفاتيح الأسهم ← → أو مفاتيح A / D</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 block">القفز فوق المنصات</span>
                <p>المسافة (Space) أو السهم لأعلى ↑ أو W</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">التفاعل مع المحطات والأسئلة</span>
                <p>مفتاح E أو مفتاح الإدخال Enter</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>الشاشات اللمسية والهواتف</span>
                </span>
                <p>أزرار تحكم لمسية افتراضية تظهر تلقائياً</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Reset Game Progress */}
          <div className="pt-1">
            {showConfirmReset ? (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600 space-y-2 text-xs text-rose-200">
                <p className="font-bold">هل أنت متأكد من رغبتك في إعادة تعيين كافة المراحل والنتائج؟</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConfirmReset}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                  >
                    نعم، احذف التقدم
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط تقدم اللعبة من البداية</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
