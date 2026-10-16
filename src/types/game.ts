/**
 * Game Types for Computer World Adventure (مغامرة عالم الحاسوب)
 */

export type GameView =
  | 'TITLE'
  | 'WORLD_MAP'
  | 'PLAYING'
  | 'PAUSED'
  | 'STAGE_CLEAR'
  | 'GAME_OVER'
  | 'CERTIFICATE'
  | 'ENCYCLOPEDIA'
  | 'ACHIEVEMENTS'
  | 'SETTINGS';

export type QuestionCategory =
  | 'hardware'       // المكونات المادية
  | 'software'       // البرمجيات وأنظمة التشغيل
  | 'cpu'            // وحدة المعالجة المركزية
  | 'memory'         // الذاكرة RAM و ROM
  | 'motherboard'    // اللوحة الأم
  | 'storage'        // التخزين HDD و SSD والسعات
  | 'peripherals'    // الشاشة والفأرة ولوحة المفاتيح والملحقات
  | 'gpu'            // بطاقة الرسوميات
  | 'ports'          // منافذ التوصيل
  | 'network_safety';// الشبكات والسلامة الرقمية

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  stageId: number; // 1 to 5
}

export interface StageDefinition {
  id: number;
  nameAr: string;
  nameEn: string;
  theme: 'forest' | 'cpu_castle' | 'storage_caves' | 'hardware_lab' | 'digital_citadel';
  subtitleAr: string;
  descriptionAr: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  questionsCount: number;
  totalCoins: number;
  hasBoss?: boolean;
}

export interface PlayerProgress {
  unlockedStages: number[]; // e.g. [1, 2]
  completedStages: number[];
  stageStars: Record<number, number>; // stageId -> stars (1-3)
  stageHighScores: Record<number, number>;
  totalScore: number;
  totalCoins: number;
  answeredQuestionIds: number[];
  unlockedBadges: string[];
  playerName: string;
  hasCompletedFinalBoss: boolean;
}

export interface Badge {
  id: string;
  nameAr: string;
  descriptionAr: string;
  iconName: string;
  unlocked: boolean;
}

export interface SoundSettings {
  musicVolume: number; // 0 to 1
  sfxVolume: number;   // 0 to 1
  muted: boolean;
}

// In-Game Physics Entities
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerEntity extends Rect {
  vx: number;
  vy: number;
  isGrounded: boolean;
  facingLeft: boolean;
  isJumping: boolean;
  animFrame: number;
  animTimer: number;
  invulnerableTimer: number;
  hearts: number;
  maxHearts: number;
  coins: number;
  score: number;
  checkpoint: { x: number; y: number };
}

export interface Platform extends Rect {
  type: 'solid' | 'one_way' | 'moving' | 'falling' | 'ice' | 'conveyor';
  color?: string;
  moveRangeX?: number;
  moveRangeY?: number;
  speed?: number;
  startX?: number;
  startY?: number;
  direction?: number;
}

export interface EnemyEntity extends Rect {
  id: number;
  type: 'crawler' | 'hopper' | 'flyer' | 'boss';
  vx: number;
  vy: number;
  minX: number;
  maxX: number;
  isAlive: boolean;
  health?: number;
  maxHealth?: number;
  facingLeft: boolean;
  animFrame: number;
  attackTimer?: number;
}

export interface CollectibleEntity extends Rect {
  id: number;
  type: 'coin' | 'gem' | 'heart' | 'star';
  collected: boolean;
  floatOffset: number;
  value: number;
}

export interface TerminalEntity extends Rect {
  id: number;
  questionId: number;
  solved: boolean;
  gateId?: number; // Corresponding gate that opens
  titleAr: string;
}

export interface GateEntity extends Rect {
  id: number;
  isOpen: boolean;
  requiredTerminalId: number;
  labelAr: string;
}

export interface SpringEntity extends Rect {
  id: number;
  power: number;
  activated: boolean;
  timer: number;
}

export interface CheckpointEntity extends Rect {
  id: number;
  activated: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface StageData {
  width: number;
  height: number;
  spawnPoint: { x: number; y: number };
  platforms: Platform[];
  enemies: EnemyEntity[];
  collectibles: CollectibleEntity[];
  terminals: TerminalEntity[];
  gates: GateEntity[];
  springs: SpringEntity[];
  checkpoints: CheckpointEntity[];
  goal: Rect;
  boss?: EnemyEntity;
}
