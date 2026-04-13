# Hold the Hooch -- Game Design Spec

## Overview

**Hold the Hooch** is a browser-based endless runner built with Phaser 3. The player controls Gurgles the Druid Brewer Gnome as he sprints through a forest, jumping over obstacles while actively balancing mugs of hooch on his outstretched arms.

- **Genre**: Endless runner (Chrome Dino game style)
- **Engine**: Phaser 3 via CDN (no build step)
- **Input**: Spacebar/tap to jump, left/right arrow keys to balance hooch
- **Hosting**: GitHub Pages (static files, no server needed). VPS fallback available.
- **Visual style**: Flat/minimal SVG. Placeholder graphics for Gurgles, swappable with real art later.

## Game Mechanics

### Movement & Jumping

- Gurgles is positioned on the left third of the screen; the world scrolls right-to-left.
- World scroll speed gradually increases over time, capping at a defined maximum.
- Spacebar or tap triggers a jump with a fixed arc. Phaser arcade physics handles gravity.
- Single jump only -- no double jump.

### Hooch Balancing

- A balance value ranges from -100 (full left tilt) to +100 (full right tilt). Zero is perfectly centered.
- The hooch naturally drifts/wobbles as Gurgles runs (slight random perturbation each frame).
- Jumping amplifies the wobble -- the hooch lurches in a random direction on takeoff and on landing.
- Left/right arrow keys directly tilt the hooch in that direction: left arrow pushes balance toward -100, right arrow pushes toward +100. If the hooch is wobbling to the right (+), the player presses left to counteract it, and vice versa. The goal is to keep the balance near zero.
- Visual representation: the mugs on Gurgles' arms tilt based on the balance value, liquid inside sloshes accordingly.

### Spill Meter

- When the absolute balance value exceeds a threshold (approximately +/-70), hooch starts spilling and the spill meter fills.
- The further past the threshold, the faster the meter fills.
- When balance is inside the safe zone (abs < 70), the meter drains very slowly -- recovery is possible but not fast.
- Spill meter reaching 100% = game over.
- This is independent from obstacle collision, which is also instant game over.

### Obstacles

- Ground-level obstacles: tree roots, rocks, mushroom clusters, fallen logs.
- Spawned at intervals that decrease as speed increases (more frequent at higher speeds).
- A minimum gap between obstacles is enforced so the game is always fair/dodgeable.
- Collision with any obstacle = instant game over.

### Collectibles

- Floating herbs, potion ingredients, golden hops hover at varying heights above the ground.
- Some are collectible without jumping (low-hanging), others require a well-timed jump.
- Each collectible adds bonus points to the score.
- Collectibles spawn independently from obstacles, sometimes positioned above/near obstacles to create risk/reward scenarios (jump for the herb but tighter timing on the obstacle).

### Scoring

- Base score: distance traveled, ticking up continuously.
- Bonus: each collectible adds a flat point bonus.
- High score persisted to localStorage.

## Difficulty Curve

- **Scroll speed**: starts comfortable, ramps approximately every 10 seconds, caps at a defined max.
- **Wobble intensity**: increases with speed (hooch becomes harder to balance at high speed).
- **Obstacle frequency**: spawn interval decreases with speed.
- **Spill meter drain rate**: decreases slightly over time (less forgiving recovery at higher speeds).

## Scenes

1. **BootScene**: Loads all assets (placeholder SVGs, any UI graphics). Transitions to MenuScene.
2. **MenuScene**: Title screen with "Hold the Hooch" title, idle Gurgles animation (mugs wobbling gently), high score display, "Press Space to Start" prompt.
3. **GameScene**: Main gameplay loop -- running, jumping, balancing, obstacles, collectibles, HUD.
4. **GameOverScene**: Death summary -- cause of death ("Hooch Spilled!" vs "Ouch!"), final score, high score, distance, herbs collected, "Press Space to Try Again" prompt.

## UI / HUD

### During Gameplay

