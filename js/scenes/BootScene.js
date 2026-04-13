class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const barBg = this.add.rectangle(width / 2, height / 2, 320, 30, 0x444444);
        const bar = this.add.rectangle(width / 2 - 150, height / 2, 0, 20, 0x27ae60);
        bar.setOrigin(0, 0.5);

        const loadingText = this.add.text(width / 2, height / 2 - 40, 'Loading...', {
            fontSize: '20px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            bar.width = 300 * value;
        });

        // Character
        this.load.svg('gurgles', 'assets/svg/gurgles.svg', { width: 64, height: 80 });
        this.load.svg('gurgles-jump', 'assets/svg/gurgles-jump.svg', { width: 64, height: 70 });
        this.load.svg('hooch', 'assets/svg/hooch.svg', { width: 40, height: 36 });

        // Obstacles
        this.load.svg('root', 'assets/svg/root.svg', { width: 48, height: 32 });
        this.load.svg('rock', 'assets/svg/rock.svg', { width: 44, height: 32 });
        this.load.svg('mushroom', 'assets/svg/mushroom.svg', { width: 48, height: 40 });
        this.load.svg('log', 'assets/svg/log.svg', { width: 64, height: 28 });

        // Collectibles
        this.load.svg('herb', 'assets/svg/herb.svg', { width: 24, height: 28 });
        this.load.svg('hops', 'assets/svg/hops.svg', { width: 24, height: 28 });
        this.load.svg('potion', 'assets/svg/potion.svg', { width: 20, height: 28 });

        // Backgrounds
        this.load.svg('bg-mountains', 'assets/svg/bg-mountains.svg', { width: 1600, height: 600 });
        this.load.svg('bg-trees', 'assets/svg/bg-trees.svg', { width: 1600, height: 600 });
        this.load.svg('bg-ground', 'assets/svg/bg-ground.svg', { width: 1600, height: 200 });
    }

    create() {
        this.scene.start('Menu');
    }
}
