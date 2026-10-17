/**
 * Pixel Art Procedural Canvas Renderer
 * Renders beautiful, authentic 2D platformer graphics directly to HTML5 Canvas
 */

import { PlayerEntity, EnemyEntity, CollectibleEntity, TerminalEntity, GateEntity, SpringEntity, CheckpointEntity, Rect } from '../../types/game';

export class PixelRenderer {
  // Render Player Character ("بايت / Byte")
  public static drawPlayer(ctx: CanvasRenderingContext2D, p: PlayerEntity, tick: number) {
    ctx.save();
    ctx.translate(Math.round(p.x + p.width / 2), Math.round(p.y + p.height / 2));

    // Flash if invulnerable
    if (p.invulnerableTimer > 0 && Math.floor(tick / 4) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    if (p.facingLeft) {
      ctx.scale(-1, 1);
    }

    const w = p.width;
    const h = p.height;
    const hw = w / 2;
    const hh = h / 2;

    // Head / Goggles / Helmet (Cyan / Dark Blue / Gold visor)
    // Body / Suit (Teal & Cobalt with gold belt)
    const isMoving = Math.abs(p.vx) > 0.2;
    const isGrounded = p.isGrounded;
    const bob = isMoving && isGrounded ? Math.sin(tick * 0.3) * 2 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, hh - 1, hw - 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Backpack (Data storage backpack)
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(-hw - 2, -hh + 10 + bob, 6, 14);
    ctx.fillStyle = '#34d399'; // glowing indicator
    ctx.fillRect(-hw - 1, -hh + 12 + bob, 3, 3);

    // Legs / Feet Animation
    const legOffset = isMoving && isGrounded ? Math.sin(tick * 0.35) * 5 : 0;
    if (!isGrounded) {
      // Jumping pose: legs tucked
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-7, hh - 10, 6, 6);
      ctx.fillRect(1, hh - 8, 6, 6);
      ctx.fillStyle = '#06b6d4'; // Boots
      ctx.fillRect(-7, hh - 5, 6, 4);
      ctx.fillRect(1, hh - 3, 6, 4);
    } else {
      // Walking pose
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-7, hh - 10 + legOffset, 5, 8);
      ctx.fillRect(2, hh - 10 - legOffset, 5, 8);
      ctx.fillStyle = '#06b6d4'; // Boots
      ctx.fillRect(-8, hh - 3 + legOffset, 7, 4);
      ctx.fillRect(1, hh - 3 - legOffset, 7, 4);
    }

    // Torso / Jacket
    ctx.fillStyle = '#0284c7'; // Electric blue suit
    ctx.fillRect(-hw + 3, -hh + 9 + bob, w - 6, 13);
    // Belt with buckle
    ctx.fillStyle = '#334155';
    ctx.fillRect(-hw + 3, -hh + 18 + bob, w - 6, 3);
    ctx.fillStyle = '#fbbf24'; // Golden microchip buckle
    ctx.fillRect(-2, -hh + 18 + bob, 4, 3);

    // Chest logo (Circuit symbol)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-1, -hh + 12 + bob, 3, 4);
    ctx.fillRect(-3, -hh + 13 + bob, 7, 2);

    // Head & Helmet
    ctx.fillStyle = '#0369a1'; // Helmet base
    ctx.fillRect(-hw + 2, -hh + bob, w - 4, 10);
    ctx.fillStyle = '#38bdf8'; // Helmet highlight
    ctx.fillRect(-hw + 3, -hh - 1 + bob, w - 6, 3);

