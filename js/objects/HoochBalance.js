class HoochBalance {
    constructor() {
        this.value = 0;          // -100 to +100
        this.spillMeter = 0;     // 0 to 100
        this.driftDirection = 1; // randomly flips
        this.driftTimer = 0;
        this.speedMultiplier = 1;
    }

    reset() {
        this.value = 0;
        this.spillMeter = 0;
        this.driftDirection = 1;
        this.driftTimer = 0;
        this.speedMultiplier = 1;
    }

    update(delta, cursors) {
        const dt = delta / 1000;

        // Player input: arrow keys tilt the hooch
        if (cursors.left.isDown) {
            this.value -= CONSTANTS.BALANCE_INPUT_FORCE * this.speedMultiplier;
        }
        if (cursors.right.isDown) {
            this.value += CONSTANTS.BALANCE_INPUT_FORCE * this.speedMultiplier;
        }

        // Natural drift/wobble
        this.driftTimer += dt;
        if (this.driftTimer > 0.5 + Math.random() * 1.0) {
            this.driftDirection = Math.random() > 0.5 ? 1 : -1;
            this.driftTimer = 0;
        }
        this.value += this.driftDirection * CONSTANTS.BALANCE_DRIFT_RATE * this.speedMultiplier;

        // Clamp balance
        this.value = Phaser.Math.Clamp(this.value, -100, 100);

        // Spill meter
        const absBalance = Math.abs(this.value);
        if (absBalance > CONSTANTS.BALANCE_SPILL_THRESHOLD) {
            const overflow = absBalance - CONSTANTS.BALANCE_SPILL_THRESHOLD;
            const fillRate = CONSTANTS.SPILL_FILL_RATE * (overflow / 30) * this.speedMultiplier;
            this.spillMeter += fillRate;
        } else {
            this.spillMeter -= CONSTANTS.SPILL_DRAIN_RATE;
        }
        this.spillMeter = Phaser.Math.Clamp(this.spillMeter, 0, 100);
    }

    applyJumpWobble() {
        const wobble = (Math.random() - 0.5) * 2 * CONSTANTS.BALANCE_JUMP_WOBBLE * this.speedMultiplier;
        this.value = Phaser.Math.Clamp(this.value + wobble, -100, 100);
    }

    applyLandWobble() {
        const wobble = (Math.random() - 0.5) * 2 * CONSTANTS.BALANCE_JUMP_WOBBLE * 0.7 * this.speedMultiplier;
        this.value = Phaser.Math.Clamp(this.value + wobble, -100, 100);
    }

    isSpilled() {
        return this.spillMeter >= 100;
    }

    isInDanger() {
        return this.spillMeter > 80;
    }

    setSpeedMultiplier(currentSpeed) {
        this.speedMultiplier = 0.8 + (currentSpeed / CONSTANTS.MAX_SPEED) * 0.7;
    }

    getTiltAngle() {
        return (this.value / 100) * 12; // max 12 degree tilt
    }
}
