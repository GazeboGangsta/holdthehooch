# Hold the Hooch -- SVG Art Guide

Replacement art specs for all game assets. Drop SVG files into `assets/svg/` with the exact filenames listed below. No code changes needed.

## Style

Flat/minimal SVG. Clean geometric shapes, bold colors, modern indie game feel. The current placeholders use simple circles, rectangles, and polygons as stand-ins.

---

## Character: Gurgles the Druid Brewer Gnome

### `gurgles.svg` -- Standing / Running Pose

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/gurgles.svg` |
| **viewBox** | `0 0 64 80` |
| **Rendered size** | 64 x 80 px |
| **Anchor point** | Center (Phaser default origin 0.5, 0.5) |

**Design notes:**
- Gurgles is a small gnome with a pointy red hat, round face, bushy beard, green tunic, brown belt, brown boots
- **Arms are raised above his head** -- both hands up, holding the hooch (the hooch is a separate sprite, not part of this SVG)
- Leave space at the top of the SVG for where the arms reach up (hands at roughly y=8-10)
- Facing right (running direction)
- The bottom ~15px are legs/feet which sit on the ground line

### `gurgles-jump.svg` -- Jumping Pose

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/gurgles-jump.svg` |
| **viewBox** | `0 0 64 70` |
| **Rendered size** | 64 x 70 px |

**Design notes:**
- Same character but legs tucked up (shorter overall height)
- Arms still raised above head holding hooch position
- Slightly more dynamic/excited expression
- The game swaps to this texture when Gurgles is airborne

---

## The Hooch

### `hooch.svg` -- Big Tankard / Stein

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/hooch.svg` |
| **viewBox** | `0 0 40 36` |
| **Rendered size** | 40 x 36 px |

**Design notes:**
- A big wooden/metal tankard or stein of ale/mead
- Overflowing with foam on top
- This sprite is positioned **above Gurgles' head** and tilts left/right based on balance
- Should look like it could plausibly be held overhead with two hands
- The liquid inside should be visible (amber/gold color)
- Foam should be prominent -- it's the visual cue that hooch is sloshing

**In-game behavior:**
- Tilts up to 25 degrees left or right
- When tilting past the spill threshold (~70%), splash particles emit from the tilted side
- Moves horizontally with the tilt (up to 20px offset from center)

---

## Obstacles

All obstacles sit on the ground line. Gurgles must jump over them. Collision = instant game over.

### `root.svg` -- Tree Root

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/root.svg` |
| **viewBox** | `0 0 48 32` |
| **Rendered size** | 48 x 32 px |

Gnarled tree root poking out of the ground. Brown/dark brown tones.

### `rock.svg` -- Rock

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/rock.svg` |
| **viewBox** | `0 0 44 32` |
| **Rendered size** | 44 x 32 px |

A mossy forest rock. Grey/blue-grey tones with hints of green.

### `mushroom.svg` -- Mushroom Cluster

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/mushroom.svg` |
| **viewBox** | `0 0 48 40` |
| **Rendered size** | 48 x 40 px |

A cluster of 2-3 toadstools. Red/orange caps with white spots. Tallest is the obstacle height.

### `log.svg` -- Fallen Log

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/log.svg` |
| **viewBox** | `0 0 64 28` |
| **Rendered size** | 64 x 28 px |

A fallen tree trunk lying across the path. Brown tones, visible wood rings on the cut end. Wider but shorter than other obstacles.

---

## Collectibles

Floating items at varying heights. Gurgles collects them by touching. Sparkle effect on collection.

### `herb.svg` -- Herb Bundle

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/herb.svg` |
| **viewBox** | `0 0 24 28` |
| **Rendered size** | 24 x 28 px |

A sprig of green herbs/leaves. Druidic feel. Various shades of green.