- **Top-left**: Score (distance + bonus, ticking up).
- **Top-right**: Spill meter -- horizontal bar that fills with amber/brown liquid. Flashes red when critical (>80%).
- **Near Gurgles**: Subtle balance indicator arc showing current tilt direction and magnitude.

### Menu Screen

- Game title in rustic/tavern-style font treatment.
- Placeholder Gurgles standing idle with gently wobbling mugs.
- High score display.
- "Press Space to Start" prompt.

### Game Over Screen

- Death cause message.
- Final score, high score, distance traveled, herbs collected.
- "Press Space to Try Again" prompt.

## Visual Design

### Style

Flat/minimal SVG aesthetic. Clean geometric shapes, bold colors. Modern indie game feel.

### Parallax Scrolling (3 layers)

1. **Far background**: Distant mountains/sky with clouds. Slowest scroll speed.
2. **Mid background**: Forest treeline silhouettes. Medium scroll speed.
3. **Foreground**: Ground plane with grass detail. Matches world scroll speed.

### Visual Feedback

- Hooch liquid in mugs animates/tilts based on balance value.
- Splash particles when spilling (balance exceeds threshold).
- Sparkle/glow effect when collecting herbs.
- Screen shake on obstacle-collision death.

### Asset Swappability

- All Gurgles graphics loaded from `assets/svg/` as Phaser textures.
- Placeholder is a simple geometric gnome shape (circle head, triangle hat, rectangle body, line arms with rectangle mugs).
- To swap: replace SVG files in `assets/svg/` with same filenames. No code changes needed.

## Technical Architecture

### Stack

- **Phaser 3** loaded via CDN (`<script>` tag).
- **No bundler, no npm, no build step.** Plain HTML + JS + CSS.
- Arcade physics (lightweight, sufficient for side-scroller).
- Canvas renderer with automatic WebGL fallback.

### File Structure

```
holdthehooch/
├── index.html              # Entry point, loads Phaser CDN + game scripts
├── css/
│   └── style.css           # Minimal HTML wrapper styling
├── js/
│   ├── config.js           # Phaser game config + constants
│   ├── scenes/
│   │   ├── BootScene.js    # Asset loading
│   │   ├── MenuScene.js    # Title screen
│   │   ├── GameScene.js    # Main gameplay
│   │   └── GameOverScene.js # Death/score screen
│   └── objects/
│       ├── Gurgles.js      # Player character class
│       ├── HoochBalance.js # Balance/spill mechanic
│       ├── Obstacle.js     # Obstacle spawning + pooling
│       └── Collectible.js  # Herb/ingredient spawning + pooling
└── assets/
    └── svg/
        ├── gurgles.svg         # Placeholder gnome character
        ├── gurgles-jump.svg    # Jump pose
        ├── mug-left.svg        # Left mug
        ├── mug-right.svg       # Right mug
        ├── root.svg            # Tree root obstacle
        ├── rock.svg            # Rock obstacle
        ├── mushroom.svg        # Mushroom cluster obstacle
        ├── log.svg             # Fallen log obstacle
        ├── herb.svg            # Herb collectible
        ├── hops.svg            # Golden hops collectible
        ├── potion.svg          # Potion ingredient collectible
        ├── bg-mountains.svg    # Far parallax layer
        ├── bg-trees.svg        # Mid parallax layer
        └── bg-ground.svg       # Foreground ground
```

### Performance

- **Object pooling**: Obstacles and collectibles are recycled when they scroll off-screen, not created/destroyed.
- **Target**: 60fps on modern browsers.
- **Responsive**: Fixed game height (~600px), width scales to viewport.

### Deployment

- GitHub Pages serving from `main` branch root directory.
- Push to `main` = deploy. No CI/CD needed.
- VPS available as fallback if GitHub Pages presents any limitations.

## Out of Scope (for now)

- Sound effects / music
- Mobile touch controls (beyond basic tap-to-jump)
- Leaderboard / online scores
- Multiple characters or skins
- Power-ups
