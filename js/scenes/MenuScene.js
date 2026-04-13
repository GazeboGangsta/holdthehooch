class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }
    create() {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Hold the Hooch', {
            fontSize: '48px',
            fill: '#fff',
        }).setOrigin(0.5);
    }
}
