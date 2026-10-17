/**
 * Computer World Adventure (مغامرة عالم الحاسوب)
 * Main Application Controller & State Orchestrator
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameView, PlayerProgress, TerminalEntity, Question } from './types/game';
import { QUESTIONS_DATABASE, STAGES_CONFIG, BADGES_LIST } from './data/questions';
import { retroAudio } from './audio/retroAudio';
import { TitleScreen } from './components/TitleScreen';
import { WorldMap } from './components/WorldMap';
import { GameCanvas } from './game/GameCanvas';
import { QuestionModal } from './components/QuestionModal';
import { StageClearModal } from './components/StageClearModal';
import { GameOverModal } from './components/GameOverModal';
import { CertificateModal } from './components/CertificateModal';
import { EncyclopediaModal } from './components/EncyclopediaModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { Play, RotateCcw, Map, HelpCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'cwa_player_progress_v1';

export default function App() {
  // Current view in state machine
  const [currentView, setCurrentView] = useState<GameView>('TITLE');
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(retroAudio.getMuted());

  // Active question modal state
  const [activeQuestion, setActiveQuestion] = useState<{
    question: Question;
    terminal: TerminalEntity;
  } | null>(null);

  // Solved terminal notification back to GameCanvas
  const [pendingSolvedTerminalId, setPendingSolvedTerminalId] = useState<number | null>(null);

  // Trigger to signal balance deduction for wrong answers
  const [balanceDeductionCount, setBalanceDeductionCount] = useState<number>(0);

  // Stage clear modal details
  const [lastStageResult, setLastStageResult] = useState<{
    score: number;
    coins: number;
    stars: number;
  }>({ score: 0, coins: 0, stars: 1 });

  // Persistent Player Progress
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure developer name is never assigned as the player/recipient name
        if (!parsed.playerName || parsed.playerName === 'بوشريط لحسن') {
          parsed.playerName = 'البطل المستكشف';
        }
        return parsed;
      }
    } catch {
      // fallback to initial
    }
    return {
      unlockedStages: [1],
      completedStages: [],
      stageStars: {},
      stageHighScores: {},
      totalScore: 0,
      totalCoins: 0,
      answeredQuestionIds: [],
      unlockedBadges: [],
      playerName: 'البطل المستكشف',
      hasCompletedFinalBoss: false,
    };
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save game progress:', e);
    }
  }, [progress]);

  // Keep Web Audio API active, awake and unblocked on player gestures
  useEffect(() => {
    const unlockAudio = () => {
      retroAudio.init();
      retroAudio.resumeContextIfNeeded();
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('pointerdown', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
    };
  }, []);

  // Handle View Transitions & Background Music
  useEffect(() => {
    if (
      currentView === 'TITLE' ||
      currentView === 'WORLD_MAP' ||
      currentView === 'ENCYCLOPEDIA' ||
      currentView === 'ACHIEVEMENTS' ||
      currentView === 'SETTINGS'
    ) {
      retroAudio.playMusicForTheme('menu');
    }
  }, [currentView]);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    retroAudio.setMuted(next);
  };

  // Launch a specific stage
  const handleStartStage = (stageId: number) => {
    setActiveStageId(stageId);
    setCurrentView('PLAYING');
  };

  // Check and unlock badges based on state
  const checkBadges = useCallback((updated: PlayerProgress) => {
    const newBadges = [...updated.unlockedBadges];

    // Badge 1: first step
    if (updated.answeredQuestionIds.length >= 1 && !newBadges.includes('first_step')) {
      newBadges.push('first_step');
    }
    // Badges 2 to 5 for stages
    if (updated.completedStages.includes(1) && !newBadges.includes('stage_1_master')) {
      newBadges.push('stage_1_master');
    }
    if (updated.completedStages.includes(2) && !newBadges.includes('stage_2_master')) {
      newBadges.push('stage_2_master');
    }
    if (updated.completedStages.includes(3) && !newBadges.includes('stage_3_master')) {
      newBadges.push('stage_3_master');
    }
    if (updated.completedStages.includes(4) && !newBadges.includes('stage_4_master')) {
      newBadges.push('stage_4_master');
    }
    // Badge 6: coin collector
    if (updated.totalCoins >= 50 && !newBadges.includes('coin_collector')) {
      newBadges.push('coin_collector');
    }
    // Badge 7: scholar genius
    if (updated.answeredQuestionIds.length >= 15 && !newBadges.includes('scholar_genius')) {
      newBadges.push('scholar_genius');
    }
    // Badge 8: final champion
    if (updated.hasCompletedFinalBoss && !newBadges.includes('final_champion')) {
      newBadges.push('final_champion');
    }

    return newBadges;
  }, []);

  // When player solves a terminal question
  const handleSolveQuestion = () => {
    if (!activeQuestion) return;

    const qId = activeQuestion.question.id;
    const termId = activeQuestion.terminal.id;

    setProgress((prev) => {
      const nextAnswered = prev.answeredQuestionIds.includes(qId)
        ? prev.answeredQuestionIds
        : [...prev.answeredQuestionIds, qId];

      const updated: PlayerProgress = {
        ...prev,
        totalScore: prev.totalScore + 100,
        totalCoins: prev.totalCoins + 5,
        answeredQuestionIds: nextAnswered,
      };

      updated.unlockedBadges = checkBadges(updated);
      return updated;
    });

    setPendingSolvedTerminalId(termId);
    setActiveQuestion(null);
  };

  // When an incorrect answer is submitted, deduct from player balance for retry
  const handleDeductBalanceForRetry = useCallback(() => {
    let coinsDeducted = 0;
    let message = '';

    setProgress((prev) => {
      if (prev.totalCoins > 0) {
        coinsDeducted = 1;
        message = 'تم استهلاك 1 عملة من رصيدك لإتاحة المحاولة مجدداً';
        return {
          ...prev,
          totalCoins: Math.max(0, prev.totalCoins - 1),
        };
      } else {
        message = 'تم استهلاك 10 نقاط من رصيدك لإتاحة المحاولة مجدداً';
        return {
          ...prev,
          totalScore: Math.max(0, prev.totalScore - 10),
        };
      }
    });

    setBalanceDeductionCount((c) => c + 1);

    return {
      success: true,
      message: message || 'تم استهلاك 1 عملة من رصيدك',
      coinsDeducted,
    };
  }, []);

  // When stage is successfully completed
  const handleStageClear = (score: number, coins: number, stars: number) => {
    setLastStageResult({ score, coins, stars });

    setProgress((prev) => {
      const nextCompleted = prev.completedStages.includes(activeStageId)
        ? prev.completedStages
        : [...prev.completedStages, activeStageId];

      const nextUnlocked = [...prev.unlockedStages];
      if (activeStageId < 5 && !nextUnlocked.includes(activeStageId + 1)) {
        nextUnlocked.push(activeStageId + 1);
      }

      const prevHighScore = prev.stageHighScores[activeStageId] || 0;
      const prevStars = prev.stageStars[activeStageId] || 0;

      const isFinalBoss = activeStageId === 5;

      const updated: PlayerProgress = {
        ...prev,
        unlockedStages: nextUnlocked,
        completedStages: nextCompleted,
        stageStars: {
          ...prev.stageStars,
          [activeStageId]: Math.max(prevStars, stars),
        },
        stageHighScores: {
          ...prev.stageHighScores,
          [activeStageId]: Math.max(prevHighScore, score),
        },
        totalScore: prev.totalScore + score,
        totalCoins: prev.totalCoins + coins,
        hasCompletedFinalBoss: isFinalBoss ? true : prev.hasCompletedFinalBoss,
      };

      updated.unlockedBadges = checkBadges(updated);
      return updated;
    });

    setCurrentView('STAGE_CLEAR');
  };

  // When player falls or loses all hearts
  const handleGameOver = () => {
    setCurrentView('GAME_OVER');
  };

  // Reset entire game progress
  const handleResetProgress = () => {
    const initialProgress: PlayerProgress = {
      unlockedStages: [1],
      completedStages: [],
      stageStars: {},
      stageHighScores: {},
      totalScore: 0,
      totalCoins: 0,
      answeredQuestionIds: [],
      unlockedBadges: [],
      playerName: 'البطل المستكشف',
      hasCompletedFinalBoss: false,
    };
    setProgress(initialProgress);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleUpdatePlayerName = (name: string) => {
    setProgress((prev) => ({ ...prev, playerName: name }));
  };

  const currentStageConfig = STAGES_CONFIG.find((s) => s.id === activeStageId) || STAGES_CONFIG[0];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans" dir="rtl">
      {/* 1. Title Screen */}
      {currentView === 'TITLE' && (
        <TitleScreen
          progress={progress}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onUpdatePlayerName={handleUpdatePlayerName}
          onStartGame={() => {
            const nextStage = progress.completedStages.length > 0
              ? Math.min(5, Math.max(...progress.completedStages) + 1)
              : 1;
            handleStartStage(nextStage);
          }}
          onOpenMap={() => setCurrentView('WORLD_MAP')}
          onOpenEncyclopedia={() => setCurrentView('ENCYCLOPEDIA')}
          onOpenAchievements={() => setCurrentView('ACHIEVEMENTS')}
          onOpenCertificate={() => setCurrentView('CERTIFICATE')}
          onOpenSettings={() => setCurrentView('SETTINGS')}
        />
      )}

      {/* 2. World Map Screen */}
      {currentView === 'WORLD_MAP' && (
        <WorldMap
          progress={progress}
          onSelectStage={handleStartStage}
          onBackToTitle={() => setCurrentView('TITLE')}
          onOpenEncyclopedia={() => setCurrentView('ENCYCLOPEDIA')}
          onOpenAchievements={() => setCurrentView('ACHIEVEMENTS')}
          onOpenSettings={() => setCurrentView('SETTINGS')}
        />
      )}

      {/* 3. Active Playing Game Canvas */}
      {(currentView === 'PLAYING' || currentView === 'PAUSED') && (
        <GameCanvas
          key={activeStageId}
          stageId={activeStageId}
          stageNameAr={currentStageConfig.nameAr}
          theme={currentStageConfig.theme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onPause={() => setCurrentView('PAUSED')}
          onStageClear={handleStageClear}
          onGameOver={handleGameOver}
          onOpenQuestionModal={(term) => {
            const q = QUESTIONS_DATABASE.find((item) => item.id === term.questionId) || QUESTIONS_DATABASE[0];
            setActiveQuestion({ question: q, terminal: term });
          }}
          onOpenHelp={() => setCurrentView('SETTINGS')}
          pendingTerminalSolvedId={pendingSolvedTerminalId}
          onClearPendingTerminal={() => setPendingSolvedTerminalId(null)}
          balanceDeductionTrigger={balanceDeductionCount}
        />
      )}

      {/* 4. Pause Overlay */}
      {currentView === 'PAUSED' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-white">اللعبة متوقفة مؤقتاً</h2>
            <p className="text-xs text-slate-400">يمكنك المتابعة أو العودة إلى خريطة المراحل</p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  retroAudio.playJump();
                  setCurrentView('PLAYING');
                }}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>متابعة اللعب</span>
              </button>

              <button
                onClick={() => {
                  retroAudio.playJump();
                  // Restart active stage
                  setCurrentView('PLAYING');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة المرحلة من البداية</span>
              </button>

              <button
                onClick={() => {
                  retroAudio.playJump();
                  setCurrentView('WORLD_MAP');
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <Map className="w-3.5 h-3.5" />
                <span>العودة لخريطة المراحل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Terminal Question Modal */}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion.question}
          terminalTitleAr={activeQuestion.terminal.titleAr}
          playerCoins={progress.totalCoins}
          playerScore={progress.totalScore}
          onDeductBalance={handleDeductBalanceForRetry}
          onSolve={handleSolveQuestion}
          onClose={() => setActiveQuestion(null)}
        />
      )}

      {/* 6. Stage Clear Modal */}
      {currentView === 'STAGE_CLEAR' && (
        <StageClearModal
          stageId={activeStageId}
          stageNameAr={currentStageConfig.nameAr}
          score={lastStageResult.score}
          coins={lastStageResult.coins}
          stars={lastStageResult.stars}
          isLastStage={activeStageId === 5}
          onNextStage={() => {
            if (activeStageId < 5) {
              handleStartStage(activeStageId + 1);
            } else {
              setCurrentView('CERTIFICATE');
            }
          }}
          onReplay={() => handleStartStage(activeStageId)}
          onWorldMap={() => setCurrentView('WORLD_MAP')}
          onViewCertificate={() => setCurrentView('CERTIFICATE')}
        />
      )}

      {/* 7. Game Over Modal */}
      {currentView === 'GAME_OVER' && (
        <GameOverModal
          onRetryCheckpoint={() => {
            setCurrentView('PLAYING');
          }}
          onRestartStage={() => {
            handleStartStage(activeStageId);
          }}
          onWorldMap={() => {
            setCurrentView('WORLD_MAP');
          }}
        />
      )}

      {/* 8. Encyclopedia / 105+ Questions Modal */}
      {currentView === 'ENCYCLOPEDIA' && (
        <EncyclopediaModal onClose={() => setCurrentView('WORLD_MAP')} />
      )}

      {/* 9. Achievements / Badges Modal */}
      {currentView === 'ACHIEVEMENTS' && (
        <AchievementsModal
          progress={progress}
          onClose={() => setCurrentView('WORLD_MAP')}
        />
      )}

      {/* 10. Graduation Certificate Modal */}
      {currentView === 'CERTIFICATE' && (
        <CertificateModal
          progress={progress}
          onUpdatePlayerName={(name) => {
            setProgress((prev) => ({ ...prev, playerName: name }));
          }}
          onClose={() => setCurrentView('WORLD_MAP')}
        />
      )}

      {/* 11. Settings & Audio Modal */}
      {currentView === 'SETTINGS' && (
        <SettingsModal
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onClose={() => setCurrentView('WORLD_MAP')}
          onResetProgress={handleResetProgress}
        />
      )}
    </div>
  );
}
