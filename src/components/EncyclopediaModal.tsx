import React, { useState, useMemo } from 'react';
import { QUESTIONS_DATABASE } from '../data/questions';
import { QuestionCategory } from '../types/game';
import { Search, X, CheckCircle, BookOpen, Layers } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface EncyclopediaModalProps {
  onClose: () => void;
}

export const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');

  const categories: { id: QuestionCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'الكل (105+)' },
    { id: 'hardware', label: 'المكونات المادية' },
    { id: 'peripherals', label: 'الشاشة والملحقات' },
    { id: 'cpu', label: 'المعالج CPU' },
    { id: 'memory', label: 'الذاكرة RAM/ROM' },
    { id: 'motherboard', label: 'اللوحة الأم' },
    { id: 'storage', label: 'التخزين HDD/SSD' },
    { id: 'gpu', label: 'بطاقة الرسوميات GPU' },
    { id: 'ports', label: 'المنافذ والتوصيل' },
    { id: 'software', label: 'الأنظمة والبرمجيات' },
    { id: 'network_safety', label: 'الأمان والإنترنت' },
  ];

  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DATABASE.filter((q) => {
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-slate-900 border-2 border-cyan-500/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                موسوعة وبنك أسئلة عالم الحاسوب
              </h2>
              <span className="text-xs text-slate-400">
                قاعدة معرفية شاملة تضم {QUESTIONS_DATABASE.length} سؤالاً وشرحاً علمياً
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              retroAudio.playJump();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الأسئلة أو المفاهيم أو الإجابات..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Categories Tab Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  retroAudio.playJump();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Layers className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">لم يتم العثور على أسئلة تطابق بحثك</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-cyan-400 underline font-medium"
              >
                إعادة ضبط عوامل التصفية
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-md shrink-0">
                    #{q.id}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 flex-1 leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                {/* 4 Choices with correct answer highlighted */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === q.correctIndex;
                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                          isCorrect
                            ? 'bg-emerald-950/70 border-emerald-600/70 text-emerald-200 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-mono shrink-0">
                            {['أ', 'ب', 'ج', 'د'][oIdx]}
                          </span>
                        )}
                        <span className="leading-tight">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Scientific explanation */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-cyan-400">الشرح التعليمي: </span>
                  {q.explanation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
