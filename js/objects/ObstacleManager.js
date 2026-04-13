class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.physics.add.group({
            allowGravity: false,
        });
        this.obstacleTypes = ['root', 'rock', 'mushroom', 'log'];
        this.spawnTimer = 0;
        this.spawnInterval = 2000; // ms, decreases with speed
        this.lastSpawnX = 0;
    }

    update(delta, currentSpeed) {
        this.spawnTimer += delta;

        // Adjust spawn interval based on speed
        this.spawnInterval = Math.max(
            800,
            2000 - (currentSpeed - CONSTANTS.INITIAL_SPEED) * 2
        );

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawn(currentSpeed);
            this.spawnTimer = 0;
        }

        // Move all obstacles left and recycle off-screen ones
        this.group.getChildren().forEach((obstacle) => {
            obstacle.x -= currentSpeed * (delta / 1000);
            if (obstacle.x < -100) {
                obstacle.setActive(false).setVisible(false);
                obstacle.body.enable = false;
            }
        });
    }

    spawn(currentSpeed) {
        // Pick random obstacle type
        const type = Phaser.Utils.Array.GetRandom(this.obstacleTypes);

        // Try to reuse an inactive obstacle
        let obstacle = this.group.getFirstDead(false);

        if (obstacle) {
            obstacle.setTexture(type);
            obstacle.setActive(true).setVisible(true);
            obstacle.body.enable = true;
        } else {
            obstacle = this.group.create(0, 0, type);
            obstacle.body.allowGravity = false;
        }

        obstacle.setPosition(GAME_WIDTH + 50, GROUND_Y - obstacle.displayHeight / 2);
        obstacle.body.setImmovable(true);
        obstacle.body.setSize(obstacle.displayWidth * 0.8, obstacle.displayHeight * 0.8);
    }

    getGroup() {
        return this.group;
    }

    reset() {
        this.group.getChildren().forEach((obstacle) => {
            obstacle.setActive(false).setVisible(false);
            obstacle.body.enable = false;
        });
        this.spawnTimer = 0;
    }
}
