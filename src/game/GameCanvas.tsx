import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PlayerEntity,
  StageData,
  TerminalEntity,
  Particle,
  Rect,
} from '../types/game';
import { getStageData } from './engine/levelsData';
import { PixelRenderer } from './engine/pixelRenderer';
import { retroAudio } from '../audio/retroAudio';
import { HUD } from '../components/HUD';
import { TouchControls } from '../components/TouchControls';

interface GameCanvasProps {
  stageId: number;
  stageNameAr: string;
  theme: 'forest' | 'cpu_castle' | 'storage_caves' | 'hardware_lab' | 'digital_citadel';
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onStageClear: (score: number, coins: number, stars: number) => void;
  onGameOver: () => void;
  onOpenQuestionModal: (terminal: TerminalEntity) => void;
  onOpenHelp: () => void;
  // External triggers
  pendingTerminalSolvedId: number | null;
  onClearPendingTerminal: () => void;
  balanceDeductionTrigger?: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  stageId,
  stageNameAr,
  theme,
  isMuted,
  onToggleMute,
  onPause,
  onStageClear,
  onGameOver,
  onOpenQuestionModal,
  onOpenHelp,
  pendingTerminalSolvedId,
  onClearPendingTerminal,
  balanceDeductionTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard input states
  const keysRef = useRef<{
    left: boolean;
    right: boolean;
    jump: boolean;
    interact: boolean;
  }>({
    left: false,
    right: false,
    jump: false,
    interact: false,
  });

  // Dynamic game state refs (avoid React re-render lags inside animation frame)
  const stageDataRef = useRef<StageData>(getStageData(stageId));
  const tickRef = useRef<number>(0);
  const cameraXRef = useRef<number>(0);
  const cameraYRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Player state ref
  const playerRef = useRef<PlayerEntity>({
    x: stageDataRef.current.spawnPoint.x,
    y: stageDataRef.current.spawnPoint.y,
    width: 28,
    height: 36,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facingLeft: false,
    isJumping: false,
    animFrame: 0,
    animTimer: 0,
    invulnerableTimer: 0,
    hearts: 3,
    maxHearts: 3,
    coins: 0,
    score: 0,
    checkpoint: { ...stageDataRef.current.spawnPoint },
  });

  // Local HUD state synced from loop
  const [hudState, setHudState] = useState({
    hearts: 3,
    maxHearts: 3,
    coins: 0,
    score: 0,
    solvedCount: 0,
    totalTerminals: stageDataRef.current.terminals.length,
  });

  // Active terminal nearby for prompt
  const nearbyTerminalRef = useRef<TerminalEntity | null>(null);
  const isNearTerminalRef = useRef<boolean>(false);
  const [isNearTerminal, setIsNearTerminal] = useState<boolean>(false);
  // Auto-opened terminal memory so player doesn't get infinite re-open loops while standing still
  const lastAutoOpenedTerminalIdRef = useRef<number | null>(null);

  // Sync in-game coins deduction when player answers incorrectly
  useEffect(() => {
    if (balanceDeductionTrigger && balanceDeductionTrigger > 0) {
      if (playerRef.current.coins > 0) {
        playerRef.current.coins = Math.max(0, playerRef.current.coins - 1);
      } else {
        playerRef.current.score = Math.max(0, playerRef.current.score - 10);
      }
      setHudState((prev) => ({
        ...prev,
        coins: playerRef.current.coins,
        score: playerRef.current.score,
      }));
    }
  }, [balanceDeductionTrigger]);

  // Initialize or reload stage
  useEffect(() => {
    stageDataRef.current = getStageData(stageId);
    playerRef.current.x = stageDataRef.current.spawnPoint.x;
    playerRef.current.y = stageDataRef.current.spawnPoint.y;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.hearts = 3;
    playerRef.current.checkpoint = { ...stageDataRef.current.spawnPoint };
    cameraXRef.current = 0;
    cameraYRef.current = 0;
    particlesRef.current = [];

    setHudState({
      hearts: 3,
      maxHearts: 3,
      coins: playerRef.current.coins,
      score: playerRef.current.score,
      solvedCount: 0,
      totalTerminals: stageDataRef.current.terminals.length,
    });

    // Start background music for this stage theme
    retroAudio.playMusicForTheme(theme);

    return () => {
      // Don't necessarily stop if moving smoothly
    };
  }, [stageId, theme]);

