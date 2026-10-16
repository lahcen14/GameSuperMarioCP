import React, { useState } from 'react';
import { PlayerProgress } from '../types/game';
import { Award, Printer, X, Sparkles, Edit3, Check, CheckCircle2, User } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface CertificateModalProps {
  progress: PlayerProgress;
  onUpdatePlayerName: (name: string) => void;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  progress,
  onUpdatePlayerName,
  onClose,
}) => {
  // If player hasn't customized their name yet, start in editing mode so they enter it directly
  const hasCustomName =
    progress.playerName &&
    progress.playerName !== 'بوشريط لحسن' &&
    progress.playerName !== 'البطل المستكشف' &&
    progress.playerName !== 'بطل عالم الحاسوب';

  const [recipientName, setRecipientName] = useState(hasCustomName ? progress.playerName : '');
  const [isEditing, setIsEditing] = useState(!hasCustomName);

  const handlePrint = () => {
    if (isEditing && recipientName.trim()) {
      handleSaveName();
    }
    window.print();
  };

  const handleSaveName = () => {
    const finalName = recipientName.trim() || 'البطل المستكشف';
    setRecipientName(finalName);
    onUpdatePlayerName(finalName);
    setIsEditing(false);
  };

  const todayDate = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right my-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs sm:text-sm text-amber-300">
              تسليم شهادة التفوق في علوم الحاسوب
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
              title="طباعة الشهادة أو حفظها كـ PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>

            <button
              onClick={() => {
                retroAudio.playJump();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Container */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center justify-between border-8 border-double border-amber-500/50 m-4 rounded-2xl relative shadow-inner">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400" />

          {/* Certificate Header */}
          <div className="text-center space-y-2 mb-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <Award className="w-10 h-10" />
            </div>

            <span className="text-[11px] sm:text-xs tracking-wider text-amber-400 font-bold uppercase font-mono">
              COMPUTER WORLD ADVENTURE ACADEMY
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              شهادة إتمام وتفوق في علوم الحاسوب
            </h1>
            <p className="text-xs text-slate-400">
              شهادة رسمية معتمدة ومسلّمة للمتعلم عند إتمام مراحل المغامرة التعليمية
            </p>
          </div>

          {/* Recipient Section */}
          <div className="text-center space-y-3 my-2 w-full max-w-lg">
            <span className="text-xs sm:text-sm text-slate-300 block font-medium">
              تُمنح هذه الشهادة بكل فخر واعتزاز للطالب(ة) / المتعلم(ة):
            </span>

            {isEditing ? (
              <div className="space-y-2 py-2 px-3 rounded-2xl bg-slate-950/80 border border-amber-500/60 shadow-lg print:border-none print:bg-transparent">
                <div className="flex items-center gap-2 justify-center">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                      }}
                      placeholder="اكتب اسمك الثلاثي أو الكامل هنا..."
                      className="w-full bg-slate-900 border-2 border-amber-400/80 rounded-xl px-4 py-2 text-center font-black text-lg sm:text-xl text-amber-200 focus:outline-none focus:border-amber-300 transition-colors shadow-inner"
                      autoFocus
                    />
                    <User className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none opacity-60" />
                  </div>

                  <button
                    onClick={handleSaveName}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>تثبيت الاسم</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-400/90 font-medium">
                  * اكتب اسمك ليتم تسجيله رسمياً على الشهادة قبل الطباعة أو الحفظ
                </p>
              </div>
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="cursor-pointer group flex items-center justify-center gap-2 py-1 print:cursor-default"
                title="انقر لتعديل اسمك على الشهادة"
              >
                <h2 className="text-2xl sm:text-4xl font-black text-amber-300 border-b-2 border-dashed border-amber-500/60 pb-1.5 px-6 group-hover:border-amber-300 transition-colors">
                  {recipientName || 'البطل المستكشف'}
                </h2>
                <Edit3 className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 print:hidden" />
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              نظير اجتيازه(ا) بنجاح وتفوق لكافة محطات مغامرة عالم الحاسوب التعليمية، واكتسابه(ا) المعارف والمهارات الأساسية في علوم وهندسة الحاسوب ومكوناته المادية والبرمجية (CPU، اللوحة الأم، RAM، وسائط التخزين SSD/HDD، وبطاقة GPU).
            </p>
          </div>

          {/* Badges / Stats strip */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-lg my-3 text-center border-y border-slate-800 py-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">النقاط المحققة</span>
              <span className="text-base font-bold text-cyan-400 tabular-nums">{progress.totalScore}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">العملات المجمعة</span>
              <span className="text-base font-bold text-amber-400 tabular-nums">{progress.totalCoins}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">الأوسمة المكتسبة</span>
              <span className="text-base font-bold text-emerald-400 tabular-nums">
                {progress.unlockedBadges.length} / 8
              </span>
            </div>
          </div>

          {/* Formal Official Signature Box (Issuer: الأستاذ بوشريط لحسن) */}
          <div className="w-full flex items-center justify-between text-xs pt-4 px-4 border-t border-slate-800/80">
            {/* Left: Stamp & Verification */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>شهادة معتمدة وموثقة رسمياً</span>
              </div>
              <span className="text-slate-500 block text-[11px]">تاريخ الإصدار والتسليم: {todayDate}</span>
              <div className="text-[10px] text-amber-400/80 font-mono">الكود الأكاديمي: CWA-CERT-{Math.abs(progress.totalScore * 7 + 1042)}</div>
            </div>

            {/* Right: Signature of Teacher / Developer */}
            <div className="text-left space-y-1">
              <span className="text-slate-400 block text-[11px]">مطور ومشرف اللعبة ومسلّم الشهادة:</span>
              <div className="text-base sm:text-lg font-black text-amber-300 font-serif">
                الأستاذ بوشريط لحسن
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-[10px] text-amber-300 font-semibold">
                الختم والتوقيع المعتمد
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
