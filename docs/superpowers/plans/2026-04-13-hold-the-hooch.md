# Hold the Hooch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "Hold the Hooch," an endless runner where Gurgles the Gnome jumps obstacles and balances hooch, using Phaser 3 with no build tools, deployable to GitHub Pages.

**Architecture:** Static site with Phaser 3 loaded via CDN. Four scenes (Boot, Menu, Game, GameOver) with separate JS files per scene and game object. Placeholder SVG assets for all sprites and backgrounds. Arcade physics for jumping/collision.

**Tech Stack:** Phaser 3 (CDN), vanilla JS (ES6 classes), HTML5 Canvas, SVG assets, GitHub Pages

---

## File Structure

```
holdthehooch/
├── index.html                  # Entry point — loads Phaser CDN, all JS files, starts game
├── css/
│   └── style.css               # Page wrapper: centering the canvas, background color, font
├── js/
│   ├── config.js               # Phaser.Game config + game constants (speeds, thresholds)
│   ├── scenes/
│   │   ├── BootScene.js        # Preloads all assets, shows loading bar, transitions to Menu
│   │   ├── MenuScene.js        # Title, idle Gurgles, high score, "Press Space" prompt
│   │   ├── GameScene.js        # Main gameplay loop: spawning, physics, HUD, scoring
│   │   └── GameOverScene.js    # Death screen: cause, score, high score, restart prompt
│   └── objects/
│       ├── Gurgles.js          # Player sprite: jump, animation, mug tilt visuals
│       ├── HoochBalance.js     # Balance model: value, wobble, spill meter, arrow key input
│       ├── ObstacleManager.js  # Obstacle group: spawn timer, pooling, speed scaling
│       └── CollectibleManager.js # Collectible group: spawn timer, pooling, score bonus
└── assets/
    └── svg/
        ├── gurgles.svg         # Placeholder gnome (standing)
        ├── gurgles-jump.svg    # Placeholder gnome (jumping)
        ├── mug.svg             # Mug with liquid
        ├── root.svg            # Tree root obstacle
        ├── rock.svg            # Rock obstacle
        ├── mushroom.svg        # Mushroom cluster obstacle
        ├── log.svg             # Fallen log obstacle
        ├── herb.svg            # Herb collectible
        ├── hops.svg            # Golden hops collectible
        ├── potion.svg          # Potion ingredient collectible
        ├── bg-mountains.svg    # Far parallax layer (wide, tileable)
        ├── bg-trees.svg        # Mid parallax layer (wide, tileable)
        └── bg-ground.svg       # Foreground ground strip
```

---

### Task 1: Project Scaffolding + Git Init

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `.gitignore`

- [ ] **Step 1: Initialize git repo**

```bash
cd /c/apps/holdthehooch
git init
```

- [ ] **Step 2: Create `.gitignore`**

```gitignore
.superpowers/
.claude/
.txt
```

- [ ] **Step 3: Create `css/style.css`**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #1a1a2e;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
}

canvas {
    display: block;
    max-width: 100vw;
    max-height: 100vh;
}
```

- [ ] **Step 4: Create `index.html`**

This is the entry point. It loads Phaser 3 via CDN, then all game JS files in dependency order. The `<div id="game-container">` is where Phaser mounts the canvas.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hold the Hooch</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="game-container"></div>

    <!-- Phaser 3 -->
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>

    <!-- Game objects -->
    <script src="js/objects/HoochBalance.js"></script>
    <script src="js/objects/Gurgles.js"></script>
    <script src="js/objects/ObstacleManager.js"></script>
    <script src="js/objects/CollectibleManager.js"></script>

    <!-- Scenes -->
    <script src="js/scenes/BootScene.js"></script>
    <script src="js/scenes/MenuScene.js"></script>
    <script src="js/scenes/GameScene.js"></script>
    <script src="js/scenes/GameOverScene.js"></script>

    <!-- Game config (starts the game) -->
    <script src="js/config.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create `js/config.js`** (minimal stub to verify Phaser loads)

```js
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GROUND_Y = 500;

// Game constants
const CONSTANTS = {
    INITIAL_SPEED: 200,
    MAX_SPEED: 600,
    SPEED_INCREMENT: 5,
    SPEED_RAMP_INTERVAL: 10000,
    JUMP_VELOCITY: -500,
    GRAVITY: 1200,
    BALANCE_DRIFT_RATE: 0.3,
    BALANCE_INPUT_FORCE: 2.5,
    BALANCE_JUMP_WOBBLE: 15,
    BALANCE_SPILL_THRESHOLD: 70,
    SPILL_FILL_RATE: 0.5,
    SPILL_DRAIN_RATE: 0.1,
    OBSTACLE_MIN_GAP: 300,
    COLLECTIBLE_BONUS: 50,
};

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: CONSTANTS.GRAVITY },
            debug: false,
        },
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#87CEEB',
};