  // Handle external question solved trigger
  useEffect(() => {
    if (pendingTerminalSolvedId !== null) {
      const term = stageDataRef.current.terminals.find((t) => t.id === pendingTerminalSolvedId);
      if (term) {
        term.solved = true;
        // Unlock corresponding gate
        if (term.gateId) {
          const gate = stageDataRef.current.gates.find((g) => g.id === term.gateId);
          if (gate) {
            gate.isOpen = true;
            retroAudio.playDoorOpen();
          }
        }
        // If Stage 5 boss station
        if (term.id === 16 && stageDataRef.current.boss && stageDataRef.current.boss.health) {
          stageDataRef.current.boss.health = Math.max(0, stageDataRef.current.boss.health - 2);
          retroAudio.playBossHit();
        }

        // Add reward points and particles
        playerRef.current.score += 100;
        playerRef.current.coins += 5;

        // Spawn celebratory green particles around terminal
        for (let i = 0; i < 20; i++) {
          particlesRef.current.push({
            x: term.x + term.width / 2,
            y: term.y + term.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6 - 2,
            color: '#34d399',
            size: Math.random() * 4 + 2,
            alpha: 1,
            life: 0,
            maxLife: 30,
          });
        }

        // Update HUD
        const solved = stageDataRef.current.terminals.filter((t) => t.solved).length;
        setHudState((prev) => ({
          ...prev,
          solvedCount: solved,
          score: playerRef.current.score,
          coins: playerRef.current.coins,
        }));
      }
      onClearPendingTerminal();
    }
  }, [pendingTerminalSolvedId, onClearPendingTerminal]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default behavior (such as spacebar clicking focused buttons or scrolling)
      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
      ) {
        e.preventDefault();
        // Remove focus from any button so spacebar never triggers mute or pause by accident
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }

