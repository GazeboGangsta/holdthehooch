class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        // Background
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg-mountains').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        // Title
        this.add.text(GAME_WIDTH / 2, 100, 'Hold the Hooch', {
            fontSize: '52px',
            fill: '#F1C40F',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(GAME_WIDTH / 2, 155, 'A Gurgles the Gnome Adventure', {
            fontSize: '18px',
            fill: '#bdc3c7',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
        }).setOrigin(0.5);

        // Idle Gurgles
        const gurgles = this.add.image(GAME_WIDTH / 2, 280, 'gurgles');
        gurgles.setScale(2);

        // Hooch above Gurgles' head, wobbling
        const hooch = this.add.image(GAME_WIDTH / 2, 220, 'hooch').setScale(2);

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
        this.add.text(GAME_WIDTH / 2, 360, `High Score: ${highScore}`, {
            fontSize: '22px',
            fill: '#ecf0f1',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        // Start prompt (blinking)
        const startText = this.add.text(GAME_WIDTH / 2, 500, 'Press SPACE or ENTER to Start', {
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

        // Leaderboard link
        const lbText = this.add.text(GAME_WIDTH / 2, 555, '[ L ] View Leaderboard', {
            fontSize: '18px',
            fill: '#2ecc71',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        lbText.on('pointerdown', () => this.openLeaderboard());

        // Name input overlay
        this.nameOverlay = document.getElementById('name-overlay');
        this.nameInput = document.getElementById('player-name');
        this.nameOverlay.style.display = 'flex';
        this.nameInput.value = localStorage.getItem('holdthehooch_name') || '';
        this.nameInput.focus();

        // Input handlers
        this.input.keyboard.on('keydown-SPACE', this.tryStart, this);
        this.input.keyboard.on('keydown-ENTER', this.tryStart, this);
        this.input.keyboard.on('keydown-L', () => this.openLeaderboard());

        // Also let the HTML input trigger start on Enter (browser captures keyboard focus)
        this.domEnterHandler = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.tryStart();
            }
        };
        this.nameInput.addEventListener('keydown', this.domEnterHandler);

        // Clean up on shutdown
        this.events.once('shutdown', () => this.hideOverlay());
    }

    hideOverlay() {
        if (this.nameOverlay) this.nameOverlay.style.display = 'none';
        if (this.nameInput && this.domEnterHandler) {
            this.nameInput.removeEventListener('keydown', this.domEnterHandler);
        }
    }

    getName() {
        const raw = (this.nameInput?.value || '').trim();
        return raw.slice(0, 16);
    }

    tryStart() {
        const name = this.getName();
        if (!name) {
            this.nameInput.focus();
            this.nameInput.style.borderColor = '#e74c3c';
            setTimeout(() => { this.nameInput.style.borderColor = ''; }, 800);
            return;
        }
        localStorage.setItem('holdthehooch_name', name);
        this.hideOverlay();
        this.scene.start('Game', { playerName: name });
    }

    openLeaderboard() {
        this.hideOverlay();
        this.scene.start('Leaderboard', { from: 'Menu' });
    }
}
