import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, MessageSquareCode } from 'lucide-react';

interface TouchControlsProps {
  onPressLeft: (pressed: boolean) => void;
  onPressRight: (pressed: boolean) => void;
  onPressJump: (pressed: boolean) => void;
  onPressInteract: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onPressLeft,
  onPressRight,
  onPressJump,
  onPressInteract,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-16 z-30 px-4 pointer-events-none select-none flex justify-between items-end">
      {/* Directional D-Pad (Left / Right) */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          type="button"
          onMouseDown={() => onPressRight(true)}
          onMouseUp={() => onPressRight(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            onPressRight(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onPressRight(false);
          }}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 border-2 border-slate-700 active:bg-cyan-600 active:border-cyan-400 backdrop-blur-md flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
          aria-label="التحرك يميناً"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        <button
          type="button"
          onMouseDown={() => onPressLeft(true)}
          onMouseUp={() => onPressLeft(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            onPressLeft(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onPressLeft(false);
          }}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 border-2 border-slate-700 active:bg-cyan-600 active:border-cyan-400 backdrop-blur-md flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
          aria-label="التحرك يساراً"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      {/* Action Buttons (Jump & Interact) */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Interact / Question Terminal button */}
        <button
          type="button"
          onClick={onPressInteract}
          className="w-13 h-13 rounded-2xl bg-amber-900/80 border-2 border-amber-600 active:bg-amber-500 active:border-amber-400 backdrop-blur-md flex items-center justify-center text-amber-200 shadow-xl active:scale-90 transition-transform"
          aria-label="تفاعل مع المحطة"
          title="تفاعل [E]"
        >
          <MessageSquareCode className="w-6 h-6" />
        </button>

        {/* Jump Button */}
        <button
          type="button"
          onMouseDown={() => onPressJump(true)}
          onMouseUp={() => onPressJump(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            onPressJump(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onPressJump(false);
          }}
          className="w-16 h-16 rounded-2xl bg-cyan-700/80 border-2 border-cyan-400 active:bg-cyan-500 backdrop-blur-md flex flex-col items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
          aria-label="قفز"
        >
          <ArrowUp className="w-7 h-7" />
          <span className="text-[10px] font-bold">قفز</span>
        </button>
      </div>
    </div>
  );
};