const game = new Phaser.Game(config);
```

- [ ] **Step 6: Create stub scene files so Phaser boots without errors**

Create `js/scenes/BootScene.js`:
```js
class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {}
    create() {
        this.scene.start('Menu');
    }
}
```

Create `js/scenes/MenuScene.js`:
```js
class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }
    create() {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Hold the Hooch', {
            fontSize: '48px',
            fill: '#fff',
        }).setOrigin(0.5);
    }
}
```

Create `js/scenes/GameScene.js`:
```js
class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {}
    update() {}
}
```

Create `js/scenes/GameOverScene.js`:
```js
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    create() {}
}
```

Create stub object files — `js/objects/HoochBalance.js`:
```js
class HoochBalance {
    constructor() {}
}
```

Create `js/objects/Gurgles.js`:
```js
class Gurgles {
    constructor() {}
}
```

Create `js/objects/ObstacleManager.js`:
```js
class ObstacleManager {
    constructor() {}
}
```

Create `js/objects/CollectibleManager.js`:
```js
class CollectibleManager {
    constructor() {}
}
```

- [ ] **Step 7: Open `index.html` in a browser, verify Phaser canvas appears with "Hold the Hooch" text**

- [ ] **Step 8: Commit**

```bash
git add .gitignore index.html css/style.css js/
git commit -m "feat: scaffold project with Phaser 3, stub scenes, and game config"
```

---

### Task 2: Placeholder SVG Assets

**Files:**
- Create: all files in `assets/svg/`

Create every SVG placeholder asset. These are simple flat/minimal geometric shapes using bold colors. Each SVG should have a consistent viewBox and be recognizable at game scale.

- [ ] **Step 1: Create `assets/svg/gurgles.svg`** — standing placeholder gnome

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" width="64" height="80">
  <!-- Pointy hat -->
  <polygon points="32,2 20,28 44,28" fill="#c0392b"/>
  <!-- Face -->
  <circle cx="32" cy="36" r="10" fill="#f5cba7"/>
  <!-- Eyes -->
  <circle cx="28" cy="34" r="2" fill="#2c3e50"/>
  <circle cx="36" cy="34" r="2" fill="#2c3e50"/>
  <!-- Beard -->
  <ellipse cx="32" cy="44" rx="8" ry="5" fill="#bdc3c7"/>
  <!-- Body -->
  <rect x="24" y="46" width="16" height="18" rx="3" fill="#27ae60"/>
  <!-- Belt -->
  <rect x="24" y="56" width="16" height="3" fill="#8B4513"/>
  <!-- Left arm (extended out holding mug) -->
  <line x1="24" y1="52" x2="8" y2="48" stroke="#f5cba7" stroke-width="4" stroke-linecap="round"/>
  <!-- Right arm (extended out holding mug) -->
  <line x1="40" y1="52" x2="56" y2="48" stroke="#f5cba7" stroke-width="4" stroke-linecap="round"/>
  <!-- Legs -->
  <rect x="26" y="64" width="5" height="10" rx="2" fill="#8B6914"/>
  <rect x="33" y="64" width="5" height="10" rx="2" fill="#8B6914"/>
  <!-- Feet -->
  <ellipse cx="28" cy="75" rx="5" ry="3" fill="#5D4037"/>
  <ellipse cx="36" cy="75" rx="5" ry="3" fill="#5D4037"/>
</svg>
```

- [ ] **Step 2: Create `assets/svg/gurgles-jump.svg`** — jumping pose (legs tucked)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 70" width="64" height="70">
  <!-- Pointy hat -->
  <polygon points="32,2 20,28 44,28" fill="#c0392b"/>
  <!-- Face -->
  <circle cx="32" cy="36" r="10" fill="#f5cba7"/>
  <!-- Eyes (excited) -->
  <circle cx="28" cy="34" r="2" fill="#2c3e50"/>
  <circle cx="36" cy="34" r="2" fill="#2c3e50"/>
  <!-- Beard -->
  <ellipse cx="32" cy="44" rx="8" ry="5" fill="#bdc3c7"/>
  <!-- Body -->
  <rect x="24" y="46" width="16" height="16" rx="3" fill="#27ae60"/>
  <!-- Belt -->
  <rect x="24" y="54" width="16" height="3" fill="#8B4513"/>
  <!-- Arms extended -->
  <line x1="24" y1="50" x2="6" y2="44" stroke="#f5cba7" stroke-width="4" stroke-linecap="round"/>
  <line x1="40" y1="50" x2="58" y2="44" stroke="#f5cba7" stroke-width="4" stroke-linecap="round"/>
  <!-- Tucked legs -->
  <rect x="26" y="62" width="5" height="6" rx="2" fill="#8B6914"/>
  <rect x="33" y="62" width="5" height="6" rx="2" fill="#8B6914"/>
</svg>
```

- [ ] **Step 3: Create `assets/svg/mug.svg`** — hooch mug with foam

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" width="24" height="28">
  <!-- Mug body -->
  <rect x="2" y="6" width="16" height="18" rx="3" fill="#8B4513"/>
  <!-- Handle -->
  <path d="M18,10 Q24,10 24,16 Q24,22 18,22" stroke="#8B4513" stroke-width="3" fill="none"/>
  <!-- Liquid -->
  <rect x="4" y="10" width="12" height="12" rx="1" fill="#D4A017"/>
  <!-- Foam -->
  <ellipse cx="10" cy="8" rx="8" ry="4" fill="#FFF9C4"/>
</svg>
```

- [ ] **Step 4: Create obstacle SVGs**

`assets/svg/root.svg` — tree root:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" width="48" height="32">
  <path d="M4,32 Q8,8 24,12 Q36,4 44,32" fill="#5D4037"/>
  <path d="M10,32 Q14,16 24,18 Q32,12 38,32" fill="#795548"/>
</svg>
```

`assets/svg/rock.svg` — rock:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 32" width="44" height="32">
  <ellipse cx="22" cy="20" rx="20" ry="12" fill="#78909C"/>
  <ellipse cx="18" cy="16" rx="14" ry="8" fill="#90A4AE"/>
  <ellipse cx="26" cy="22" rx="10" ry="6" fill="#607D8B"/>
</svg>
```

`assets/svg/mushroom.svg` — mushroom cluster:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 40" width="48" height="40">
  <!-- Big mushroom -->
  <rect x="18" y="22" width="6" height="18" rx="2" fill="#F5F5DC"/>
  <ellipse cx="21" cy="20" rx="14" ry="10" fill="#e74c3c"/>
  <circle cx="16" cy="17" r="3" fill="#fff" opacity="0.7"/>
  <circle cx="26" cy="19" r="2" fill="#fff" opacity="0.7"/>
  <!-- Small mushroom -->
  <rect x="36" y="30" width="4" height="10" rx="1" fill="#F5F5DC"/>
  <ellipse cx="38" cy="29" rx="8" ry="6" fill="#e67e22"/>
  <circle cx="35" cy="27" r="2" fill="#fff" opacity="0.7"/>
</svg>
```

`assets/svg/log.svg` — fallen log:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 28" width="64" height="28">
  <ellipse cx="8" cy="14" rx="8" ry="14" fill="#795548"/>
  <rect x="8" y="2" width="52" height="24" rx="2" fill="#8D6E63"/>
  <ellipse cx="60" cy="14" rx="6" ry="12" fill="#5D4037"/>
  <!-- Wood rings on end -->
  <ellipse cx="60" cy="14" rx="3" ry="6" fill="#795548" opacity="0.5"/>
</svg>
```

