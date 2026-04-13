class CollectibleManager {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.physics.add.group({
            allowGravity: false,
        });
        this.collectibleTypes = ['herb', 'hops', 'potion'];
        this.spawnTimer = 0;
        this.spawnInterval = 3000;
        this.collected = 0;
    }

    update(delta, currentSpeed) {
        this.spawnTimer += delta;

        this.spawnInterval = Math.max(
            1500,
            3000 - (currentSpeed - CONSTANTS.INITIAL_SPEED) * 1.5
        );

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawn(currentSpeed);
            this.spawnTimer = 0;
        }

        // Move all collectibles left and recycle off-screen ones
        this.group.getChildren().forEach((item) => {
            item.x -= currentSpeed * (delta / 1000);
            if (item.x < -50) {
                item.setActive(false).setVisible(false);
                item.body.enable = false;
            }
        });
    }

    spawn(currentSpeed) {
        const type = Phaser.Utils.Array.GetRandom(this.collectibleTypes);

        let item = this.group.getFirstDead(false);

        if (item) {
            item.setTexture(type);
            item.setActive(true).setVisible(true);
            item.body.enable = true;
        } else {
            item = this.group.create(0, 0, type);
            item.body.allowGravity = false;
        }

        // Varying heights: some low (easy grab), some high (need to jump)
        const minY = GROUND_Y - 120;
        const maxY = GROUND_Y - 30;
        const y = Phaser.Math.Between(minY, maxY);

        item.setPosition(GAME_WIDTH + 50, y);
        item.body.setSize(item.displayWidth, item.displayHeight);

        // Gentle float animation
        this.scene.tweens.add({
            targets: item,
            y: y - 8,
            duration: 500 + Math.random() * 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    collect(item) {
        item.setActive(false).setVisible(false);
        item.body.enable = false;
        this.scene.tweens.killTweensOf(item);
        this.collected++;
        return CONSTANTS.COLLECTIBLE_BONUS;
    }

    getGroup() {
        return this.group;
    }

    getCollectedCount() {
        return this.collected;
    }

    reset() {
        this.group.getChildren().forEach((item) => {
            item.setActive(false).setVisible(false);
            item.body.enable = false;
            this.scene.tweens.killTweensOf(item);
        });
        this.spawnTimer = 0;
        this.collected = 0;
    }
}
