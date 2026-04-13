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
