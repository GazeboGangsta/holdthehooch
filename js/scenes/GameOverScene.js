class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create(data) {
        const { score, highScore, distance, herbs, cause, playerName } = data;
        this.playerName = playerName || localStorage.getItem('holdthehooch_name') || 'Anon';

        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);

        const deathMsg = cause === 'spill' ? 'Hooch Spilled!' : 'Ouch!';
        const deathColor = cause === 'spill' ? '#D4A017' : '#e74c3c';

        this.add.text(GAME_WIDTH / 2, 100, deathMsg, {
            fontSize: '48px',
            fill: deathColor,
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 160, this.playerName, {
            fontSize: '22px',
            fill: '#F1C40F',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'italic',
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 210, `Score: ${score}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        const isNewHigh = score >= highScore && score > 0;
        const highScoreText = isNewHigh ? `NEW High Score: ${highScore}` : `High Score: ${highScore}`;
        const highScoreColor = isNewHigh ? '#F1C40F' : '#bdc3c7';

        this.add.text(GAME_WIDTH / 2, 260, highScoreText, {
            fontSize: '22px',
            fill: highScoreColor,
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 310, `Distance: ${distance}m`, {
            fontSize: '18px',
            fill: '#ecf0f1',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 340, `Herbs Collected: ${herbs}`, {
            fontSize: '18px',
            fill: '#2ecc71',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        this.submitStatus = this.add.text(GAME_WIDTH / 2, 380, 'Submitting score...', {
            fontSize: '14px',
            fill: '#7f8c8d',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        this.submitScore(score, distance, herbs, cause);

        const restartText = this.add.text(GAME_WIDTH / 2, 440, 'Press SPACE to Try Again', {
            fontSize: '22px',
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

        const lbText = this.add.text(GAME_WIDTH / 2, 490, '[ L ] View Leaderboard', {
            fontSize: '20px',
            fill: '#2ecc71',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        lbText.on('pointerdown', () => this.scene.start('Leaderboard', { from: 'GameOver' }));

        const menuText = this.add.text(GAME_WIDTH / 2, 525, '[ M ] Back to Menu', {
            fontSize: '18px',
            fill: '#bdc3c7',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        menuText.on('pointerdown', () => this.scene.start('Menu'));

        this.time.delayedCall(500, () => {
            this.input.keyboard.once('keydown-SPACE', () => {
                this.scene.start('Game', { playerName: this.playerName });
            });
            this.input.keyboard.on('keydown-L', () => this.scene.start('Leaderboard', { from: 'GameOver' }));
            this.input.keyboard.on('keydown-M', () => this.scene.start('Menu'));
        });
    }

    async submitScore(score, distance, herbs, cause) {
        if (score <= 0) {
            this.submitStatus.setText('');
            return;
        }
        try {
            const res = await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: this.playerName,
                    score,
                    distance,
                    herbs,
                    cause,
                }),
            });
            if (res.ok) {
                this.submitStatus.setText('Score submitted');
                this.submitStatus.setColor('#2ecc71');
            } else if (res.status === 429) {
                this.submitStatus.setText('Rate limited -- try again in a moment');
                this.submitStatus.setColor('#e67e22');
            } else {
                this.submitStatus.setText('Submit failed');
                this.submitStatus.setColor('#e74c3c');
            }
        } catch (e) {
            this.submitStatus.setText('Offline -- score not submitted');
            this.submitStatus.setColor('#e67e22');
        }
    }
}
