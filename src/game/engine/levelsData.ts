import { StageData } from '../../types/game';

export function getStageData(stageId: number): StageData {
  switch (stageId) {
    case 1:
      // ==========================================
      // المرحلة 1: غابة الحاسوب (Computer Forest)
      // ==========================================
      return {
        width: 3200,
        height: 600,
        spawnPoint: { x: 80, y: 440 },
        platforms: [
          // Ground floor segments with small gaps
          { x: 0, y: 520, width: 700, height: 80, type: 'solid' },
          { x: 780, y: 520, width: 800, height: 80, type: 'solid' },
          { x: 1680, y: 520, width: 850, height: 80, type: 'solid' },
          { x: 2600, y: 520, width: 600, height: 80, type: 'solid' },

          // Stepping floating platforms
          { x: 260, y: 420, width: 120, height: 24, type: 'solid' },
          { x: 440, y: 340, width: 140, height: 24, type: 'solid' },
          { x: 620, y: 410, width: 110, height: 24, type: 'solid' },

          // Moving platform across gap 1
          { x: 700, y: 480, width: 80, height: 20, type: 'moving', startX: 690, moveRangeX: 80, speed: 1.2 },

          // Mid section platforms
          { x: 920, y: 430, width: 140, height: 24, type: 'solid' },
          { x: 1150, y: 350, width: 160, height: 24, type: 'solid' },
          { x: 1380, y: 420, width: 140, height: 24, type: 'solid' },

          // Moving platform across gap 2
          { x: 1580, y: 470, width: 90, height: 20, type: 'moving', startX: 1570, moveRangeX: 100, speed: 1.5 },

          // Upper challenge path
          { x: 1800, y: 390, width: 130, height: 24, type: 'solid' },
          { x: 2000, y: 310, width: 150, height: 24, type: 'solid' },
          { x: 2220, y: 260, width: 140, height: 24, type: 'solid' },
          { x: 2420, y: 370, width: 130, height: 24, type: 'solid' },

          // Goal approach
          { x: 2750, y: 430, width: 150, height: 24, type: 'solid' },
          { x: 2950, y: 360, width: 180, height: 24, type: 'solid' },
        ],
        terminals: [
          { id: 1, questionId: 1, solved: false, gateId: 1, titleAr: 'محطة وحدات الإدخال', x: 500, y: 300, width: 36, height: 40 },
          { id: 2, questionId: 2, solved: false, gateId: 2, titleAr: 'محطة شاشات العرض', x: 1220, y: 310, width: 36, height: 40 },
          { id: 3, questionId: 4, solved: false, gateId: 3, titleAr: 'محطة الإدخال والإخراج', x: 2060, y: 270, width: 36, height: 40 },
        ],
        gates: [
          { id: 1, isOpen: false, requiredTerminalId: 1, labelAr: 'بوابة الملحقات 1', x: 740, y: 400, width: 24, height: 120 },
          { id: 2, isOpen: false, requiredTerminalId: 2, labelAr: 'بوابة الإخراج 2', x: 1640, y: 400, width: 24, height: 120 },
          { id: 3, isOpen: false, requiredTerminalId: 3, labelAr: 'بوابة المكونات 3', x: 2560, y: 400, width: 24, height: 120 },
        ],
        collectibles: [
          // Coins
          { id: 1, type: 'coin', x: 200, y: 480, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 2, type: 'coin', x: 230, y: 480, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 3, type: 'coin', x: 300, y: 380, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 4, type: 'coin', x: 470, y: 300, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 5, type: 'gem',  x: 650, y: 360, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },

          { id: 6, type: 'coin', x: 960, y: 390, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 7, type: 'coin', x: 1000, y: 390, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 8, type: 'gem',  x: 1200, y: 300, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 9, type: 'heart', x: 1450, y: 370, width: 18, height: 18, collected: false, floatOffset: 0, value: 1 },

          { id: 10, type: 'coin', x: 1850, y: 340, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 11, type: 'coin', x: 1900, y: 340, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 12, type: 'gem',  x: 2280, y: 210, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 13, type: 'coin', x: 2800, y: 390, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 14, type: 'coin', x: 2850, y: 390, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 15, type: 'coin', x: 3000, y: 320, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
        ],
        springs: [
          { id: 1, x: 180, y: 504, width: 28, height: 16, power: 13.5, activated: false, timer: 0 },
          { id: 2, x: 1720, y: 504, width: 28, height: 16, power: 14.5, activated: false, timer: 0 },
        ],
        checkpoints: [
          { id: 1, x: 820, y: 470, width: 24, height: 50, activated: false },
          { id: 2, x: 1720, y: 470, width: 24, height: 50, activated: false },
        ],
        enemies: [
          { id: 1, type: 'crawler', x: 340, y: 494, width: 26, height: 24, vx: 0.8, vy: 0, minX: 250, maxX: 480, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 2, type: 'crawler', x: 1050, y: 494, width: 26, height: 24, vx: 0.9, vy: 0, minX: 950, maxX: 1250, isAlive: true, facingLeft: false, animFrame: 0 },
          { id: 3, type: 'crawler', x: 1950, y: 494, width: 26, height: 24, vx: 1.0, vy: 0, minX: 1850, maxX: 2150, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 4, type: 'crawler', x: 2700, y: 494, width: 26, height: 24, vx: 1.1, vy: 0, minX: 2650, maxX: 2880, isAlive: true, facingLeft: false, animFrame: 0 },
        ],
        goal: { x: 3050, y: 280, width: 44, height: 80 },
      };

    case 2:
      // ==========================================
      // المرحلة 2: قلعة المعالج (Processor Castle)
      // ==========================================
      return {
        width: 3400,
        height: 600,
        spawnPoint: { x: 90, y: 440 },
        platforms: [
          { x: 0, y: 520, width: 650, height: 80, type: 'solid' },
          { x: 750, y: 520, width: 750, height: 80, type: 'solid' },
          { x: 1600, y: 520, width: 800, height: 80, type: 'solid' },
          { x: 2500, y: 520, width: 900, height: 80, type: 'solid' },

          // Vertical hopping clock-cycle platforms
          { x: 250, y: 430, width: 110, height: 22, type: 'solid' },
          { x: 420, y: 350, width: 130, height: 22, type: 'solid' },
          { x: 580, y: 420, width: 100, height: 22, type: 'solid' },

          // Moving bus across gap
          { x: 660, y: 460, width: 80, height: 20, type: 'moving', startX: 650, moveRangeX: 95, speed: 1.4 },

          // RAM slot platforms
          { x: 880, y: 420, width: 120, height: 22, type: 'solid' },
          { x: 1060, y: 340, width: 140, height: 22, type: 'solid' },
          { x: 1280, y: 280, width: 130, height: 22, type: 'solid' },
          { x: 1450, y: 390, width: 110, height: 22, type: 'solid' },

          // Moving bus across gap 2
          { x: 1510, y: 460, width: 80, height: 20, type: 'moving', startX: 1500, moveRangeX: 95, speed: 1.6 },

          // ALU & Socket bridges
          { x: 1750, y: 420, width: 130, height: 22, type: 'solid' },
          { x: 1950, y: 330, width: 160, height: 22, type: 'solid' },
          { x: 2180, y: 270, width: 150, height: 22, type: 'solid' },
          { x: 2360, y: 370, width: 120, height: 22, type: 'solid' },

          // Approach to CPU core portal
          { x: 2650, y: 430, width: 140, height: 22, type: 'solid' },
          { x: 2850, y: 350, width: 160, height: 22, type: 'solid' },
          { x: 3100, y: 430, width: 150, height: 22, type: 'solid' },
        ],
        terminals: [
          { id: 4, questionId: 21, solved: false, gateId: 4, titleAr: 'محطة وحدة المعالجة CPU', x: 480, y: 310, width: 36, height: 40 },
          { id: 5, questionId: 25, solved: false, gateId: 5, titleAr: 'محطة اللوحة الأم', x: 1120, y: 300, width: 36, height: 40 },
          { id: 6, questionId: 26, solved: false, gateId: 6, titleAr: 'محطة ذاكرة RAM', x: 2020, y: 290, width: 36, height: 40 },
        ],
        gates: [
          { id: 4, isOpen: false, requiredTerminalId: 4, labelAr: 'بوابة المعالج 1', x: 700, y: 400, width: 24, height: 120 },
          { id: 5, isOpen: false, requiredTerminalId: 5, labelAr: 'بوابة النواقل 2', x: 1560, y: 400, width: 24, height: 120 },
          { id: 6, isOpen: false, requiredTerminalId: 6, labelAr: 'بوابة الكاش 3', x: 2460, y: 400, width: 24, height: 120 },
        ],
        collectibles: [
          { id: 16, type: 'coin', x: 180, y: 480, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 17, type: 'gem',  x: 290, y: 380, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 18, type: 'coin', x: 440, y: 300, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 19, type: 'coin', x: 920, y: 380, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 20, type: 'gem',  x: 1330, y: 230, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 21, type: 'heart', x: 1820, y: 370, width: 18, height: 18, collected: false, floatOffset: 0, value: 1 },
          { id: 22, type: 'coin', x: 2220, y: 220, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 23, type: 'gem',  x: 2920, y: 300, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 24, type: 'coin', x: 3150, y: 380, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
        ],
        springs: [
          { id: 3, x: 220, y: 504, width: 28, height: 16, power: 14.0, activated: false, timer: 0 },
          { id: 4, x: 1680, y: 504, width: 28, height: 16, power: 14.5, activated: false, timer: 0 },
        ],
        checkpoints: [
          { id: 3, x: 790, y: 470, width: 24, height: 50, activated: false },
          { id: 4, x: 1660, y: 470, width: 24, height: 50, activated: false },
        ],
        enemies: [
          { id: 5, type: 'hopper', x: 380, y: 494, width: 24, height: 26, vx: 0.9, vy: 0, minX: 300, maxX: 500, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 6, type: 'hopper', x: 990, y: 494, width: 24, height: 26, vx: 1.1, vy: 0, minX: 900, maxX: 1200, isAlive: true, facingLeft: false, animFrame: 0 },
          { id: 7, type: 'crawler', x: 1850, y: 494, width: 26, height: 24, vx: 1.0, vy: 0, minX: 1750, maxX: 2050, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 8, type: 'hopper', x: 2680, y: 494, width: 24, height: 26, vx: 1.2, vy: 0, minX: 2550, maxX: 2800, isAlive: true, facingLeft: false, animFrame: 0 },
        ],
        goal: { x: 3260, y: 350, width: 44, height: 80 },
      };

    case 3:
      // ==========================================
      // المرحلة 3: كهوف التخزين (Storage Caverns)
      // ==========================================
      return {
        width: 3500,
        height: 600,
        spawnPoint: { x: 80, y: 440 },
        platforms: [
          { x: 0, y: 520, width: 700, height: 80, type: 'solid' },
          { x: 800, y: 520, width: 700, height: 80, type: 'solid' },
          { x: 1600, y: 520, width: 750, height: 80, type: 'solid' },
          { x: 2450, y: 520, width: 1050, height: 80, type: 'solid' },

          // Magnetic platter step platforms
          { x: 220, y: 430, width: 120, height: 22, type: 'solid' },
          { x: 390, y: 340, width: 130, height: 22, type: 'solid' },
          { x: 570, y: 400, width: 110, height: 22, type: 'solid' },

          // Moving SSD block
          { x: 710, y: 460, width: 85, height: 20, type: 'moving', startX: 700, moveRangeX: 95, speed: 1.3 },

          // Byte size hierarchy ledges (KB, MB, GB, TB)
          { x: 920, y: 420, width: 130, height: 22, type: 'solid' },
          { x: 1100, y: 330, width: 150, height: 22, type: 'solid' },
          { x: 1320, y: 260, width: 140, height: 22, type: 'solid' },

          // Moving SSD block 2
          { x: 1510, y: 450, width: 85, height: 20, type: 'moving', startX: 1500, moveRangeX: 95, speed: 1.5 },

          // Deep cavern bridges
          { x: 1740, y: 410, width: 130, height: 22, type: 'solid' },
          { x: 1940, y: 320, width: 160, height: 22, type: 'solid' },
          { x: 2160, y: 260, width: 140, height: 22, type: 'solid' },

          // Final cavern ascent
          { x: 2600, y: 420, width: 140, height: 22, type: 'solid' },
          { x: 2800, y: 340, width: 150, height: 22, type: 'solid' },
          { x: 3040, y: 270, width: 160, height: 22, type: 'solid' },
          { x: 3240, y: 360, width: 150, height: 22, type: 'solid' },
        ],
        terminals: [
          { id: 7, questionId: 41, solved: false, gateId: 7, titleAr: 'محطة HDD مقابل SSD', x: 440, y: 300, width: 36, height: 40 },
          { id: 8, questionId: 43, solved: false, gateId: 8, titleAr: 'محطة سعات الجيجابايت', x: 1160, y: 290, width: 36, height: 40 },
          { id: 9, questionId: 45, solved: false, gateId: 9, titleAr: 'محطة ترتيب السعات', x: 2000, y: 280, width: 36, height: 40 },
        ],
        gates: [
          { id: 7, isOpen: false, requiredTerminalId: 7, labelAr: 'بوابة التخزين 1', x: 740, y: 400, width: 24, height: 120 },
          { id: 8, isOpen: false, requiredTerminalId: 8, labelAr: 'بوابة السرعة 2', x: 1550, y: 400, width: 24, height: 120 },
          { id: 9, isOpen: false, requiredTerminalId: 9, labelAr: 'بوابة السحابة 3', x: 2410, y: 400, width: 24, height: 120 },
        ],
        collectibles: [
          { id: 25, type: 'coin', x: 180, y: 480, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 26, type: 'gem',  x: 260, y: 380, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 27, type: 'coin', x: 410, y: 290, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 28, type: 'coin', x: 960, y: 370, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 29, type: 'gem',  x: 1370, y: 210, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 30, type: 'heart', x: 1800, y: 360, width: 18, height: 18, collected: false, floatOffset: 0, value: 1 },
          { id: 31, type: 'gem',  x: 2210, y: 210, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 32, type: 'coin', x: 2850, y: 290, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 33, type: 'gem',  x: 3100, y: 220, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
        ],
        springs: [
          { id: 5, x: 190, y: 504, width: 28, height: 16, power: 14.0, activated: false, timer: 0 },
          { id: 6, x: 1640, y: 504, width: 28, height: 16, power: 14.5, activated: false, timer: 0 },
        ],
        checkpoints: [
          { id: 5, x: 840, y: 470, width: 24, height: 50, activated: false },
          { id: 6, x: 1650, y: 470, width: 24, height: 50, activated: false },
        ],
        enemies: [
          { id: 9, type: 'flyer', x: 450, y: 370, width: 24, height: 22, vx: 1.0, vy: 0, minX: 350, maxX: 580, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 10, type: 'crawler', x: 1050, y: 494, width: 26, height: 24, vx: 0.9, vy: 0, minX: 950, maxX: 1250, isAlive: true, facingLeft: false, animFrame: 0 },
          { id: 11, type: 'flyer', x: 1850, y: 350, width: 24, height: 22, vx: 1.2, vy: 0, minX: 1750, maxX: 2000, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 12, type: 'hopper', x: 2680, y: 494, width: 24, height: 26, vx: 1.1, vy: 0, minX: 2550, maxX: 2800, isAlive: true, facingLeft: false, animFrame: 0 },
        ],
        goal: { x: 3370, y: 290, width: 44, height: 80 },
      };

    case 4:
      // ==========================================
      // المرحلة 4: مختبر الأجهزة (Hardware Lab)
      // ==========================================
      return {
        width: 3600,
        height: 600,
        spawnPoint: { x: 90, y: 440 },
        platforms: [
          { x: 0, y: 520, width: 720, height: 80, type: 'solid' },
          { x: 820, y: 520, width: 750, height: 80, type: 'solid' },
          { x: 1680, y: 520, width: 800, height: 80, type: 'solid' },
          { x: 2580, y: 520, width: 1020, height: 80, type: 'solid' },

          // Power conduits
          { x: 240, y: 420, width: 120, height: 22, type: 'solid' },
          { x: 420, y: 330, width: 130, height: 22, type: 'solid' },
          { x: 610, y: 410, width: 110, height: 22, type: 'solid' },

          // Moving PSU rail
          { x: 730, y: 460, width: 85, height: 20, type: 'moving', startX: 720, moveRangeX: 95, speed: 1.5 },

          // GPU cooling vents & heatsinks
          { x: 940, y: 420, width: 130, height: 22, type: 'solid' },
          { x: 1140, y: 340, width: 150, height: 22, type: 'solid' },
          { x: 1360, y: 270, width: 140, height: 22, type: 'solid' },

          // Moving GPU fan platform
          { x: 1580, y: 460, width: 85, height: 20, type: 'moving', startX: 1570, moveRangeX: 100, speed: 1.7 },

          // High-speed USB-C & Thunderbolt conduits
          { x: 1820, y: 410, width: 130, height: 22, type: 'solid' },
          { x: 2030, y: 320, width: 160, height: 22, type: 'solid' },
          { x: 2260, y: 250, width: 150, height: 22, type: 'solid' },

          // Final lab chamber
          { x: 2740, y: 430, width: 140, height: 22, type: 'solid' },
          { x: 2950, y: 350, width: 150, height: 22, type: 'solid' },
          { x: 3180, y: 280, width: 160, height: 22, type: 'solid' },
          { x: 3380, y: 370, width: 150, height: 22, type: 'solid' },
        ],
        terminals: [
          { id: 10, questionId: 61, solved: false, gateId: 10, titleAr: 'محطة مزود الطاقة PSU', x: 470, y: 290, width: 36, height: 40 },
          { id: 11, questionId: 63, solved: false, gateId: 11, titleAr: 'محطة كرت الشاشة GPU', x: 1200, y: 300, width: 36, height: 40 },
          { id: 12, questionId: 65, solved: false, gateId: 12, titleAr: 'محطة منافذ HDMI و USB', x: 2100, y: 280, width: 36, height: 40 },
        ],
        gates: [
          { id: 10, isOpen: false, requiredTerminalId: 10, labelAr: 'بوابة الطاقة 1', x: 770, y: 400, width: 24, height: 120 },
          { id: 11, isOpen: false, requiredTerminalId: 11, labelAr: 'بوابة الرسوميات 2', x: 1620, y: 400, width: 24, height: 120 },
          { id: 12, isOpen: false, requiredTerminalId: 12, labelAr: 'بوابة المنافذ 3', x: 2520, y: 400, width: 24, height: 120 },
        ],
        collectibles: [
          { id: 34, type: 'coin', x: 200, y: 480, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 35, type: 'gem',  x: 290, y: 370, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 36, type: 'coin', x: 450, y: 280, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 37, type: 'coin', x: 990, y: 370, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 38, type: 'gem',  x: 1420, y: 220, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 39, type: 'heart', x: 1900, y: 360, width: 18, height: 18, collected: false, floatOffset: 0, value: 1 },
          { id: 40, type: 'gem',  x: 2320, y: 200, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 41, type: 'coin', x: 3000, y: 300, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 42, type: 'gem',  x: 3240, y: 230, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
        ],
        springs: [
          { id: 7, x: 200, y: 504, width: 28, height: 16, power: 14.5, activated: false, timer: 0 },
          { id: 8, x: 1720, y: 504, width: 28, height: 16, power: 15.0, activated: false, timer: 0 },
        ],
        checkpoints: [
          { id: 7, x: 860, y: 470, width: 24, height: 50, activated: false },
          { id: 8, x: 1730, y: 470, width: 24, height: 50, activated: false },
        ],
        enemies: [
          { id: 13, type: 'flyer', x: 500, y: 350, width: 24, height: 22, vx: 1.2, vy: 0, minX: 400, maxX: 630, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 14, type: 'hopper', x: 1050, y: 494, width: 24, height: 26, vx: 1.1, vy: 0, minX: 950, maxX: 1200, isAlive: true, facingLeft: false, animFrame: 0 },
          { id: 15, type: 'flyer', x: 1950, y: 340, width: 24, height: 22, vx: 1.3, vy: 0, minX: 1850, maxX: 2100, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 16, type: 'hopper', x: 2800, y: 494, width: 24, height: 26, vx: 1.2, vy: 0, minX: 2680, maxX: 2950, isAlive: true, facingLeft: false, animFrame: 0 },
        ],
        goal: { x: 3470, y: 300, width: 44, height: 80 },
      };

    case 5:
    default:
      // ==========================================
      // المرحلة 5: قلعة العالم الرقمي (Final Citadel & Boss Battle)
      // ==========================================
      return {
        width: 3200,
        height: 600,
        spawnPoint: { x: 90, y: 440 },
        platforms: [
          // Journey through firewall matrices
          { x: 0, y: 520, width: 650, height: 80, type: 'solid' },
          { x: 750, y: 520, width: 700, height: 80, type: 'solid' },
          { x: 1550, y: 520, width: 550, height: 80, type: 'solid' },

          // Floating cyber grids
          { x: 220, y: 420, width: 120, height: 22, type: 'solid' },
          { x: 400, y: 330, width: 130, height: 22, type: 'solid' },
          { x: 580, y: 410, width: 100, height: 22, type: 'solid' },

          { x: 670, y: 460, width: 80, height: 20, type: 'moving', startX: 660, moveRangeX: 90, speed: 1.6 },

          { x: 880, y: 420, width: 120, height: 22, type: 'solid' },
          { x: 1070, y: 340, width: 140, height: 22, type: 'solid' },
          { x: 1280, y: 280, width: 130, height: 22, type: 'solid' },

          { x: 1460, y: 460, width: 80, height: 20, type: 'moving', startX: 1450, moveRangeX: 95, speed: 1.8 },

          { x: 1680, y: 420, width: 130, height: 22, type: 'solid' },
          { x: 1880, y: 340, width: 150, height: 22, type: 'solid' },

          // The Grand Boss Arena (Floor from 2150 to 3200)
          { x: 2150, y: 520, width: 1050, height: 80, type: 'solid' },
          // Left battle platform
          { x: 2260, y: 410, width: 130, height: 20, type: 'solid' },
          // Center high battle platform (to attack boss core)
          { x: 2540, y: 320, width: 180, height: 20, type: 'solid' },
          // Right battle platform
          { x: 2860, y: 410, width: 130, height: 20, type: 'solid' },
        ],
        terminals: [
          { id: 13, questionId: 81, solved: false, gateId: 13, titleAr: 'محطة أنظمة التشغيل OS', x: 440, y: 290, width: 36, height: 40 },
          { id: 14, questionId: 83, solved: false, gateId: 14, titleAr: 'محطة الجدار الناري Firewall', x: 1120, y: 300, width: 36, height: 40 },
          { id: 15, questionId: 85, solved: false, gateId: 15, titleAr: 'محطة أمان كلمات المرور', x: 1940, y: 300, width: 36, height: 40 },
          // Arena Terminal (Boss Quiz Station)
          { id: 16, questionId: 87, solved: false, titleAr: 'محطة إضعاف درع الزعيم', x: 2610, y: 280, width: 36, height: 40 },
        ],
        gates: [
          { id: 13, isOpen: false, requiredTerminalId: 13, labelAr: 'بوابة البروتوكول 1', x: 710, y: 400, width: 24, height: 120 },
          { id: 14, isOpen: false, requiredTerminalId: 14, labelAr: 'بوابة الأمان 2', x: 1510, y: 400, width: 24, height: 120 },
          { id: 15, isOpen: false, requiredTerminalId: 15, labelAr: 'بوابة عرش الزعيم 3', x: 2120, y: 400, width: 24, height: 120 },
        ],
        collectibles: [
          { id: 43, type: 'coin', x: 180, y: 480, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 44, type: 'gem',  x: 270, y: 370, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 45, type: 'coin', x: 420, y: 280, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 46, type: 'gem',  x: 1330, y: 230, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 47, type: 'heart', x: 1720, y: 370, width: 18, height: 18, collected: false, floatOffset: 0, value: 1 },
          { id: 48, type: 'gem',  x: 2310, y: 360, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
          { id: 49, type: 'coin', x: 2620, y: 250, width: 18, height: 18, collected: false, floatOffset: 0, value: 10 },
          { id: 50, type: 'gem',  x: 2910, y: 360, width: 20, height: 20, collected: false, floatOffset: 0, value: 50 },
        ],
        springs: [
          { id: 9, x: 180, y: 504, width: 28, height: 16, power: 14.5, activated: false, timer: 0 },
          { id: 10, x: 2200, y: 504, width: 28, height: 16, power: 15.0, activated: false, timer: 0 },
          { id: 11, x: 2980, y: 504, width: 28, height: 16, power: 15.0, activated: false, timer: 0 },
        ],
        checkpoints: [
          { id: 9, x: 790, y: 470, width: 24, height: 50, activated: false },
          { id: 10, x: 2160, y: 470, width: 24, height: 50, activated: false },
        ],
        enemies: [
          { id: 17, type: 'flyer', x: 460, y: 350, width: 24, height: 22, vx: 1.2, vy: 0, minX: 380, maxX: 600, isAlive: true, facingLeft: true, animFrame: 0 },
          { id: 18, type: 'hopper', x: 980, y: 494, width: 24, height: 26, vx: 1.1, vy: 0, minX: 900, maxX: 1150, isAlive: true, facingLeft: false, animFrame: 0 },
          { id: 19, type: 'flyer', x: 1780, y: 340, width: 24, height: 22, vx: 1.3, vy: 0, minX: 1680, maxX: 1950, isAlive: true, facingLeft: true, animFrame: 0 },
        ],
        // The Final Boss!
        boss: {
          id: 99,
          type: 'boss',
          x: 2580,
          y: 430,
          width: 76,
          height: 85,
          vx: 1.2,
          vy: 0,
          minX: 2350,
          maxX: 2850,
          isAlive: true,
          health: 5,
          maxHealth: 5,
          facingLeft: true,
          animFrame: 0,
          attackTimer: 0,
        },
        // Victory Portal appears upon defeating the boss!
        goal: { x: 3080, y: 430, width: 44, height: 80 },
      };
  }
}