      // Keep audio context resumed on any player activity
      retroAudio.resumeContextIfNeeded();

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = true;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        keysRef.current.jump = true;
      }
      if (e.code === 'KeyE' || e.code === 'Enter') {
        keysRef.current.interact = true;
        // Trigger nearby terminal immediately if available
        if (nearbyTerminalRef.current && !nearbyTerminalRef.current.solved) {
          retroAudio.playTerminalOpen();
          onOpenQuestionModal(nearbyTerminalRef.current);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
      ) {
        e.preventDefault();
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        keysRef.current.jump = false;
      }
      if (e.code === 'KeyE' || e.code === 'Enter') {
        keysRef.current.interact = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onOpenQuestionModal]);

  // Touch control callbacks
  const handleTouchLeft = useCallback((pressed: boolean) => {
    keysRef.current.left = pressed;
  }, []);

  const handleTouchRight = useCallback((pressed: boolean) => {
    keysRef.current.right = pressed;
  }, []);

  const handleTouchJump = useCallback((pressed: boolean) => {
    keysRef.current.jump = pressed;
  }, []);

  const handleTouchInteract = useCallback(() => {
    if (nearbyTerminalRef.current && !nearbyTerminalRef.current.solved) {
      retroAudio.playTerminalOpen();
      onOpenQuestionModal(nearbyTerminalRef.current);
    }
  }, [onOpenQuestionModal]);

  // AABB Collision Helper
  const checkCollision = (r1: Rect, r2: Rect): boolean => {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  };

  // Main 60FPS Game Physics & Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI crisp pixel canvas
    const updateCanvasSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const loop = () => {
      tickRef.current++;
      const tick = tickRef.current;
      const stage = stageDataRef.current;
      const p = playerRef.current;

      const viewportW = canvas.width;
      const viewportH = canvas.height;

      // ==========================================
      // 1. Player Physics & Input Update
      // ==========================================
      const accel = 0.55;
      const maxSpeed = 4.2;
      const friction = 0.82;
      const gravity = 0.48;
      const jumpImpulse = -10.5;

      // Horizontal Acceleration
      if (keysRef.current.left) {
        p.vx -= accel;
        p.facingLeft = true;
      } else if (keysRef.current.right) {
        p.vx += accel;
        p.facingLeft = false;
      } else {
        p.vx *= friction;
        if (Math.abs(p.vx) < 0.05) p.vx = 0;
      }
      p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));

      // Jump
      if (keysRef.current.jump && p.isGrounded) {
        p.vy = jumpImpulse;
        p.isGrounded = false;
        p.isJumping = true;
        retroAudio.playJump();
      }

      // Apply Gravity
      p.vy += gravity;
      if (p.vy > 12) p.vy = 12;

      // Update Moving Platforms
      stage.platforms.forEach((plat) => {
        if (plat.type === 'moving' && plat.startX !== undefined && plat.moveRangeX !== undefined && plat.speed) {
          if (plat.direction === undefined) plat.direction = 1;
          plat.x += plat.speed * plat.direction;
          if (plat.x > plat.startX + plat.moveRangeX) {
            plat.x = plat.startX + plat.moveRangeX;
            plat.direction = -1;
          } else if (plat.x < plat.startX) {
            plat.x = plat.startX;
            plat.direction = 1;
          }
        }
      });

      // Move Horizontal & Resolve Collisions
      p.x += p.vx;
      p.x = Math.max(0, Math.min(stage.width - p.width, p.x));

      // Gate collisions (Laser doors that block horizontal passage when locked)
      stage.gates.forEach((gate) => {
        if (!gate.isOpen && checkCollision(p, gate)) {
          if (p.vx > 0) p.x = gate.x - p.width;
          else if (p.vx < 0) p.x = gate.x + gate.width;
          p.vx = 0;
        }
      });

      // Platform Collisions on X
      stage.platforms.forEach((plat) => {
        if (checkCollision(p, plat)) {
          // If moving into side of solid
          if (p.vx > 0 && p.x + p.width - p.vx <= plat.x) {
            p.x = plat.x - p.width;
            p.vx = 0;
          } else if (p.vx < 0 && p.x - p.vx >= plat.x + plat.width) {
            p.x = plat.x + plat.width;
            p.vx = 0;
          }
        }
      });

      // Move Vertical & Resolve Collisions
      p.y += p.vy;
      p.isGrounded = false;

      stage.platforms.forEach((plat) => {
        if (checkCollision(p, plat)) {
          // Falling onto platform
          if (p.vy > 0 && p.y + p.height - p.vy <= plat.y + 10) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
            p.isJumping = false;

            // If platform is moving, carry player along
            if (plat.type === 'moving' && plat.direction !== undefined && plat.speed) {
              p.x += plat.speed * plat.direction;
            }
          }
          // Head hit from below
          else if (p.vy < 0 && p.y - p.vy >= plat.y + plat.height - 10) {
            p.y = plat.y + plat.height;
            p.vy = 0;
          }
        }
      });

      // Springs Bouncing
      stage.springs.forEach((spring) => {
        if (checkCollision(p, spring) && p.vy > 0) {
          p.vy = -spring.power;
          spring.activated = true;
          spring.timer = 15;
          retroAudio.playSpring();
        }
        if (spring.activated) {
          spring.timer--;
          if (spring.timer <= 0) spring.activated = false;
        }
      });

      // Checkpoint Touching
      stage.checkpoints.forEach((cp) => {
        if (!cp.activated && checkCollision(p, cp)) {
          cp.activated = true;
          p.checkpoint = { x: cp.x, y: cp.y - 10 };
          retroAudio.playGem();
          // Spawn green sparkles
          for (let i = 0; i < 10; i++) {
            particlesRef.current.push({
              x: cp.x + cp.width / 2,
              y: cp.y + 10,
              vx: (Math.random() - 0.5) * 3,
              vy: -Math.random() * 3,
              color: '#10b981',
              size: 3,
              alpha: 1,
              life: 0,
              maxLife: 25,
            });
          }
        }
      });

      // Bottom pit death fall check
      if (p.y > stage.height + 50) {
        retroAudio.playHurt();
        p.hearts = Math.max(0, p.hearts - 1);
        p.x = p.checkpoint.x;
        p.y = p.checkpoint.y;
        p.vx = 0;
        p.vy = 0;
        p.invulnerableTimer = 60; // 1 second invulnerability

        setHudState((prev) => ({ ...prev, hearts: p.hearts }));

        if (p.hearts <= 0) {
          onGameOver();
          return;
        }
      }

      // Decrement invulnerable timer
      if (p.invulnerableTimer > 0) {
        p.invulnerableTimer--;
      }

      // ==========================================
      // 2. Terminal Detection & Auto-Opening
      // ==========================================
      const foundTerminal = stage.terminals.find((term) => {
        const dist = Math.hypot(
          p.x + p.width / 2 - (term.x + term.width / 2),
          p.y + p.height / 2 - (term.y + term.height / 2)
        );
        return dist < 45;
      }) || null;

      if (foundTerminal) {
        // Auto-open question box automatically upon reaching it!
        if (!foundTerminal.solved && lastAutoOpenedTerminalIdRef.current !== foundTerminal.id) {
          lastAutoOpenedTerminalIdRef.current = foundTerminal.id;
          p.vx = 0;
          keysRef.current.left = false;
          keysRef.current.right = false;
          retroAudio.playTerminalOpen();
          onOpenQuestionModal(foundTerminal);
        }
      }
      nearbyTerminalRef.current = foundTerminal;

      const hasNearbyUnsolvedTerminal = Boolean(foundTerminal && !foundTerminal.solved);
      if (hasNearbyUnsolvedTerminal !== isNearTerminalRef.current) {
        isNearTerminalRef.current = hasNearbyUnsolvedTerminal;
        setIsNearTerminal(hasNearbyUnsolvedTerminal);
      }

      // Reset auto-open memory if player moved away
      if (!foundTerminal) {
        lastAutoOpenedTerminalIdRef.current = null;
      }

      // ==========================================
      // 3. Collectibles Pickup
      // ==========================================
      stage.collectibles.forEach((col) => {
        if (!col.collected && checkCollision(p, col)) {
          col.collected = true;
          if (col.type === 'coin') {
            p.coins += 1;
            p.score += col.value;
            retroAudio.playCoin();
          } else if (col.type === 'gem') {
            p.coins += 5;
            p.score += col.value;
            retroAudio.playGem();
          } else if (col.type === 'heart') {
            if (p.hearts < p.maxHearts) {
              p.hearts += 1;
              retroAudio.playGem();
            }
          }

          // Particles
          for (let i = 0; i < 8; i++) {
            particlesRef.current.push({
              x: col.x + col.width / 2,
              y: col.y + col.height / 2,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: col.type === 'coin' ? '#fbbf24' : col.type === 'heart' ? '#ef4444' : '#8b5cf6',
              size: 2.5,
              alpha: 1,
              life: 0,
              maxLife: 20,
            });
          }

          setHudState((prev) => ({
            ...prev,
            coins: p.coins,
            score: p.score,
            hearts: p.hearts,
          }));
        }
      });

      // ==========================================
      // 4. Enemy AI & Player Collision
      // ==========================================
      stage.enemies.forEach((enemy) => {
        if (!enemy.isAlive) return;

        // Enemy movement
        enemy.x += enemy.vx;
        if (enemy.x > enemy.maxX) {
          enemy.x = enemy.maxX;
          enemy.vx = -Math.abs(enemy.vx);
          enemy.facingLeft = true;
        } else if (enemy.x < enemy.minX) {
          enemy.x = enemy.minX;
          enemy.vx = Math.abs(enemy.vx);
          enemy.facingLeft = false;
        }

        // Hopper jump behavior
        if (enemy.type === 'hopper' && tick % 60 === 0) {
          enemy.vy = -5;
        }

        if (checkCollision(p, enemy)) {
          // Stomp on enemy head
          if (p.vy > 0 && p.y + p.height - p.vy <= enemy.y + 12) {
            enemy.isAlive = false;
            p.vy = -7.5; // bounce up
            p.score += 50;
            retroAudio.playDefeatEnemy();

            // Burst particles
            for (let i = 0; i < 12; i++) {
              particlesRef.current.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#ef4444',
                size: 3,
                alpha: 1,
                life: 0,
                maxLife: 25,
              });
            }

            setHudState((prev) => ({ ...prev, score: p.score }));
          } else if (p.invulnerableTimer <= 0) {
            // Player Hurt
            p.hearts = Math.max(0, p.hearts - 1);
            p.invulnerableTimer = 60; // 1s invulnerability
            p.vy = -4;
            p.vx = p.x < enemy.x ? -3 : 3;
            retroAudio.playHurt();

            setHudState((prev) => ({ ...prev, hearts: p.hearts }));

            if (p.hearts <= 0) {
              onGameOver();
              return;
            }
          }
        }
      });

      // Boss Logic (Stage 5)
      if (stage.boss && stage.boss.isAlive) {
        const boss = stage.boss;
        boss.x += boss.vx;
        if (boss.x > boss.maxX) {
          boss.x = boss.maxX;
          boss.vx = -Math.abs(boss.vx);
          boss.facingLeft = true;
        } else if (boss.x < boss.minX) {
          boss.x = boss.minX;
          boss.vx = Math.abs(boss.vx);
          boss.facingLeft = false;
        }

        // Player collision with boss
        if (checkCollision(p, boss)) {
          // Player stomps boss head
          if (p.vy > 0 && p.y + p.height - p.vy <= boss.y + 16 && boss.health !== undefined) {
            boss.health -= 1;
            p.vy = -9;
            retroAudio.playBossHit();

            if (boss.health <= 0) {
              boss.isAlive = false;
              p.score += 500;
              retroAudio.playStageClear();

              // Giant victory burst
              for (let i = 0; i < 40; i++) {
                particlesRef.current.push({
                  x: boss.x + boss.width / 2,
                  y: boss.y + boss.height / 2,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  color: '#ec4899',
                  size: 4,
                  alpha: 1,
                  life: 0,
                  maxLife: 40,
                });
              }
            }
          } else if (p.invulnerableTimer <= 0) {
            p.hearts = Math.max(0, p.hearts - 1);
            p.invulnerableTimer = 60;
            p.vy = -5;
            p.vx = p.x < boss.x ? -4 : 4;
            retroAudio.playHurt();
            setHudState((prev) => ({ ...prev, hearts: p.hearts }));

            if (p.hearts <= 0) {
              onGameOver();
              return;
            }
          }
        }
      }

      // ==========================================
      // 5. Goal Portal Trigger (Stage Clear)
      // ==========================================
      if (checkCollision(p, stage.goal)) {
        // If Stage 5, boss must be defeated
        if (stage.boss && stage.boss.isAlive) {
          // Can't pass until boss defeated
        } else {
          // Calculate stars based on coins & questions solved
          const totalCoins = stage.collectibles.filter((c) => c.type === 'coin').length;
          const coinRatio = totalCoins > 0 ? p.coins / totalCoins : 1;
          const stars = coinRatio >= 0.8 ? 3 : coinRatio >= 0.4 ? 2 : 1;

          onStageClear(p.score, p.coins, stars);
          return;
        }
      }

      // ==========================================
      // 6. Camera Tracking (Smooth Lerp & Elevation)
      // ==========================================
      // Responsive scale: fits world gracefully on mobile devices and landscape phones
      const isLandscape = viewportW > viewportH;
      let scale = 1;
      if (isLandscape) {
        scale = Math.min(1.0, Math.max(0.72, viewportH / 460));
      } else {
        // Portrait or square
        scale = Math.min(1.15, Math.max(0.75, viewportW / 460));
      }

      const visibleWorldW = viewportW / scale;

      // Smooth horizontal camera follow
      const targetCamX = p.x - visibleWorldW * 0.35;
      const maxCamX = Math.max(0, stage.width - visibleWorldW);
      cameraXRef.current += (Math.max(0, Math.min(maxCamX, targetCamX)) - cameraXRef.current) * 0.1;
      const camX = cameraXRef.current;

      // Vertical Camera: Elevate the ground clearly above the bottom touch controls
      // On portrait phones, ground is raised ~180-240px from bottom so the ground, character, and obstacles are prominently elevated
      // On landscape phones, ground is raised ~80-100px
      const groundScreenPadding = isLandscape
        ? Math.min(100, Math.max(75, viewportH * 0.22))
        : Math.min(240, Math.max(160, viewportH * 0.28));

      const groundWorldY = 520;
      // Base camera Y that elevates the ground to (viewportH - groundScreenPadding)
      const baseCamY = groundWorldY - (viewportH - groundScreenPadding) / scale;

      // Smoothly follow player if they jump or climb high platforms (y < 350)
      const playerCenterCamY = (p.y + p.height / 2) - (viewportH * 0.52) / scale;
      const targetCamY = Math.min(baseCamY, Math.max(-100, playerCenterCamY));

      cameraYRef.current += (targetCamY - cameraYRef.current) * 0.1;
      const camY = cameraYRef.current;

      // ==========================================
      // 7. Render All Elements
      // ==========================================
      ctx.clearRect(0, 0, viewportW, viewportH);

      // Draw Parallax Background
      PixelRenderer.drawBackground(ctx, theme, camX, viewportW, viewportH, tick);

      ctx.save();
      ctx.scale(scale, scale);
      ctx.translate(-Math.round(camX), -Math.round(camY));

      // Platforms
      stage.platforms.forEach((plat) => {
        if (plat.x + plat.width > camX - 100 && plat.x < camX + visibleWorldW + 100) {
          PixelRenderer.drawPlatform(ctx, plat, theme);
        }
      });

      // Springs
      stage.springs.forEach((spring) => {
        PixelRenderer.drawSpring(ctx, spring);
      });

      // Checkpoints
      stage.checkpoints.forEach((cp) => {
        PixelRenderer.drawCheckpoint(ctx, cp, tick);
      });

      // Laser Gates
      stage.gates.forEach((gate) => {
        PixelRenderer.drawGate(ctx, gate, tick);
      });

      // Question Terminals
      stage.terminals.forEach((term) => {
        PixelRenderer.drawTerminal(ctx, term, tick);
      });

      // Collectibles
      stage.collectibles.forEach((col) => {
        PixelRenderer.drawCollectible(ctx, col, tick);
      });

      // Enemies
      stage.enemies.forEach((enemy) => {
        PixelRenderer.drawEnemy(ctx, enemy, tick);
      });

      // Boss
      if (stage.boss && stage.boss.isAlive) {
        PixelRenderer.drawEnemy(ctx, stage.boss, tick);
      }

      // Goal Portal
      PixelRenderer.drawGoal(ctx, stage.goal, tick);

      // Player
      PixelRenderer.drawPlayer(ctx, p, tick);

      // Render Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
        pt.alpha = 1 - pt.life / pt.maxLife;

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();

        if (pt.life >= pt.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [onGameOver, onStageClear, theme]);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden select-none">
      {/* Top HUD */}
      <HUD
        hearts={hudState.hearts}
        maxHearts={hudState.maxHearts}
        coins={hudState.coins}
        score={hudState.score}
        stageNameAr={stageNameAr}
        solvedCount={hudState.solvedCount}
        totalTerminals={hudState.totalTerminals}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onPause={onPause}
        onOpenHelp={onOpenHelp}
      />

      {/* Main 2D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block pixel-art cursor-default"
      />

      {/* Touch Screen On-Screen Controls */}
      <TouchControls
        onPressLeft={handleTouchLeft}
        onPressRight={handleTouchRight}
        onPressJump={handleTouchJump}
        onPressInteract={handleTouchInteract}
        isNearTerminal={isNearTerminal}
      />
    </div>
  );
};