### `hops.svg` -- Golden Hops

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/hops.svg` |
| **viewBox** | `0 0 24 28` |
| **Rendered size** | 24 x 28 px |

A golden hop flower/cone. Warm gold/amber color. Brewer's ingredient.

### `potion.svg` -- Potion Bottle

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/potion.svg` |
| **viewBox** | `0 0 20 28` |
| **Rendered size** | 20 x 28 px |

A small glass potion bottle with cork. Purple/blue liquid inside. Subtle sparkle.

---

## Backgrounds

All backgrounds scroll horizontally in a loop (two copies placed side by side). They must **tile seamlessly** -- the left edge must match the right edge.

### `bg-mountains.svg` -- Far Background (Slowest Scroll)

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/bg-mountains.svg` |
| **viewBox** | `0 0 1600 600` |
| **Rendered size** | 1600 x 600 px (displayed at 800x600) |

**Design notes:**
- Full scene: sky gradient at top (dark purple/blue to lighter blue)
- Distant mountain silhouettes in the lower half
- A few wispy clouds
- Very atmospheric, low detail -- it's the furthest layer
- Scrolls at 10% of game speed
- **Must tile seamlessly left-to-right**

### `bg-trees.svg` -- Mid Background (Medium Scroll)

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/bg-trees.svg` |
| **viewBox** | `0 0 1600 600` |
| **Rendered size** | 1600 x 600 px (displayed at 800x600) |

**Design notes:**
- Forest treeline silhouettes -- dark green trunks and round canopy shapes
- More detail than mountains but still silhouette-like
- 8-10 trees spread across the width, varying heights
- Scrolls at 40% of game speed
- **Must tile seamlessly left-to-right**

### `bg-ground.svg` -- Foreground Ground Strip (Full Speed Scroll)

| Property | Value |
|----------|-------|
| **Filename** | `assets/svg/bg-ground.svg` |
| **viewBox** | `0 0 1600 200` |
| **Rendered size** | 1600 x 200 px (displayed at 800x100) |

**Design notes:**
- The ground Gurgles runs on
- Top layer: grass (green strip with tufts)
- Below: dirt/earth (brown)
- This is the foreground -- most detailed ground texture
- Scrolls at 100% game speed
- **Must tile seamlessly left-to-right**
- The top edge (y=0) is the ground line where Gurgles stands

---

## General SVG Requirements

1. **Format:** Plain SVG (no embedded rasters, no external references)
2. **Namespace:** Must include `xmlns="http://www.w3.org/2000/svg"`
3. **viewBox:** Must match the exact values listed above -- the game loads them at specific pixel sizes
4. **Width/height attributes:** Include them matching the viewBox dimensions
5. **No animations:** The game handles all animation via code (tilting, floating, scrolling)
6. **Transparency:** Use transparent backgrounds (no background rectangle) -- the game composites layers
7. **Colors:** Bold, saturated colors. The game background is a sky blue (#87CEEB), so avoid that for character/obstacle art
8. **File size:** Keep SVGs lean -- avoid unnecessary precision in path data, minimize nested groups

## Color Palette Reference

| Element | Primary | Secondary |
|---------|---------|-----------|
| Gurgles' hat | #c0392b (red) | |
| Gurgles' skin | #f5cba7 (peach) | |
| Gurgles' tunic | #27ae60 (green) | |
| Gurgles' beard | #bdc3c7 (silver) | |
| Gurgles' boots | #5D4037 (brown) | #8B6914 (pants) |
| Hooch liquid | #D4A017 (amber) | |
| Hooch foam | #FFF9C4 (cream) | |
| Hooch tankard | #8B4513 (wood) | |
| Obstacles | #5D4037 to #8D6E63 (browns) | #78909C (rock grey) |
| Herbs | #27ae60, #2ecc71 (greens) | |
| Hops | #F1C40F, #F39C12 (golds) | |
| Potion | #3498db (blue), #9b59b6 (purple) | |
| Sky | #87CEEB | |
| Trees | #1B5E20 to #388E3C (dark greens) | |
| Ground grass | #4CAF50, #66BB6A | |
| Ground dirt | #5D4037 | |