- [ ] **Step 5: Create collectible SVGs**

`assets/svg/herb.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" width="24" height="28">
  <line x1="12" y1="28" x2="12" y2="10" stroke="#27ae60" stroke-width="2"/>
  <ellipse cx="8" cy="10" rx="6" ry="8" fill="#2ecc71" transform="rotate(-15,8,10)"/>
  <ellipse cx="16" cy="12" rx="5" ry="7" fill="#27ae60" transform="rotate(15,16,12)"/>
  <ellipse cx="12" cy="6" rx="4" ry="6" fill="#2ecc71"/>
</svg>
```

`assets/svg/hops.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" width="24" height="28">
  <circle cx="12" cy="14" r="10" fill="#F1C40F"/>
  <circle cx="12" cy="8" r="4" fill="#F39C12"/>
  <circle cx="7" cy="16" r="4" fill="#F39C12"/>
  <circle cx="17" cy="16" r="4" fill="#F39C12"/>
  <circle cx="12" cy="20" r="4" fill="#F39C12"/>
  <line x1="12" y1="2" x2="12" y2="0" stroke="#27ae60" stroke-width="2"/>
</svg>
```

`assets/svg/potion.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 28" width="20" height="28">
  <!-- Bottle neck -->
  <rect x="7" y="2" width="6" height="6" rx="1" fill="#bdc3c7"/>
  <!-- Cork -->
  <rect x="8" y="0" width="4" height="3" rx="1" fill="#8B4513"/>
  <!-- Bottle body -->
  <path d="M7,8 L4,14 L4,24 Q4,28 10,28 Q16,28 16,24 L16,14 L13,8 Z" fill="#3498db" opacity="0.8"/>
  <!-- Liquid -->
  <path d="M5,16 L5,24 Q5,27 10,27 Q15,27 15,24 L15,16 Z" fill="#9b59b6" opacity="0.7"/>
  <!-- Sparkle -->
  <circle cx="10" cy="20" r="1.5" fill="#fff" opacity="0.8"/>
</svg>
```

- [ ] **Step 6: Create background SVGs**

`assets/svg/bg-mountains.svg` — far background, 1600px wide for tiling:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600" width="1600" height="600">
  <!-- Sky gradient -->
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a3e"/>
      <stop offset="60%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#87CEEB"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="600" fill="url(#sky)"/>
  <!-- Clouds -->
  <ellipse cx="200" cy="100" rx="80" ry="30" fill="#fff" opacity="0.15"/>
  <ellipse cx="600" cy="80" rx="100" ry="25" fill="#fff" opacity="0.1"/>
  <ellipse cx="1100" cy="120" rx="70" ry="20" fill="#fff" opacity="0.12"/>
  <ellipse cx="1400" cy="70" rx="90" ry="28" fill="#fff" opacity="0.1"/>
  <!-- Distant mountains -->
  <polygon points="0,450 150,280 300,400 450,250 600,380 750,300 900,350 1050,260 1200,380 1350,290 1500,350 1600,400 1600,600 0,600" fill="#2E4053" opacity="0.6"/>
  <polygon points="0,500 200,350 400,420 550,320 700,400 850,340 1000,400 1150,330 1300,400 1450,350 1600,420 1600,600 0,600" fill="#34495E" opacity="0.5"/>
</svg>
```

`assets/svg/bg-trees.svg` — mid background treeline, 1600px wide:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600" width="1600" height="600">
  <!-- Tree silhouettes -->
  <rect x="50" y="300" width="16" height="300" fill="#2d5016"/>
  <circle cx="58" cy="280" r="40" fill="#2E7D32"/>
  <circle cx="38" cy="300" r="30" fill="#1B5E20"/>
  <circle cx="78" cy="300" r="30" fill="#1B5E20"/>

  <rect x="200" y="260" width="20" height="340" fill="#2d5016"/>
  <circle cx="210" cy="230" r="50" fill="#388E3C"/>
  <circle cx="185" cy="260" r="35" fill="#2E7D32"/>
  <circle cx="235" cy="260" r="35" fill="#2E7D32"/>

  <rect x="400" y="320" width="14" height="280" fill="#2d5016"/>
  <circle cx="407" cy="300" r="35" fill="#2E7D32"/>
  <circle cx="390" cy="315" r="25" fill="#1B5E20"/>
  <circle cx="424" cy="315" r="25" fill="#1B5E20"/>

  <rect x="580" y="280" width="18" height="320" fill="#2d5016"/>
  <circle cx="589" cy="255" r="45" fill="#388E3C"/>
  <circle cx="567" cy="278" r="32" fill="#2E7D32"/>
  <circle cx="611" cy="278" r="32" fill="#2E7D32"/>

  <rect x="750" y="310" width="14" height="290" fill="#2d5016"/>
  <circle cx="757" cy="290" r="38" fill="#2E7D32"/>
  <circle cx="740" cy="308" r="26" fill="#1B5E20"/>
  <circle cx="774" cy="308" r="26" fill="#1B5E20"/>

  <rect x="920" y="270" width="18" height="330" fill="#2d5016"/>
  <circle cx="929" cy="245" r="45" fill="#388E3C"/>
  <circle cx="908" cy="268" r="32" fill="#2E7D32"/>
  <circle cx="950" cy="268" r="32" fill="#2E7D32"/>

  <rect x="1100" y="300" width="16" height="300" fill="#2d5016"/>
  <circle cx="1108" cy="278" r="40" fill="#2E7D32"/>
  <circle cx="1088" cy="298" r="28" fill="#1B5E20"/>
  <circle cx="1128" cy="298" r="28" fill="#1B5E20"/>

  <rect x="1300" y="280" width="18" height="320" fill="#2d5016"/>
  <circle cx="1309" cy="255" r="45" fill="#388E3C"/>
  <circle cx="1287" cy="278" r="32" fill="#2E7D32"/>
  <circle cx="1331" cy="278" r="32" fill="#2E7D32"/>

  <rect x="1480" y="310" width="14" height="290" fill="#2d5016"/>
  <circle cx="1487" cy="290" r="38" fill="#2E7D32"/>
  <circle cx="1470" cy="308" r="26" fill="#1B5E20"/>
  <circle cx="1504" cy="308" r="26" fill="#1B5E20"/>
</svg>
```

