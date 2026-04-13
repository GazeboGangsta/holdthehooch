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
