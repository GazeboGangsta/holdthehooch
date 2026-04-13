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

        // Hooch above Gurgles' head, wobbling
        const hooch = this.add.image(GAME_WIDTH / 2, 260, 'hooch').setScale(2);

        this.tweens.add({
            targets: hooch,
            angle: { from: -10, to: 10 },
            x: { from: GAME_WIDTH / 2 - 12, to: GAME_WIDTH / 2 + 12 },
            duration: 900,
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
