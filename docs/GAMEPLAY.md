# Hold the Hooch -- Game Mechanics Deep Dive

## Core Loop

```
Run -> Obstacles appear -> Jump to dodge -> Hooch wobbles -> Balance it -> Repeat (faster)
                                              |
                                    Collect herbs for bonus points
```

## Controls

| Input | Effect |
|-------|--------|
| Spacebar / Tap | Jump (fixed arc, no double jump) |
| Left Arrow | Push hooch balance toward left (-) |
| Right Arrow | Push hooch balance toward right (+) |

## Mechanics

### 1. Running

Gurgles runs automatically. The world scrolls right-to-left. You cannot stop, slow down, or speed up manually.

- **Starting speed**: 200 units/sec
- **Speed increase**: +5 units every 10 seconds
- **Maximum speed**: 600 units/sec
- Time to reach max speed: ~13 minutes of play

### 2. Jumping

- Press Space to jump. Gurgles follows a fixed parabolic arc.
- You can only jump when on the ground (no double jump, no air control).
- The jump height/arc is always the same regardless of game speed.
- **Jump disturbs the hooch**: on takeoff, the balance lurches randomly. On landing, it lurches again (slightly less).

### 3. Hooch Balance System

The hooch sits above Gurgles' head. It has a **balance value** from -100 (full left tilt) to +100 (full right tilt). Zero is perfectly centered.

**What moves the balance:**

| Source | Effect |
|--------|--------|
| Natural drift | Slow random wobble while running (changes direction every 0.5-1.5 sec) |
| Arrow keys | Direct tilt input -- left arrow pushes negative, right arrow pushes positive |
| Jump takeoff | Random lurch of up to +/-15 (scaled by speed) |
| Jump landing | Random lurch of up to +/-10.5 (scaled by speed) |
| Speed multiplier | All wobble effects scale from 0.8x at starting speed to 1.5x at max speed |

**Visual feedback:**
- The hooch sprite tilts up to 25 degrees based on balance value
- The hooch also slides horizontally (up to 20px from center)
- A small balance indicator dot appears below Gurgles (green = safe, red = danger)

### 4. Spill Meter

The spill meter tracks how much hooch has been lost. It fills when the balance is in the danger zone and drains when in the safe zone.

| Balance (absolute) | Effect |
|---------------------|--------|
| 0 to 70 | **Safe zone** -- spill meter drains at 0.1/frame |
| 70 to 100 | **Spill zone** -- meter fills proportionally to how far past 70 |

- Fill rate formula: `0.5 * ((abs_balance - 70) / 30) * speed_multiplier`
- At balance = 100 (max tilt), fill rate is ~0.5 per frame at starting speed
- Spill meter at 100% = **game over**
- Visual: amber bar in top-right, turns red when meter > 80%
- Splash particles appear on the tilted side when in spill zone

### 5. Obstacles

Ground-level objects that Gurgles must jump over.

| Obstacle | Size (px) | Notes |
|----------|-----------|-------|
| Tree root | 48 x 32 | Medium width, medium height |
| Rock | 44 x 32 | Compact, medium height |
| Mushroom cluster | 48 x 40 | Tallest obstacle |
| Fallen log | 64 x 28 | Widest but shortest |

- **Spawn interval**: starts at 2000ms, decreases to minimum 800ms as speed increases
- **Collision box**: 80% of visual size (slight forgiveness)
- **Collision = instant game over** (no health, no second chances)

### 6. Collectibles

Floating items at varying heights above the ground.

| Collectible | Size (px) | Points |
|-------------|-----------|--------|
| Herb | 24 x 28 | 50 |
| Golden hops | 24 x 28 | 50 |
| Potion | 20 x 28 | 50 |

- Spawn at heights between 30px and 120px above ground
- **Low collectibles**: grabbable without jumping
- **High collectibles**: require a jump -- risk/reward trade-off (jumping wobbles the hooch)
- Spawn interval: starts at 3000ms, decreases to 1500ms minimum
- Gentle floating animation (bobbing up and down 8px)
- Sparkle effect on collection

### 7. Scoring

```
Final Score = Distance Score + Collectible Bonuses
```

- **Distance**: `speed * time * 0.1` (continuously ticking)
- **Collectible bonus**: +50 per item collected
- **High score**: saved to browser localStorage, persists across sessions

## Difficulty Curve

| Time | Speed | Wobble | Obstacle Gap | Feel |
|------|-------|--------|-------------|------|
| 0:00 | 200 | Gentle | 2.0 sec | Tutorial-easy |
| 1:00 | 230 | Mild | 1.7 sec | Comfortable |
| 3:00 | 290 | Moderate | 1.2 sec | Challenging |
| 5:00 | 350 | Strong | 1.0 sec | Hard |
| 8:00 | 440 | Intense | 0.8 sec | Very hard |
| 13:00+ | 600 (max) | Maximum | 0.8 sec | Survival mode |

## Death Conditions

1. **Obstacle collision**: "Ouch!" -- screen shake, immediate game over
2. **Hooch spill**: "Hooch Spilled!" -- spill meter reached 100%, game over

## Game Over Screen

Shows:
- Cause of death
- Final score
- High score (highlighted if new record)
- Distance traveled
- Herbs collected
- Press Space to restart (500ms input delay to prevent accidental restart)

## Scenes

1. **Boot** -- Loading bar, preloads all SVG assets
2. **Menu** -- Title, wobbling hooch animation, high score, "Press Space to Start"
3. **Game** -- Main gameplay with parallax backgrounds, HUD, all mechanics
4. **Game Over** -- Stats summary, restart prompt

## Parallax Background

Three layers scroll at different speeds for depth:

| Layer | Scroll Rate | Content |
|-------|------------|---------|
| Far (mountains) | 10% of game speed | Sky, mountains, clouds |
| Mid (trees) | 40% of game speed | Forest treeline |
| Foreground (ground) | 100% of game speed | Grass and dirt |