    // Face / Skin
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-hw + 4, -hh + 4 + bob, w - 8, 5);

    // Cyber Visor / Goggles (Amber / Gold glow)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-hw + 5, -hh + 3 + bob, w - 9, 4);
    ctx.fillStyle = '#fef08a'; // Visor glint
    ctx.fillRect(-hw + 6, -hh + 3 + bob, 2, 2);
    ctx.fillRect(1, -hh + 3 + bob, 2, 2);

    // Arm
    const armAngle = isMoving ? Math.sin(tick * 0.35) * 4 : 0;
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-1 + armAngle, -hh + 10 + bob, 5, 8);
    ctx.fillStyle = '#fed7aa'; // Hand
    ctx.fillRect(-1 + armAngle, -hh + 18 + bob, 4, 3);

    ctx.restore();
  }

  // Render Enemies
  public static drawEnemy(ctx: CanvasRenderingContext2D, enemy: EnemyEntity, tick: number) {
    if (!enemy.isAlive) return;

    ctx.save();
    ctx.translate(Math.round(enemy.x + enemy.width / 2), Math.round(enemy.y + enemy.height / 2));

    if (enemy.facingLeft) {
      ctx.scale(-1, 1);
    }

    const hw = enemy.width / 2;
    const hh = enemy.height / 2;

    if (enemy.type === 'crawler') {
      // Stage 1 Glitch Bug: Cute mechanical bug with glowing red/pink eyes
      const crawlLeg = Math.sin(tick * 0.4) * 3;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(0, hh - 1, hw - 1, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body (Dark metallic shell)
      ctx.fillStyle = '#475569';
      ctx.fillRect(-hw + 2, -hh + 4, enemy.width - 4, enemy.height - 7);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-hw + 4, -hh + 2, enemy.width - 8, 4);

      // Antennae
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hw - 4, -hh + 2);
      ctx.lineTo(hw + 2, -hh - 5 + Math.sin(tick * 0.2) * 2);
      ctx.stroke();

      // Eyes (Glowing red bug eyes)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(hw - 6, -hh + 5, 4, 4);
      ctx.fillStyle = '#fecaca';
      ctx.fillRect(hw - 5, -hh + 5, 2, 2);

      // Legs
      ctx.fillStyle = '#334155';
      ctx.fillRect(-hw + 1, hh - 4 + crawlLeg, 3, 4);
      ctx.fillRect(-1, hh - 4 - crawlLeg, 3, 4);
      ctx.fillRect(hw - 4, hh - 4 + crawlLeg, 3, 4);
    } else if (enemy.type === 'hopper') {
      // Stage 2 Overheated Resistor: Jumps with electric spark
      ctx.fillStyle = '#b45309'; // Ceramic body
      ctx.fillRect(-hw + 3, -hh, enemy.width - 6, enemy.height - 4);
      // Resistor color bands
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-hw + 5, -hh + 2, 3, enemy.height - 8);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-hw + 10, -hh + 2, 3, enemy.height - 8);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-hw + 15, -hh + 2, 3, enemy.height - 8);

      // Wire legs
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-hw + 4, hh - 4);
      ctx.lineTo(-hw + 2, hh);
      ctx.moveTo(hw - 4, hh - 4);
      ctx.lineTo(hw - 2, hh);
      ctx.stroke();

      // Spark eyes
      ctx.fillStyle = '#facc15';
      ctx.fillRect(hw - 7, -hh + 5, 4, 4);
    } else if (enemy.type === 'flyer') {
      // Stage 3 & 4 Drones
      const hover = Math.sin(tick * 0.2) * 3;
      ctx.translate(0, hover);

      // Drone body
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-hw + 3, -hh + 3, enemy.width - 6, enemy.height - 6);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-hw + 5, -hh + 5, enemy.width - 10, 4);

      // Rotating blades on top
      const bladeW = (Math.sin(tick * 0.8) * hw * 1.5);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(-Math.abs(bladeW) / 2, -hh - 1, Math.abs(bladeW), 2);

      // Camera lens eye
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(2, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1, -2, 2, 2);
    } else if (enemy.type === 'boss') {
      // Final Boss: The Glitch Titan / Bug Master
      const glitchOffset = Math.random() < 0.15 ? (Math.random() - 0.5) * 6 : 0;
      ctx.translate(glitchOffset, 0);

      // Massive cyber demon / virus mech body
      ctx.fillStyle = '#4c0519'; // Deep sinister crimson
      ctx.fillRect(-hw, -hh, enemy.width, enemy.height);

      // Outer metallic armor plates
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 3;
      ctx.strokeRect(-hw + 2, -hh + 2, enemy.width - 4, enemy.height - 4);

      // Horns / Spikes
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(-hw, -hh);
      ctx.lineTo(-hw - 8, -hh - 12);
      ctx.lineTo(-hw + 8, -hh);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(hw, -hh);
      ctx.lineTo(hw + 8, -hh - 12);
      ctx.lineTo(hw - 8, -hh);
      ctx.fill();

      // Glowing multi-core CPU heart
      const pulse = 0.5 + Math.sin(tick * 0.2) * 0.4;
      ctx.fillStyle = `rgba(244, 63, 94, ${pulse})`;
      ctx.fillRect(-12, -8, 24, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, -2, 12, 12);

      // Menacing digital eyes
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-hw + 14, -hh + 12, 10, 6);
      ctx.fillRect(hw - 24, -hh + 12, 10, 6);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-hw + 18, -hh + 13, 5, 4);
      ctx.fillRect(hw - 20, -hh + 13, 5, 4);

      // Boss Health Bar above head
      if (enemy.health !== undefined && enemy.maxHealth) {
        const barW = enemy.width;
        const barH = 7;
        const barY = -hh - 18;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-hw, barY, barW, barH);
        const hpRatio = Math.max(0, enemy.health / enemy.maxHealth);
        ctx.fillStyle = hpRatio > 0.5 ? '#10b981' : hpRatio > 0.25 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(-hw + 1, barY + 1, (barW - 2) * hpRatio, barH - 2);
      }
    }

    ctx.restore();
  }

  // Render Educational Terminal (CRT Computer Station)
  public static drawTerminal(ctx: CanvasRenderingContext2D, term: TerminalEntity, tick: number) {
    ctx.save();
    ctx.translate(Math.round(term.x), Math.round(term.y));

    const w = term.width;
    const h = term.height;

    // Outer Desk / Base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, h - 10, w, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, h - 8, w - 4, 8);

    // Keyboard on desk
    ctx.fillStyle = '#475569';
    ctx.fillRect(4, h - 6, w - 8, 4);
    ctx.fillStyle = '#94a3b8';
    for (let i = 6; i < w - 6; i += 4) {
      ctx.fillRect(i, h - 5, 2, 2);
    }

    // CRT Monitor Casing
    ctx.fillStyle = '#334155';
    ctx.fillRect(4, 2, w - 8, h - 14);
    ctx.fillStyle = '#475569';
    ctx.fillRect(6, 4, w - 12, h - 18);

    // CRT Screen Glass
    if (term.solved) {
      // Solved: Emerald green smiling screen
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(8, 6, w - 16, h - 22);
      ctx.fillStyle = '#34d399';
      // Draw checkmark / check symbol
      ctx.beginPath();
      ctx.moveTo(12, 16);
      ctx.lineTo(16, 20);
      ctx.lineTo(24, 11);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#34d399';
      ctx.stroke();
    } else {
      // Active / Unsolved: Glowing Cyan screen with question mark prompt
      ctx.fillStyle = '#082f49';
      ctx.fillRect(8, 6, w - 16, h - 22);

      // Scanlines effect
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      for (let y = 7; y < h - 16; y += 3) {
        ctx.fillRect(8, y, w - 16, 1);
      }

      // Blinking prompt & Question mark "?"
      const blink = Math.floor(tick / 15) % 2 === 0;
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('؟', w / 2, 19);

      if (blink) {
        ctx.fillStyle = '#facc15';
        ctx.fillRect(w / 2 + 5, 17, 3, 2);
      }

      // Floating interactive cue [صندوق الأسئلة - يفتح تلقائياً]
      const floatY = -12 + Math.sin(tick * 0.15) * 3;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(w / 2 - 24, floatY, 48, 12);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('صندوق الأسئلة', w / 2, floatY + 9);
    }

    ctx.restore();
  }

  // Render Laser Security Gate
  public static drawGate(ctx: CanvasRenderingContext2D, gate: GateEntity, tick: number) {
    ctx.save();
    ctx.translate(Math.round(gate.x), Math.round(gate.y));

    const w = gate.width;
    const h = gate.height;

    // Top & Bottom Gate Emitters
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, 8);
    ctx.fillRect(0, h - 8, w, 8);

    ctx.fillStyle = '#475569';
    ctx.fillRect(2, 2, w - 4, 4);
    ctx.fillRect(2, h - 6, w - 4, 4);

    if (gate.isOpen) {
      // Gate is open: Soft green open indicators
      ctx.fillStyle = '#10b981';
      ctx.fillRect(w / 2 - 3, 3, 6, 3);
      ctx.fillRect(w / 2 - 3, h - 6, 6, 3);

      // Sparkles of opened portal
      const pY = (tick * 1.5) % (h - 16);
      ctx.fillStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.fillRect(w / 2 - 1, 8 + pY, 2, 4);
    } else {
      // Locked: Blazing red/magenta laser barriers with warning glow
      const flicker = 0.7 + Math.sin(tick * 0.3) * 0.3;
      ctx.fillStyle = `rgba(239, 68, 68, ${flicker})`;
      ctx.fillRect(w / 2 - 2, 8, 4, h - 16);

      // Secondary beam
      ctx.fillStyle = `rgba(254, 202, 202, ${flicker * 0.8})`;
      ctx.fillRect(w / 2 - 1, 8, 2, h - 16);

      // Warning lock icon
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(w / 2 - 4, h / 2 - 4, 8, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w / 2 - 1, h / 2 - 2, 2, 4);
    }

    ctx.restore();
  }

  // Render Collectibles (Coins & Data Crystals)
  public static drawCollectible(ctx: CanvasRenderingContext2D, col: CollectibleEntity, tick: number) {
    if (col.collected) return;

    ctx.save();
    const bob = Math.sin((tick + col.id * 10) * 0.1) * 3;
    ctx.translate(Math.round(col.x + col.width / 2), Math.round(col.y + col.height / 2 + bob));

    if (col.type === 'coin') {
      // Spinning gold coin
      const spinScale = Math.cos((tick + col.id * 8) * 0.12);
      ctx.scale(spinScale, 1);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, col.width / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, col.width / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Binary '1' or microchip symbol inside
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-1, -col.height / 4, 2, col.height / 2);
    } else if (col.type === 'gem') {
      // Faceted cyan/purple data crystal
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.moveTo(0, -col.height / 2);
      ctx.lineTo(col.width / 2, 0);
      ctx.lineTo(0, col.height / 2);
      ctx.lineTo(-col.width / 2, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#c4b5fd';
      ctx.beginPath();
      ctx.moveTo(0, -col.height / 2);
      ctx.lineTo(col.width / 3, 0);
      ctx.lineTo(0, col.height / 2);
      ctx.closePath();
      ctx.fill();
    } else if (col.type === 'heart') {
      // Red healing heart
      ctx.fillStyle = '#ef4444';
      const r = col.width / 4;
      ctx.beginPath();
      ctx.arc(-r, -r, r, Math.PI, 0, false);
      ctx.arc(r, -r, r, Math.PI, 0, false);
      ctx.lineTo(0, col.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fecaca';
      ctx.fillRect(-r, -r - 1, 2, 2);
    }

    ctx.restore();
  }

  // Render Jump Spring
  public static drawSpring(ctx: CanvasRenderingContext2D, s: SpringEntity) {
    ctx.save();
    ctx.translate(Math.round(s.x), Math.round(s.y));

    const w = s.width;
    const h = s.height;
    const compress = s.activated ? 6 : 0;

    // Base plate
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, h - 4, w, 4);

    // Coil spring
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(3, h - 4);
    ctx.lineTo(w - 3, h - 8 + compress);
    ctx.lineTo(3, h - 12 + compress * 1.5);
    ctx.lineTo(w / 2, 4 + compress);
    ctx.stroke();

    // Top launch pad
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(2, compress, w - 4, 4);

    ctx.restore();
  }

  // Render Checkpoint Flag
  public static drawCheckpoint(ctx: CanvasRenderingContext2D, cp: CheckpointEntity, tick: number) {
    ctx.save();
    ctx.translate(Math.round(cp.x), Math.round(cp.y));

    // Pole
    ctx.fillStyle = '#64748b';
    ctx.fillRect(4, 0, 3, cp.height);

    // Base
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, cp.height - 4, 11, 4);

    // Flag cloth
    const wave = Math.sin((tick + cp.id * 5) * 0.2) * 2;
    ctx.fillStyle = cp.activated ? '#10b981' : '#64748b';
    ctx.beginPath();
    ctx.moveTo(7, 2);
    ctx.lineTo(22 + wave, 7);
    ctx.lineTo(7, 14);
    ctx.closePath();
    ctx.fill();

    // Top electronic antenna light
    ctx.fillStyle = cp.activated ? '#34d399' : '#94a3b8';
    ctx.beginPath();
    ctx.arc(5.5, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Render Goal Portal Doorway
  public static drawGoal(ctx: CanvasRenderingContext2D, goal: Rect, tick: number) {
    ctx.save();
    ctx.translate(Math.round(goal.x), Math.round(goal.y));

    const w = goal.width;
    const h = goal.height;

    // Portal stone arch
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    // Inner swirling vortex
    const vortexGrad = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    vortexGrad.addColorStop(0, '#ffffff');
    vortexGrad.addColorStop(0.4, '#a855f7');
    vortexGrad.addColorStop(1, '#312e81');

    ctx.fillStyle = vortexGrad;
    ctx.fillRect(6, 6, w - 12, h - 10);

    // Orbiting data bit particles
    for (let i = 0; i < 3; i++) {
      const angle = (tick * 0.08) + (i * Math.PI * 2) / 3;
      const rx = (w / 2 - 10) * Math.cos(angle);
      const ry = (h / 2 - 12) * Math.sin(angle);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(w / 2 + rx - 2, h / 2 + ry - 2, 4, 4);
    }

    // Portal Exit Sign (نهاية المرحلة / مَخْرَج)
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('بوابة العبور', w / 2, -5);

    ctx.restore();
  }

  // Render Platform Tiles
  public static drawPlatform(ctx: CanvasRenderingContext2D, p: Rect & { type?: string; color?: string }, theme: string) {
    ctx.save();
    ctx.translate(Math.round(p.x), Math.round(p.y));

    const w = p.width;
    const h = p.height;
    const isGround = p.y >= 500;
    const renderH = isGround ? Math.max(h, 500) : h;

    let topColor = '#15803d';
    let bodyColor = '#166534';
    let borderColor = '#052e16';

    if (theme === 'cpu_castle') {
      topColor = '#7c3aed';
      bodyColor = '#5b21b6';
      borderColor = '#2e1065';
    } else if (theme === 'storage_caves') {
      topColor = '#0284c7';
      bodyColor = '#0369a1';
      borderColor = '#082f49';
    } else if (theme === 'hardware_lab') {
      topColor = '#d97706';
      bodyColor = '#b45309';
      borderColor = '#451a03';
    } else if (theme === 'digital_citadel') {
      topColor = '#db2777';
      bodyColor = '#9d174d';
      borderColor = '#500724';
    }

    if (p.type === 'moving') {
      topColor = '#f59e0b';
      bodyColor = '#334155';
    }

    // Main platform body
    ctx.fillStyle = bodyColor;
    ctx.fillRect(0, 0, w, renderH);

    // Top grass / circuit layer
    ctx.fillStyle = topColor;
    ctx.fillRect(0, 0, w, Math.min(6, h));

    // Outer border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, w, renderH);

    // Procedural circuit texture marks inside platform
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let x = 8; x < w - 8; x += 24) {
      ctx.fillRect(x, 8, 12, 2);
      ctx.fillRect(x + 5, 8, 2, Math.max(4, h - 14));
      ctx.fillRect(x + 5, h - 6, 8, 2);
    }

    // Subterranean high-tech bedrock layers for ground floor
    if (isGround) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, h + 15, w, renderH - (h + 15));
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let gy = h + 25; gy < renderH; gy += 40) {
        ctx.fillRect(0, gy, w, 2);
        for (let bx = 16; bx < w - 16; bx += 60) {
          ctx.fillRect(bx, gy - 6, 16, 6);
        }
      }
    }

    ctx.restore();
  }

  // Parallax Background Renderer
  public static drawBackground(
    ctx: CanvasRenderingContext2D,
    theme: string,
    cameraX: number,
    viewportW: number,
    viewportH: number,
    tick: number
  ) {
    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewportH);
    if (theme === 'forest') {
      skyGrad.addColorStop(0, '#064e3b');
      skyGrad.addColorStop(0.5, '#042f2e');
      skyGrad.addColorStop(1, '#022c22');
    } else if (theme === 'cpu_castle') {
      skyGrad.addColorStop(0, '#3b0764');
      skyGrad.addColorStop(0.6, '#1e1b4b');
      skyGrad.addColorStop(1, '#0f172a');
    } else if (theme === 'storage_caves') {
      skyGrad.addColorStop(0, '#082f49');
      skyGrad.addColorStop(0.6, '#030712');
      skyGrad.addColorStop(1, '#020617');
    } else if (theme === 'hardware_lab') {
      skyGrad.addColorStop(0, '#451a03');
      skyGrad.addColorStop(0.6, '#1e293b');
      skyGrad.addColorStop(1, '#0f172a');
    } else {
      // digital_citadel
      skyGrad.addColorStop(0, '#500724');
      skyGrad.addColorStop(0.6, '#18020c');
      skyGrad.addColorStop(1, '#050104');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewportW, viewportH);

    // 2. Parallax Distant Layer (Scroll speed 0.15)
    const distOffset = -(cameraX * 0.15) % 200;
    ctx.save();
    ctx.translate(distOffset, 0);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    // Distant cyber towers / circuit silhouettes
    for (let x = -200; x < viewportW + 300; x += 90) {
      const towerH = 120 + ((x * 13) % 80);
      ctx.fillRect(x, viewportH - towerH, 45, towerH);
      // Tower beacon
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(x + 20, viewportH - towerH - 4, 5, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    }
    ctx.restore();

    // 3. Floating Binary Streams (0 and 1 rain effect)
    ctx.save();
    ctx.fillStyle = 'rgba(52, 211, 153, 0.12)';
    ctx.font = '10px monospace';
    for (let i = 0; i < 16; i++) {
      const bx = ((i * 110) - (cameraX * 0.3)) % (viewportW + 100);
      const by = ((tick * 1.5 + i * 40) % (viewportH + 40)) - 20;
      ctx.fillText(i % 2 === 0 ? '1' : '0', bx, by);
    }
    ctx.restore();

    // 4. Parallax Mid-Layer (Circuit traces)
    const midOffset = -(cameraX * 0.3) % 150;
    ctx.save();
    ctx.translate(midOffset, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1.5;
    for (let x = -150; x < viewportW + 200; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, viewportH - 20);
      ctx.lineTo(x + 30, viewportH - 60);
      ctx.lineTo(x + 70, viewportH - 60);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(x + 70, viewportH - 60, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
