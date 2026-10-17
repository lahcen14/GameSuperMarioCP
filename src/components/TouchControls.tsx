import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, MessageSquareCode } from 'lucide-react';

interface TouchControlsProps {
  onPressLeft: (pressed: boolean) => void;
  onPressRight: (pressed: boolean) => void;
  onPressJump: (pressed: boolean) => void;
  onPressInteract: () => void;
  isNearTerminal?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onPressLeft,
  onPressRight,
  onPressJump,
  onPressInteract,
  isNearTerminal = false,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-16 sm:bottom-12 md:bottom-10 z-30 px-3 sm:px-6 pointer-events-none select-none flex justify-between items-end pb-[env(safe-area-inset-bottom,14px)]">
      {/* Directional D-Pad (Left / Right) */}
      <div className="flex items-center gap-2.5 sm:gap-4 pointer-events-auto">
        {/* Right Button (Moves player to the right) */}
        <button
          type="button"
          onMouseDown={() => onPressRight(true)}
          onMouseUp={() => onPressRight(false)}
          onMouseLeave={() => onPressRight(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            onPressRight(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onPressRight(false);
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onPressRight(false);
          }}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-950/95 border-2 border-cyan-400/80 active:bg-cyan-500 active:border-cyan-200 active:scale-90 backdrop-blur-md flex flex-col items-center justify-center text-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.35)] transition-all touch-manipulation group"
          aria-label="التحرك يميناً"
        >
          <ChevronRight className="w-8 h-8 group-active:scale-110 drop-shadow" />
          <span className="text-[10px] font-black text-slate-200 tracking-wider">يمين</span>
        </button>

        {/* Left Button (Moves player to the left) */}
        <button
          type="button"
          onMouseDown={() => onPressLeft(true)}
          onMouseUp={() => onPressLeft(false)}
          onMouseLeave={() => onPressLeft(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            onPressLeft(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onPressLeft(false);
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onPressLeft(false);
          }}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-950/95 border-2 border-cyan-400/80 active:bg-cyan-500 active:border-cyan-200 active:scale-90 backdrop-blur-md flex flex-col items-center justify-center text-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.35)] transition-all touch-manipulation group"
          aria-label="التحرك يساراً"
        >
          <ChevronLeft className="w-8 h-8 group-active:scale-110 drop-shadow" />
          <span className="text-[10px] font-black text-slate-200 tracking-wider">يسار</span>
        </button>
      </div>

      {/* Action Buttons (Jump & Interact) */}
      <div className="flex items-center gap-2.5 sm:gap-4 pointer-events-auto">
        {/* Interact / Question Terminal button */}
        <button
          type="button"
          onClick={onPressInteract}
          className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center shadow-xl active:scale-90 transition-all touch-manipulation ${
            isNearTerminal
              ? 'bg-gradient-to-b from-amber-500 to-amber-700 border-2 border-amber-300 text-white shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse'
              : 'bg-gradient-to-b from-slate-900/90 to-amber-950/90 border-2 border-amber-600/80 text-amber-200 shadow-[0_4px_15px_rgba(217,119,6,0.25)]'
          }`}
          aria-label="تفاعل مع المحطة"
          title="تفاعل [E]"
        >
          {isNearTerminal && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white"></span>
            </span>
          )}
          <MessageSquareCode className="w-6 h-6 drop-shadow" />
          <span className="text-[10px] font-black tracking-wider">تفاعل</span>
        </button>

        {/* Jump Button */}
        <button
          type="button"
          onMouseDown={() => onPressJump(true)}
          onMouseUp={() => onPressJump(false)}
          onMouseLeave={() => onPressJump(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            onPressJump(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onPressJump(false);
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onPressJump(false);
          }}
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-800 border-3 border-emerald-300 active:from-emerald-400 active:to-emerald-600 active:scale-90 backdrop-blur-md flex flex-col items-center justify-center text-white shadow-[0_4px_25px_rgba(16,185,129,0.5)] transition-all touch-manipulation group"
          aria-label="قفز"
        >
          <ArrowUp className="w-8 h-8 stroke-[3] group-active:scale-110 drop-shadow" />
          <span className="text-xs font-black tracking-widest text-emerald-100">قفز</span>
        </button>
      </div>
    </div>
  );
};