`assets/svg/bg-ground.svg` — foreground ground strip, 1600px wide:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 200" width="1600" height="200">
  <!-- Dirt -->
  <rect x="0" y="20" width="1600" height="180" fill="#5D4037"/>
  <!-- Grass top -->
  <rect x="0" y="0" width="1600" height="24" fill="#4CAF50"/>
  <rect x="0" y="0" width="1600" height="8" fill="#66BB6A"/>
  <!-- Grass tufts -->
  <path d="M50,4 L54,-6 L58,4" fill="#81C784"/>
  <path d="M200,4 L204,-8 L208,4" fill="#81C784"/>
  <path d="M380,4 L384,-5 L388,4" fill="#81C784"/>
  <path d="M520,4 L525,-7 L530,4" fill="#81C784"/>
  <path d="M700,4 L704,-6 L708,4" fill="#81C784"/>
  <path d="M880,4 L884,-8 L888,4" fill="#81C784"/>
  <path d="M1050,4 L1054,-5 L1058,4" fill="#81C784"/>
  <path d="M1250,4 L1254,-7 L1258,4" fill="#81C784"/>
  <path d="M1420,4 L1424,-6 L1428,4" fill="#81C784"/>
</svg>
```

- [ ] **Step 7: Commit**

```bash
git add assets/
git commit -m "feat: add placeholder SVG assets for all game sprites and backgrounds"
```

---

### Task 3: BootScene — Asset Loading

**Files:**
- Modify: `js/scenes/BootScene.js`

- [ ] **Step 1: Implement BootScene with preload of all assets and a loading bar**

Replace the entire contents of `js/scenes/BootScene.js`:

```js
class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const barBg = this.add.rectangle(width / 2, height / 2, 320, 30, 0x444444);
        const bar = this.add.rectangle(width / 2 - 150, height / 2, 0, 20, 0x27ae60);
        bar.setOrigin(0, 0.5);

        const loadingText = this.add.text(width / 2, height / 2 - 40, 'Loading...', {
            fontSize: '20px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            bar.width = 300 * value;
        });

        // Character
        this.load.svg('gurgles', 'assets/svg/gurgles.svg', { width: 64, height: 80 });
        this.load.svg('gurgles-jump', 'assets/svg/gurgles-jump.svg', { width: 64, height: 70 });
        this.load.svg('mug', 'assets/svg/mug.svg', { width: 24, height: 28 });

        // Obstacles
        this.load.svg('root', 'assets/svg/root.svg', { width: 48, height: 32 });
        this.load.svg('rock', 'assets/svg/rock.svg', { width: 44, height: 32 });
        this.load.svg('mushroom', 'assets/svg/mushroom.svg', { width: 48, height: 40 });
        this.load.svg('log', 'assets/svg/log.svg', { width: 64, height: 28 });

        // Collectibles
        this.load.svg('herb', 'assets/svg/herb.svg', { width: 24, height: 28 });
        this.load.svg('hops', 'assets/svg/hops.svg', { width: 24, height: 28 });
        this.load.svg('potion', 'assets/svg/potion.svg', { width: 20, height: 28 });

        // Backgrounds
        this.load.svg('bg-mountains', 'assets/svg/bg-mountains.svg', { width: 1600, height: 600 });
        this.load.svg('bg-trees', 'assets/svg/bg-trees.svg', { width: 1600, height: 600 });
        this.load.svg('bg-ground', 'assets/svg/bg-ground.svg', { width: 1600, height: 200 });
    }

    create() {
        this.scene.start('Menu');
    }
}
```

- [ ] **Step 2: Open in browser, verify loading bar appears and transitions to Menu scene text**

- [ ] **Step 3: Commit**

```bash
git add js/scenes/BootScene.js
git commit -m "feat: implement BootScene with asset preloading and loading bar"
```

---

### Task 4: MenuScene — Title Screen

**Files:**
- Modify: `js/scenes/MenuScene.js`

- [ ] **Step 1: Implement MenuScene with title, idle Gurgles, high score, and start prompt**

Replace the entire contents of `js/scenes/MenuScene.js`:

```js
class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        // Background
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg-mountains').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        // Title
        this.add.text(GAME_WIDTH / 2, 120, 'Hold the Hooch', {
            fontSize: '52px',
            fill: '#F1C40F',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(GAME_WIDTH / 2, 175, 'A Gurgles the Gnome Adventure', {
            fontSize: '18px',
            fill: '#bdc3c7',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
        }).setOrigin(0.5);

        // Idle Gurgles
        const gurgles = this.add.image(GAME_WIDTH / 2, 320, 'gurgles');
        gurgles.setScale(2);

        // Mugs wobble tween
        const mugLeft = this.add.image(GAME_WIDTH / 2 - 55, 300, 'mug').setScale(1.5);
        const mugRight = this.add.image(GAME_WIDTH / 2 + 55, 300, 'mug').setScale(1.5).setFlipX(true);

        this.tweens.add({
            targets: [mugLeft, mugRight],
            angle: { from: -8, to: 8 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // High score
        const highScore = localStorage.getItem('holdthehooch_highscore') || 0;
        this.add.text(GAME_WIDTH / 2, 420, `High Score: ${highScore}`, {
            fontSize: '22px',
            fill: '#ecf0f1',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        // Start prompt (blinking)
        const startText = this.add.text(GAME_WIDTH / 2, 480, 'Press SPACE to Start', {
            fontSize: '24px',
            fill: '#F1C40F',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: { from: 1, to: 0.3 },
            duration: 600,
            yoyo: true,
            repeat: -1,
        });

        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Game');
        });
    }
}
```

- [ ] **Step 2: Open in browser, verify menu screen shows title, wobbling mugs, high score, blinking prompt**

- [ ] **Step 3: Commit**

```bash
git add js/scenes/MenuScene.js
git commit -m "feat: implement MenuScene with title, idle animation, and start prompt"
```

---

### Task 5: HoochBalance — Balance & Spill Mechanic

**Files:**
- Modify: `js/objects/HoochBalance.js`

- [ ] **Step 1: Implement the HoochBalance class**

This is a pure data model (no Phaser sprites). It tracks balance value, spill meter, and responds to input + game events.

Replace the entire contents of `js/objects/HoochBalance.js`:

```js
class HoochBalance {
    constructor() {
        this.value = 0;          // -100 to +100
        this.spillMeter = 0;     // 0 to 100
        this.driftDirection = 1; // randomly flips
        this.driftTimer = 0;
        this.speedMultiplier = 1;
    }

    reset() {
        this.value = 0;
        this.spillMeter = 0;
        this.driftDirection = 1;
        this.driftTimer = 0;
        this.speedMultiplier = 1;
    }

    update(delta, cursors) {
        const dt = delta / 1000;

        // Player input: arrow keys tilt the hooch
        if (cursors.left.isDown) {
            this.value -= CONSTANTS.BALANCE_INPUT_FORCE * this.speedMultiplier;
        }
        if (cursors.right.isDown) {
            this.value += CONSTANTS.BALANCE_INPUT_FORCE * this.speedMultiplier;
        }

        // Natural drift/wobble
        this.driftTimer += dt;
        if (this.driftTimer > 0.5 + Math.random() * 1.0) {
            this.driftDirection = Math.random() > 0.5 ? 1 : -1;
            this.driftTimer = 0;
        }
        this.value += this.driftDirection * CONSTANTS.BALANCE_DRIFT_RATE * this.speedMultiplier;

        // Clamp balance
        this.value = Phaser.Math.Clamp(this.value, -100, 100);

        // Spill meter
        const absBalance = Math.abs(this.value);
        if (absBalance > CONSTANTS.BALANCE_SPILL_THRESHOLD) {
            const overflow = absBalance - CONSTANTS.BALANCE_SPILL_THRESHOLD;
            const fillRate = CONSTANTS.SPILL_FILL_RATE * (overflow / 30) * this.speedMultiplier;
            this.spillMeter += fillRate;
        } else {
            this.spillMeter -= CONSTANTS.SPILL_DRAIN_RATE;
        }
        this.spillMeter = Phaser.Math.Clamp(this.spillMeter, 0, 100);
    }

    applyJumpWobble() {
        const wobble = (Math.random() - 0.5) * 2 * CONSTANTS.BALANCE_JUMP_WOBBLE * this.speedMultiplier;
        this.value = Phaser.Math.Clamp(this.value + wobble, -100, 100);
    }

    applyLandWobble() {
        const wobble = (Math.random() - 0.5) * 2 * CONSTANTS.BALANCE_JUMP_WOBBLE * 0.7 * this.speedMultiplier;
        this.value = Phaser.Math.Clamp(this.value + wobble, -100, 100);
    }

    isSpilled() {
        return this.spillMeter >= 100;
    }

    isInDanger() {
        return this.spillMeter > 80;
    }

    setSpeedMultiplier(currentSpeed) {
        this.speedMultiplier = 0.8 + (currentSpeed / CONSTANTS.MAX_SPEED) * 0.7;
    }

    getTiltAngle() {
        return (this.value / 100) * 25; // max 25 degree tilt
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/objects/HoochBalance.js
git commit -m "feat: implement HoochBalance model with drift, input, spill meter"
```

---

### Task 6: Gurgles — Player Character

**Files:**
- Modify: `js/objects/Gurgles.js`

- [ ] **Step 1: Implement the Gurgles class**

Gurgles is a Phaser container with the gnome sprite, two mug sprites, and manages jumping. Mugs tilt based on HoochBalance value.

Replace the entire contents of `js/objects/Gurgles.js`:

```js
class Gurgles {
    constructor(scene, x, y) {
        this.scene = scene;

        // Main sprite
        this.sprite = scene.physics.add.sprite(x, y, 'gurgles');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setGravityY(0); // Uses scene gravity

        // Mugs as child images (positioned relative to Gurgles)
        this.mugLeft = scene.add.image(x - 38, y - 10, 'mug');
        this.mugRight = scene.add.image(x + 38, y - 10, 'mug').setFlipX(true);

        this.isJumping = false;
        this.groundY = y;
    }

    update(hoochBalance) {
        // Update mug positions to follow Gurgles
        const x = this.sprite.x;
        const y = this.sprite.y;
        this.mugLeft.setPosition(x - 38, y - 10);
        this.mugRight.setPosition(x + 38, y - 10);

        // Tilt mugs based on balance
        const tilt = hoochBalance.getTiltAngle();
        this.mugLeft.setAngle(-tilt);
        this.mugRight.setAngle(-tilt);

        // Switch texture based on jump state
        if (this.sprite.body.touching.down || this.sprite.body.blocked.down) {
            if (this.isJumping) {
                this.isJumping = false;
                this.sprite.setTexture('gurgles');
                hoochBalance.applyLandWobble();
            }
        }
    }

    jump(hoochBalance) {
        if (this.sprite.body.touching.down || this.sprite.body.blocked.down) {
            this.sprite.setVelocityY(CONSTANTS.JUMP_VELOCITY);
            this.sprite.setTexture('gurgles-jump');
            this.isJumping = true;
            hoochBalance.applyJumpWobble();
        }
    }

    getSprite() {
        return this.sprite;
    }

    getMugs() {
        return [this.mugLeft, this.mugRight];
    }

    destroy() {
        this.sprite.destroy();
        this.mugLeft.destroy();
        this.mugRight.destroy();
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/objects/Gurgles.js
git commit -m "feat: implement Gurgles player with jump, mug tilt, and texture swap"
```

---

### Task 7: ObstacleManager — Obstacle Spawning & Pooling

**Files:**
- Modify: `js/objects/ObstacleManager.js`

- [ ] **Step 1: Implement ObstacleManager**

Uses a Phaser physics group as an object pool. Spawns obstacles at timed intervals that decrease with game speed. Each obstacle scrolls left and is recycled when off-screen.

Replace the entire contents of `js/objects/ObstacleManager.js`:

```js
class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.physics.add.group({
            allowGravity: false,
        });
        this.obstacleTypes = ['root', 'rock', 'mushroom', 'log'];
        this.spawnTimer = 0;
        this.spawnInterval = 2000; // ms, decreases with speed
        this.lastSpawnX = 0;
    }

    update(delta, currentSpeed) {
        this.spawnTimer += delta;

        // Adjust spawn interval based on speed
        this.spawnInterval = Math.max(
            800,
            2000 - (currentSpeed - CONSTANTS.INITIAL_SPEED) * 2
        );

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawn(currentSpeed);
            this.spawnTimer = 0;
        }

        // Move all obstacles left and recycle off-screen ones
        this.group.getChildren().forEach((obstacle) => {
            obstacle.x -= currentSpeed * (delta / 1000);
            if (obstacle.x < -100) {
                obstacle.setActive(false).setVisible(false);
                obstacle.body.enable = false;
            }
        });
    }

    spawn(currentSpeed) {
        // Pick random obstacle type
        const type = Phaser.Utils.Array.GetRandom(this.obstacleTypes);

        // Try to reuse an inactive obstacle
        let obstacle = this.group.getFirstDead(false);

        if (obstacle) {
            obstacle.setTexture(type);
            obstacle.setActive(true).setVisible(true);
            obstacle.body.enable = true;
        } else {
            obstacle = this.group.create(0, 0, type);
            obstacle.body.allowGravity = false;
        }

        obstacle.setPosition(GAME_WIDTH + 50, GROUND_Y - obstacle.displayHeight / 2);
        obstacle.body.setImmovable(true);
        obstacle.body.setSize(obstacle.displayWidth * 0.8, obstacle.displayHeight * 0.8);
    }

    getGroup() {
        return this.group;
    }

    reset() {
        this.group.getChildren().forEach((obstacle) => {
            obstacle.setActive(false).setVisible(false);
            obstacle.body.enable = false;
        });
        this.spawnTimer = 0;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/objects/ObstacleManager.js
git commit -m "feat: implement ObstacleManager with spawning, pooling, and speed scaling"
```

---

### Task 8: CollectibleManager — Collectible Spawning & Pooling

**Files:**
- Modify: `js/objects/CollectibleManager.js`

- [ ] **Step 1: Implement CollectibleManager**

Similar pattern to ObstacleManager but collectibles spawn at varying heights. Overlap (not collide) triggers collection.

Replace the entire contents of `js/objects/CollectibleManager.js`:

```js
class CollectibleManager {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.physics.add.group({
            allowGravity: false,
        });
        this.collectibleTypes = ['herb', 'hops', 'potion'];
        this.spawnTimer = 0;
        this.spawnInterval = 3000;
        this.collected = 0;
    }

    update(delta, currentSpeed) {
        this.spawnTimer += delta;

        this.spawnInterval = Math.max(
            1500,
            3000 - (currentSpeed - CONSTANTS.INITIAL_SPEED) * 1.5
        );

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawn(currentSpeed);
            this.spawnTimer = 0;
        }

        // Move all collectibles left and recycle off-screen ones
        this.group.getChildren().forEach((item) => {
            item.x -= currentSpeed * (delta / 1000);
            if (item.x < -50) {
                item.setActive(false).setVisible(false);
                item.body.enable = false;
            }
        });
    }

    spawn(currentSpeed) {
        const type = Phaser.Utils.Array.GetRandom(this.collectibleTypes);

        let item = this.group.getFirstDead(false);

        if (item) {
            item.setTexture(type);
            item.setActive(true).setVisible(true);
            item.body.enable = true;
        } else {
            item = this.group.create(0, 0, type);
            item.body.allowGravity = false;
        }

        // Varying heights: some low (easy grab), some high (need to jump)
        const minY = GROUND_Y - 120;
        const maxY = GROUND_Y - 30;
        const y = Phaser.Math.Between(minY, maxY);

        item.setPosition(GAME_WIDTH + 50, y);
        item.body.setSize(item.displayWidth, item.displayHeight);

        // Gentle float animation
        this.scene.tweens.add({
            targets: item,
            y: y - 8,
            duration: 500 + Math.random() * 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    collect(item) {
        item.setActive(false).setVisible(false);
        item.body.enable = false;
        this.scene.tweens.killTweensOf(item);
        this.collected++;
        return CONSTANTS.COLLECTIBLE_BONUS;
    }

    getGroup() {
        return this.group;
    }

    getCollectedCount() {
        return this.collected;
    }

    reset() {
        this.group.getChildren().forEach((item) => {
            item.setActive(false).setVisible(false);
            item.body.enable = false;
            this.scene.tweens.killTweensOf(item);
        });
        this.spawnTimer = 0;
        this.collected = 0;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/objects/CollectibleManager.js
git commit -m "feat: implement CollectibleManager with spawning, pooling, and collection"
```

---

### Task 9: GameScene — Main Gameplay Loop

**Files:**
- Modify: `js/scenes/GameScene.js`

- [ ] **Step 1: Implement GameScene**

This is the core scene. It creates the parallax backgrounds, Gurgles, obstacle/collectible managers, HUD elements, handles input, and runs the game loop.

Replace the entire contents of `js/scenes/GameScene.js`:

```js
class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.currentSpeed = CONSTANTS.INITIAL_SPEED;
        this.score = 0;
        this.gameOver = false;
        this.deathCause = '';

        // Parallax backgrounds (two copies each for seamless scrolling)
        this.bgMountains1 = this.add.image(0, 0, 'bg-mountains').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        this.bgMountains2 = this.add.image(GAME_WIDTH, 0, 'bg-mountains').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        this.bgTrees1 = this.add.image(0, 0, 'bg-trees').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        this.bgTrees2 = this.add.image(GAME_WIDTH, 0, 'bg-trees').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        this.bgGround1 = this.add.image(0, GROUND_Y, 'bg-ground').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
        this.bgGround2 = this.add.image(GAME_WIDTH, GROUND_Y, 'bg-ground').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

        // Ground physics body (invisible platform)
        this.ground = this.physics.add.staticBody(0, GROUND_Y, GAME_WIDTH, 20);

        // Player
        this.hoochBalance = new HoochBalance();
        this.gurgles = new Gurgles(this, 150, GROUND_Y - 40);
        this.physics.add.collider(this.gurgles.getSprite(), this.ground);

        // Managers
        this.obstacleManager = new ObstacleManager(this);
        this.collectibleManager = new CollectibleManager(this);

        // Collisions
        this.physics.add.collider(
            this.gurgles.getSprite(),
            this.obstacleManager.getGroup(),
            this.hitObstacle,
            null,
            this
        );

        this.physics.add.overlap(
            this.gurgles.getSprite(),
            this.collectibleManager.getGroup(),
            this.collectItem,
            null,
            this
        );

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Speed ramp timer
        this.speedTimer = this.time.addEvent({
            delay: CONSTANTS.SPEED_RAMP_INTERVAL,
            callback: this.increaseSpeed,
            callbackScope: this,
            loop: true,
        });

        // HUD
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Arial, sans-serif',
            stroke: '#000',
            strokeThickness: 3,
        }).setScrollFactor(0).setDepth(100);

        // Spill meter background
        this.spillBarBg = this.add.rectangle(GAME_WIDTH - 170, 24, 154, 22, 0x444444)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(100);
        this.spillBarBorder = this.add.rectangle(GAME_WIDTH - 170, 24, 154, 22)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(100).setStrokeStyle(2, 0xffffff);
        this.spillBar = this.add.rectangle(GAME_WIDTH - 168, 24, 0, 18, 0xD4A017)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(100);
        this.spillLabel = this.add.text(GAME_WIDTH - 170, 44, 'HOOCH', {
            fontSize: '12px',
            fill: '#bdc3c7',
            fontFamily: 'Arial, sans-serif',
        }).setScrollFactor(0).setDepth(100);

        // Balance indicator (small arc near Gurgles)
        this.balanceIndicator = this.add.graphics().setDepth(50);
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Parallax scrolling
        const mountainSpeed = this.currentSpeed * 0.1;
        const treeSpeed = this.currentSpeed * 0.4;
        const groundSpeed = this.currentSpeed;

        this.scrollBackground(this.bgMountains1, this.bgMountains2, mountainSpeed, delta);
        this.scrollBackground(this.bgTrees1, this.bgTrees2, treeSpeed, delta);
        this.scrollBackground(this.bgGround1, this.bgGround2, groundSpeed, delta);

        // Input: jump
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.gurgles.jump(this.hoochBalance);
        }

        // Update balance
        this.hoochBalance.setSpeedMultiplier(this.currentSpeed);
        this.hoochBalance.update(delta, this.cursors);

        // Update player
        this.gurgles.update(this.hoochBalance);

        // Update managers
        this.obstacleManager.update(delta, this.currentSpeed);
        this.collectibleManager.update(delta, this.currentSpeed);

        // Score
        this.score += this.currentSpeed * (delta / 1000) * 0.1;
        this.scoreText.setText('Score: ' + Math.floor(this.score));

        // Update spill meter HUD
        const spillWidth = (this.hoochBalance.spillMeter / 100) * 150;
        this.spillBar.width = spillWidth;
        if (this.hoochBalance.isInDanger()) {
            this.spillBar.setFillStyle(0xe74c3c);
        } else {
            this.spillBar.setFillStyle(0xD4A017);
        }

        // Balance indicator
        this.updateBalanceIndicator();

        // Splash particles when spilling
        if (Math.abs(this.hoochBalance.value) > CONSTANTS.BALANCE_SPILL_THRESHOLD) {
            if (Math.random() < 0.3) {
                const side = this.hoochBalance.value > 0 ? 1 : -1;
                const mugX = this.gurgles.getSprite().x + side * 38;
                const mugY = this.gurgles.getSprite().y - 15;
                const drop = this.add.circle(
                    mugX + Math.random() * 6 - 3,
                    mugY,
                    2 + Math.random() * 2,
                    0xD4A017,
                    0.8
                );
                this.tweens.add({
                    targets: drop,
                    y: drop.y + 30 + Math.random() * 20,
                    alpha: 0,
                    duration: 400 + Math.random() * 200,
                    onComplete: () => drop.destroy(),
                });
            }
        }

        // Check spill game over
        if (this.hoochBalance.isSpilled()) {
            this.deathCause = 'spill';
            this.endGame();
        }
    }

    scrollBackground(bg1, bg2, speed, delta) {
        const move = speed * (delta / 1000);
        bg1.x -= move;
        bg2.x -= move;

        if (bg1.x <= -GAME_WIDTH) {
            bg1.x = bg2.x + GAME_WIDTH;
        }
        if (bg2.x <= -GAME_WIDTH) {
            bg2.x = bg1.x + GAME_WIDTH;
        }
    }

    updateBalanceIndicator() {
        this.balanceIndicator.clear();
        const x = this.gurgles.getSprite().x;
        const y = this.gurgles.getSprite().y + 45;
        const balance = this.hoochBalance.value;

        // Draw a small arc indicator
        const color = Math.abs(balance) > CONSTANTS.BALANCE_SPILL_THRESHOLD ? 0xe74c3c : 0x2ecc71;
        this.balanceIndicator.fillStyle(color, 0.7);
        const indicatorX = x + (balance / 100) * 25;
        this.balanceIndicator.fillCircle(indicatorX, y, 4);

        // Center marker
        this.balanceIndicator.fillStyle(0xffffff, 0.3);
        this.balanceIndicator.fillCircle(x, y, 2);
    }

    increaseSpeed() {
        if (this.currentSpeed < CONSTANTS.MAX_SPEED) {
            this.currentSpeed = Math.min(
                this.currentSpeed + CONSTANTS.SPEED_INCREMENT,
                CONSTANTS.MAX_SPEED
            );
        }
    }

    hitObstacle(gurglesSprite, obstacle) {
        this.deathCause = 'obstacle';
        this.endGame();
    }

    collectItem(gurglesSprite, item) {
        if (!item.active) return;
        const bonus = this.collectibleManager.collect(item);
        this.score += bonus;

        // Sparkle effect
        const sparkle = this.add.circle(item.x, item.y, 12, 0xF1C40F, 0.8);
        this.tweens.add({
            targets: sparkle,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => sparkle.destroy(),
        });
    }

    endGame() {
        this.gameOver = true;
        this.physics.pause();
        this.speedTimer.remove();

        // Screen shake for obstacle death
        if (this.deathCause === 'obstacle') {
            this.cameras.main.shake(300, 0.02);
        }

        // Save high score
        const highScore = localStorage.getItem('holdthehooch_highscore') || 0;
        const finalScore = Math.floor(this.score);
        if (finalScore > highScore) {
            localStorage.setItem('holdthehooch_highscore', finalScore);
        }

        // Transition to game over after brief delay
        this.time.delayedCall(800, () => {
            this.scene.start('GameOver', {
                score: finalScore,
                highScore: Math.max(finalScore, parseInt(highScore)),
                distance: finalScore,
                herbs: this.collectibleManager.getCollectedCount(),
                cause: this.deathCause,
            });
        });
    }
}
```

- [ ] **Step 2: Open in browser, press space on menu, verify Gurgles appears, can jump, obstacles spawn, hooch tilts with arrow keys**

- [ ] **Step 3: Commit**

```bash
git add js/scenes/GameScene.js
git commit -m "feat: implement GameScene with full gameplay loop, HUD, and parallax"
```

---

### Task 10: GameOverScene — Death & Restart

**Files:**
- Modify: `js/scenes/GameOverScene.js`

- [ ] **Step 1: Implement GameOverScene**

Replace the entire contents of `js/scenes/GameOverScene.js`:

```js
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create(data) {
        const { score, highScore, distance, herbs, cause } = data;

        // Darken background
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);

        // Death message
        const deathMsg = cause === 'spill' ? 'Hooch Spilled!' : 'Ouch!';
        const deathColor = cause === 'spill' ? '#D4A017' : '#e74c3c';

        this.add.text(GAME_WIDTH / 2, 140, deathMsg, {
            fontSize: '48px',
            fill: deathColor,
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Score
        this.add.text(GAME_WIDTH / 2, 230, `Score: ${score}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        // High score
        const isNewHigh = score >= highScore && score > 0;
        const highScoreText = isNewHigh ? `NEW High Score: ${highScore}` : `High Score: ${highScore}`;
        const highScoreColor = isNewHigh ? '#F1C40F' : '#bdc3c7';

        this.add.text(GAME_WIDTH / 2, 280, highScoreText, {
            fontSize: '22px',
            fill: highScoreColor,
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        // Stats
        this.add.text(GAME_WIDTH / 2, 340, `Distance: ${distance}m`, {
            fontSize: '18px',
            fill: '#ecf0f1',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 370, `Herbs Collected: ${herbs}`, {
            fontSize: '18px',
            fill: '#2ecc71',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        // Restart prompt (blinking)
        const restartText = this.add.text(GAME_WIDTH / 2, 460, 'Press SPACE to Try Again', {
            fontSize: '24px',
            fill: '#F1C40F',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartText,
            alpha: { from: 1, to: 0.3 },
            duration: 600,
            yoyo: true,
            repeat: -1,
        });

        // Slight delay before accepting input (prevent accidental restart)
        this.time.delayedCall(500, () => {
            this.input.keyboard.once('keydown-SPACE', () => {
                this.scene.start('Game');
            });
        });
    }
}
```

- [ ] **Step 2: Play a game, die (hit obstacle or let hooch spill), verify game over screen shows correct stats and can restart**

- [ ] **Step 3: Commit**

```bash
git add js/scenes/GameOverScene.js
git commit -m "feat: implement GameOverScene with death cause, stats, and restart"
```

---

### Task 11: GitHub Repo + Pages Deployment

**Files:**
- No new files

- [ ] **Step 1: Create GitHub repository**

```bash
cd /c/apps/holdthehooch
gh repo create holdthehooch --public --source=. --push
```

This creates the repo, sets the remote, and pushes all commits.

- [ ] **Step 2: Enable GitHub Pages**

```bash
gh api repos/{owner}/holdthehooch/pages -X POST -f source.branch=main -f source.path=/
```

If the `gh api` approach fails (GitHub Pages API can be finicky), enable it manually: repo Settings → Pages → Source: Deploy from branch → Branch: main, folder: / (root).

- [ ] **Step 3: Verify the site is live**

Visit `https://{username}.github.io/holdthehooch/` after a minute or two. The game should load and be playable.

- [ ] **Step 4: Commit any final tweaks**

If any paths needed adjusting for GitHub Pages, commit those fixes:

```bash
git add -A
git commit -m "fix: adjust paths for GitHub Pages deployment"
git push
```

---

### Task 12: Playtesting & Polish Pass

**Files:**
- Modify: `js/config.js` (tuning constants)
- Modify: any files needing fixes

- [ ] **Step 1: Play the game end-to-end multiple times, note issues**

Test these scenarios:
- Jump over obstacles cleanly
- Let hooch spill to trigger spill game over
- Hit an obstacle to trigger obstacle game over
- Collect herbs at different heights
- Let speed ramp up and verify difficulty increase
- Check high score saves and displays across refreshes
- Arrow keys balance the hooch responsively
- Parallax backgrounds scroll smoothly without gaps

- [ ] **Step 2: Tune game constants in `js/config.js`**

Adjust any of these values based on playtesting feel:
- `JUMP_VELOCITY` — does the jump feel right?
- `BALANCE_DRIFT_RATE` / `BALANCE_INPUT_FORCE` — is balancing too hard or too easy?
- `BALANCE_JUMP_WOBBLE` — does jumping disrupt balance a satisfying amount?
- `SPILL_FILL_RATE` / `SPILL_DRAIN_RATE` — is the spill meter forgiving enough at the start?
- `OBSTACLE_MIN_GAP` — are obstacles fairly spaced?
- `INITIAL_SPEED` / `MAX_SPEED` — does the speed curve feel right?

- [ ] **Step 3: Fix any bugs found during playtesting**

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "fix: gameplay tuning and polish from playtesting"
git push
```
