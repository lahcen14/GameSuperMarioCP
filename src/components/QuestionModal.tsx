import React, { useState, useEffect, useMemo } from 'react';
import { Question } from '../types/game';
import { retroAudio } from '../audio/retroAudio';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Sparkles, Coins, Zap } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  terminalTitleAr: string;
  playerCoins: number;
  playerScore: number;
  onDeductBalance: () => { success: boolean; message: string; coinsDeducted: number };
  onSolve: () => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  terminalTitleAr,
  playerCoins,
  playerScore,
  onDeductBalance,
  onSolve,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [deductNotice, setDeductNotice] = useState<string | null>(null);
  const [autoResumeProgress, setAutoResumeProgress] = useState<number>(100);
  const [shuffleKey, setShuffleKey] = useState<number>(() => Math.floor(Math.random() * 1000));

  // Auto-close and resume gameplay automatically when correct!
  useEffect(() => {
    let interval: number | null = null;
    let timer: number | null = null;

    if (isCorrect) {
      const durationMs = 1300;
      const intervalMs = 25;
      const step = 100 / (durationMs / intervalMs);

      interval = window.setInterval(() => {
        setAutoResumeProgress((prev) => Math.max(0, prev - step));
      }, intervalMs);

      timer = window.setTimeout(() => {
        onSolve();
      }, durationMs);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timer) clearTimeout(timer);
    };
  }, [isCorrect, onSolve]);

  // Randomize / shuffle options completely so the correct answer never stays in the same place
  const shuffledOptions = useMemo(() => {
    const list = question.options.map((text, originalIdx) => ({
      text,
      isCorrect: originalIdx === question.correctIndex,
    }));
    
    // Multiple pass Fisher-Yates shuffle
    for (let pass = 0; pass < 3; pass++) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    return list;
  }, [question.id, shuffleKey]);

  const handleSelectOption = (idx: number) => {
    if (isSubmitted && isCorrect) return; // Already passed
    setSelectedIndex(idx);
    setIsSubmitted(true);

    if (shuffledOptions[idx].isCorrect) {
      setIsCorrect(true);
      setDeductNotice(null);
      retroAudio.playCorrectAnswer();
    } else {
      setIsCorrect(false);
      setAttempts((prev) => prev + 1);
      retroAudio.playWrongAnswer();

      // Deduct from player's balance to allow retry!
      const deduction = onDeductBalance();
      setDeductNotice(deduction.message);
    }
  };

  const handleTryAgain = () => {
    setSelectedIndex(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    // Randomize the order again on retry!
    setShuffleKey((prev) => prev + 1);
  };

  const handleContinue = () => {
    onSolve();
  };

  const categoryLabels: Record<string, string> = {
    hardware: 'المكونات المادية',
    software: 'البرمجيات والأنظمة',
    cpu: 'المعالج المركزي CPU',
    memory: 'الذاكرة العشوائية RAM',
    motherboard: 'اللوحة الأم',
    storage: 'وسائط التخزين',
    peripherals: 'الملحقات والإدخال',
    gpu: 'بطاقة الرسوميات GPU',
    ports: 'منافذ التوصيل',
    network_safety: 'الأمان والإنترنت',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-cyan-500/70 rounded-3xl shadow-2xl overflow-hidden text-right flex flex-col">
        {/* CRT Scanline & Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-sm text-cyan-300">{terminalTitleAr}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Player Balance Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-850 border border-slate-700/80 text-amber-300 font-bold tabular-nums">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>الرصيد: {playerCoins} عملة</span>
            </div>

            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{categoryLabels[question.category] || 'أساسيات الحاسوب'}</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="relative p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
                {question.question}
              </p>
            </div>
          </div>

          {/* 4 Answer Options (Randomly Shuffled) */}
          <div className="space-y-2.5">
            {shuffledOptions.map((opt, idx) => {
              let btnStyle = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-200';

              if (isSubmitted) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50';
                } else if (idx === selectedIndex) {
                  btnStyle = 'bg-rose-950/80 border-rose-500/80 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted && isCorrect}
                  className={`w-full text-right p-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 text-sm font-semibold active:scale-[0.99] ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-950/80 border border-slate-700/80 flex items-center justify-center text-xs font-mono text-cyan-400 shrink-0">
                      {['أ', 'ب', 'ج', 'د'][idx]}
                    </span>
                    <span className="leading-normal">{opt.text}</span>
                  </div>

                  {isSubmitted && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                  )}
                  {isSubmitted && !isCorrect && idx === selectedIndex && (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Feedback Banner */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-200 ${
                isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-100'
                  : 'bg-amber-950/70 border-amber-500/60 text-amber-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2 font-bold text-sm">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">إجابة صحيحة وممتازة! تم فتح البوابة الإلكترونية.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">إجابة خاطئة! يمكنك المحاولة مجدداً.</span>
                    </>
                  )}
                </div>

                {/* Deduct notice tag */}
                {!isCorrect && deductNotice && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-900/60 border border-rose-500/60 text-rose-300 text-xs font-mono">
                    <Zap className="w-3 h-3 text-rose-400" />
                    <span>{deductNotice}</span>
                  </span>
                )}
              </div>

              {/* Automatic Return Progress Bar when correct */}
              {isCorrect && (
                <div className="space-y-1 pt-1 border-t border-emerald-800/50">
                  <div className="flex justify-between items-center text-xs text-emerald-300 font-semibold">
                    <span>جاري العودة تلقائياً لإكمال اللعب عند موضعك...</span>
                    <span>{Math.ceil((autoResumeProgress / 100) * 1.3)} ثانية</span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-700/50">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-75 ease-linear"
                      style={{ width: `${autoResumeProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {attempts > 0 && !isCorrect && (
              <span className="text-amber-400">
                عدد المحاولات: {attempts} · تكلفة كل محاولة خاطئة 1 عملة من الرصيد
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isSubmitted && !isCorrect && (
              <button
                onClick={handleTryAgain}
                className="px-4 py-2 text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors shadow-md active:scale-95"
              >
                أعد الإجابة الآن
              </button>
            )}

            {isSubmitted && isCorrect ? (
              <button
                onClick={handleContinue}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 active:scale-95"
              >
                <span>متابعة فوراً</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                إغلاق مؤقتاً
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
