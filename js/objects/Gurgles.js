class Gurgles {
    constructor(scene, x, y) {
        this.scene = scene;

        // Main sprite
        this.sprite = scene.physics.add.sprite(x, y, 'gurgles');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setGravityY(0); // Uses scene gravity

        // Mugs as child images (positioned relative to Gurgles)
        this.mugLeft = scene.add.image(x - 38, y - 10, 'mug');
        this.mugRight = scene.add.image(x + 38, y - 10, 'mug').setFlipX(true);

        this.isJumping = false;
        this.groundY = y;
    }

    update(hoochBalance) {
        // Update mug positions to follow Gurgles
        const x = this.sprite.x;
        const y = this.sprite.y;
        this.mugLeft.setPosition(x - 38, y - 10);
        this.mugRight.setPosition(x + 38, y - 10);

        // Tilt mugs based on balance
        const tilt = hoochBalance.getTiltAngle();
        this.mugLeft.setAngle(-tilt);
        this.mugRight.setAngle(-tilt);

        // Switch texture based on jump state
        if (this.sprite.body.touching.down || this.sprite.body.blocked.down) {
            if (this.isJumping) {
                this.isJumping = false;
                this.sprite.setTexture('gurgles');
                hoochBalance.applyLandWobble();
            }
        }
    }

    jump(hoochBalance) {
        if (this.sprite.body.touching.down || this.sprite.body.blocked.down) {
            this.sprite.setVelocityY(CONSTANTS.JUMP_VELOCITY);
            this.sprite.setTexture('gurgles-jump');
            this.isJumping = true;
            hoochBalance.applyJumpWobble();
        }
    }

    getSprite() {
        return this.sprite;
    }

    getMugs() {
        return [this.mugLeft, this.mugRight];
    }

    destroy() {
        this.sprite.destroy();
        this.mugLeft.destroy();
        this.mugRight.destroy();
    }
}
