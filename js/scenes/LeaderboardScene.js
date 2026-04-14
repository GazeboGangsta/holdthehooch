class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super('Leaderboard');
    }

    create(data) {
        this.from = (data && data.from) || 'Menu';

        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg-mountains').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55);

        this.add.text(GAME_WIDTH / 2, 50, 'Leaderboard', {
            fontSize: '42px',
            fill: '#F1C40F',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 5,
        }).setOrigin(0.5);

        // Column headers
        this.add.text(60, 110, 'RANK', this.headerStyle()).setOrigin(0, 0.5);
        this.add.text(130, 110, 'NAME', this.headerStyle()).setOrigin(0, 0.5);
        this.add.text(500, 110, 'SCORE', this.headerStyle()).setOrigin(1, 0.5);
        this.add.text(680, 110, 'HERBS', this.headerStyle()).setOrigin(1, 0.5);
        this.add.line(GAME_WIDTH / 2, 125, 0, 0, GAME_WIDTH - 80, 0, 0xF1C40F, 0.6).setLineWidth(1);

        // Loading indicator
        this.statusText = this.add.text(GAME_WIDTH / 2, 300, 'Loading...', {
            fontSize: '20px',
            fill: '#bdc3c7',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5);

        this.rowGroup = this.add.group();

        this.loadScores();

        // Back prompt
        const back = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, 'Press ESC or B to go back', {
            fontSize: '18px',
            fill: '#F1C40F',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        back.on('pointerdown', () => this.goBack());
        this.input.keyboard.on('keydown-ESC', () => this.goBack());
        this.input.keyboard.on('keydown-B', () => this.goBack());
    }

    headerStyle() {
        return {
            fontSize: '16px',
            fill: '#F1C40F',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
        };
    }

    rowStyle(rank) {
        let color = '#ecf0f1';
        if (rank === 1) color = '#FFD700';
        else if (rank === 2) color = '#C0C0C0';
        else if (rank === 3) color = '#CD7F32';
        return {
            fontSize: '17px',
            fill: color,
            fontFamily: 'Arial, sans-serif',
        };
    }

    async loadScores() {
        try {
            const res = await fetch('/api/scores/top?limit=20');
            if (!res.ok) throw new Error('fetch failed');
            const data = await res.json();
            this.statusText.setText('');
            this.renderScores(data.scores || []);
        } catch (e) {
            this.statusText.setText('Could not load leaderboard');
            this.statusText.setColor('#e74c3c');
        }
    }

    renderScores(scores) {
        if (scores.length === 0) {
            this.statusText.setText('No scores yet -- be the first!');
            return;
        }

        const startY = 150;
        const rowHeight = 22;

        scores.forEach((row, i) => {
            const rank = i + 1;
            const y = startY + i * rowHeight;
            const style = this.rowStyle(rank);

            this.rowGroup.add(this.add.text(60, y, `${rank}.`, style).setOrigin(0, 0.5));
            this.rowGroup.add(this.add.text(130, y, row.name, style).setOrigin(0, 0.5));
            this.rowGroup.add(this.add.text(500, y, String(row.score), style).setOrigin(1, 0.5));
            this.rowGroup.add(this.add.text(680, y, String(row.herbs), style).setOrigin(1, 0.5));
        });
    }

    goBack() {
        this.scene.start(this.from === 'GameOver' ? 'Menu' : 'Menu');
    }
}
