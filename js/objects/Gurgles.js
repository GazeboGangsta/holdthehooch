class Gurgles {
    constructor(scene, x, y) {
        this.scene = scene;

        // Main sprite
        this.sprite = scene.physics.add.sprite(x, y, 'gurgles');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setGravityY(0); // Uses scene gravity

        // Single hooch held above head with both hands
        this.hooch = scene.add.image(x, y - 50, 'hooch');

        this.isJumping = false;
        this.groundY = y;
    }

    update(hoochBalance) {
        const x = this.sprite.x;
        const y = this.sprite.y;

        // Hooch follows above Gurgles' head, offset by balance tilt
        const tiltOffset = (hoochBalance.value / 100) * 8;
        this.hooch.setPosition(x + tiltOffset, y - 50);
        this.hooch.setAngle(hoochBalance.getTiltAngle());

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

    getHooch() {
        return this.hooch;
    }

    destroy() {
        this.sprite.destroy();
        this.hooch.destroy();
    }
}
