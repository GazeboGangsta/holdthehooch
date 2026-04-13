# Hold the Hooch

An endless runner browser game starring **Gurgles the Druid Brewer Gnome**. Built with Phaser 3.

**[Play Now](https://gazebogangsta.github.io/holdthehooch/)**

![Hold the Hooch](https://img.shields.io/badge/game-Hold%20the%20Hooch-F1C40F?style=for-the-badge)

## The Story

Gurgles, a gnome druid with a passion for brewing, is sprinting through the enchanted forest carrying a giant tankard of his finest hooch above his head. The forest is treacherous -- roots, rocks, mushrooms, and fallen logs block his path. One wrong move and the hooch spills... or worse, Gurgles takes a tumble.

## How to Play

| Control | Action |
|---------|--------|
| **Spacebar** / **Tap** | Jump over obstacles |
| **Left Arrow** | Tilt hooch left (counteract rightward wobble) |
| **Right Arrow** | Tilt hooch right (counteract leftward wobble) |

### The Goal

Run as far as you can. Your score is based on distance traveled plus bonus points from collecting brewing ingredients floating in the air.

### Two Ways to Die

1. **Hit an obstacle** -- instant game over
2. **Spill the hooch** -- if the spill meter fills to 100%, game over

### Hooch Balancing

The hooch on Gurgles' head naturally wobbles as he runs. Jumping makes it worse -- the hooch lurches in a random direction on takeoff and landing. Use the arrow keys to tilt it back toward center.

- **Safe zone**: Balance within +/-70 -- no spilling
- **Danger zone**: Balance past +/-70 -- hooch starts spilling, meter fills up
- **Recovery**: When back in the safe zone, the meter drains slowly

The faster you run, the more the hooch wobbles and the harder it is to keep balanced.

### Collectibles

Grab floating herbs, golden hops, and potion ingredients for bonus points. Some are free pickups, others require a well-timed jump -- but jumping disturbs the hooch, so choose wisely.

## Difficulty

The game gets harder over time:
- **Speed increases** every 10 seconds (caps at a maximum)
- **Wobble intensity** scales with speed
- **Obstacles** spawn more frequently
- **Spill recovery** becomes slower

## Tech Stack

- **Phaser 3** (via CDN) -- game engine
- **Vanilla JS** -- no build tools, no npm
- **SVG assets** -- placeholder art, easily swappable
- **GitHub Pages** -- hosted as a static site

## Development

Just open `index.html` in a browser, or run a local server:

```bash
python -m http.server 8080
# Open http://localhost:8080
```

### Replacing Art

All game sprites are SVGs in `assets/svg/`. See [docs/ART-GUIDE.md](docs/ART-GUIDE.md) for exact specifications (dimensions, viewBox, design notes) for each asset. Drop in new SVGs with the same filenames -- no code changes needed.

## License

MIT
