class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.currentSpeed = CONSTANTS.INITIAL_SPEED;
        this.score = 0;
        this.gameOver = false;
        this.deathCause = '';

        // Parallax backgrounds (two copies each for seamless scrolling)
        this.bgMountains1 = this.add.image(0, 0, 'bg-mountains').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        this.bgMountains2 = this.add.image(GAME_WIDTH, 0, 'bg-mountains').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        this.bgTrees1 = this.add.image(0, 0, 'bg-trees').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        this.bgTrees2 = this.add.image(GAME_WIDTH, 0, 'bg-trees').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        this.bgGround1 = this.add.image(0, GROUND_Y, 'bg-ground').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
        this.bgGround2 = this.add.image(GAME_WIDTH, GROUND_Y, 'bg-ground').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

        // Ground physics body (invisible static group with a rectangle)
        this.groundGroup = this.physics.add.staticGroup();
        this.ground = this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 10, GAME_WIDTH, 20, 0x000000, 0);
        this.groundGroup.add(this.ground);
        this.ground.body.refreshBody();

        // Player
        this.hoochBalance = new HoochBalance();
        this.gurgles = new Gurgles(this, 150, GROUND_Y - 40);
        this.physics.add.collider(this.gurgles.getSprite(), this.groundGroup);

        // Managers
        this.obstacleManager = new ObstacleManager(this);
        this.collectibleManager = new CollectibleManager(this);

        // Collisions
        this.physics.add.collider(
            this.gurgles.getSprite(),
            this.obstacleManager.getGroup(),
            this.hitObstacle,
            null,
            this
        );

        this.physics.add.overlap(
            this.gurgles.getSprite(),
            this.collectibleManager.getGroup(),
            this.collectItem,
            null,
            this
        );

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Speed ramp timer
        this.speedTimer = this.time.addEvent({
            delay: CONSTANTS.SPEED_RAMP_INTERVAL,
            callback: this.increaseSpeed,
            callbackScope: this,
            loop: true,
        });

        // HUD
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Arial, sans-serif',
            stroke: '#000',
            strokeThickness: 3,
        }).setScrollFactor(0).setDepth(100);

        // Spill meter background
        this.spillBarBg = this.add.rectangle(GAME_WIDTH - 170, 24, 154, 22, 0x444444)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(100);
        this.spillBarBorder = this.add.rectangle(GAME_WIDTH - 170, 24, 154, 22)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(100).setStrokeStyle(2, 0xffffff);
        this.spillBar = this.add.rectangle(GAME_WIDTH - 168, 24, 0, 18, 0xD4A017)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(100);
        this.spillLabel = this.add.text(GAME_WIDTH - 170, 44, 'HOOCH', {
            fontSize: '12px',
            fill: '#bdc3c7',
            fontFamily: 'Arial, sans-serif',
        }).setScrollFactor(0).setDepth(100);

        // Balance indicator (small arc near Gurgles)
        this.balanceIndicator = this.add.graphics().setDepth(50);
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Parallax scrolling
        const mountainSpeed = this.currentSpeed * 0.1;
        const treeSpeed = this.currentSpeed * 0.4;
        const groundSpeed = this.currentSpeed;

        this.scrollBackground(this.bgMountains1, this.bgMountains2, mountainSpeed, delta);
        this.scrollBackground(this.bgTrees1, this.bgTrees2, treeSpeed, delta);
        this.scrollBackground(this.bgGround1, this.bgGround2, groundSpeed, delta);

        // Input: jump
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.gurgles.jump(this.hoochBalance);
        }

        // Update balance
        this.hoochBalance.setSpeedMultiplier(this.currentSpeed);
        this.hoochBalance.update(delta, this.cursors);

        // Update player
        this.gurgles.update(this.hoochBalance);

        // Update managers
        this.obstacleManager.update(delta, this.currentSpeed);
        this.collectibleManager.update(delta, this.currentSpeed);

        // Score
        this.score += this.currentSpeed * (delta / 1000) * 0.1;
        this.scoreText.setText('Score: ' + Math.floor(this.score));

        // Update spill meter HUD
        const spillWidth = (this.hoochBalance.spillMeter / 100) * 150;
        this.spillBar.width = spillWidth;
        if (this.hoochBalance.isInDanger()) {
            this.spillBar.setFillStyle(0xe74c3c);
        } else {
            this.spillBar.setFillStyle(0xD4A017);
        }

        // Balance indicator
        this.updateBalanceIndicator();

        // Splash particles when spilling
        if (Math.abs(this.hoochBalance.value) > CONSTANTS.BALANCE_SPILL_THRESHOLD) {
            if (Math.random() < 0.3) {
                const side = this.hoochBalance.value > 0 ? 1 : -1;
                const mugX = this.gurgles.getSprite().x + side * 38;
                const mugY = this.gurgles.getSprite().y - 15;
                const drop = this.add.circle(
                    mugX + Math.random() * 6 - 3,
                    mugY,
                    2 + Math.random() * 2,
                    0xD4A017,
                    0.8
                );
                this.tweens.add({
                    targets: drop,
                    y: drop.y + 30 + Math.random() * 20,
                    alpha: 0,
                    duration: 400 + Math.random() * 200,
                    onComplete: () => drop.destroy(),
                });
            }
        }

        // Check spill game over
        if (this.hoochBalance.isSpilled()) {
            this.deathCause = 'spill';
            this.endGame();
        }
    }

    scrollBackground(bg1, bg2, speed, delta) {
        const move = speed * (delta / 1000);
        bg1.x -= move;
        bg2.x -= move;

        if (bg1.x <= -GAME_WIDTH) {
            bg1.x = bg2.x + GAME_WIDTH;
        }
        if (bg2.x <= -GAME_WIDTH) {
            bg2.x = bg1.x + GAME_WIDTH;
        }
    }

    updateBalanceIndicator() {
        this.balanceIndicator.clear();
        const x = this.gurgles.getSprite().x;
        const y = this.gurgles.getSprite().y + 45;
        const balance = this.hoochBalance.value;

        // Draw a small arc indicator
        const color = Math.abs(balance) > CONSTANTS.BALANCE_SPILL_THRESHOLD ? 0xe74c3c : 0x2ecc71;
        this.balanceIndicator.fillStyle(color, 0.7);
        const indicatorX = x + (balance / 100) * 25;
        this.balanceIndicator.fillCircle(indicatorX, y, 4);

        // Center marker
        this.balanceIndicator.fillStyle(0xffffff, 0.3);
        this.balanceIndicator.fillCircle(x, y, 2);
    }

    increaseSpeed() {
        if (this.currentSpeed < CONSTANTS.MAX_SPEED) {
            this.currentSpeed = Math.min(
                this.currentSpeed + CONSTANTS.SPEED_INCREMENT,
                CONSTANTS.MAX_SPEED
            );
        }
    }

    hitObstacle(gurglesSprite, obstacle) {
        if (this.gameOver) return;
        this.deathCause = 'obstacle';
        this.endGame();
    }

    collectItem(gurglesSprite, item) {
        if (!item.active) return;
        const bonus = this.collectibleManager.collect(item);
        this.score += bonus;

        // Sparkle effect
        const sparkle = this.add.circle(item.x, item.y, 12, 0xF1C40F, 0.8);
        this.tweens.add({
            targets: sparkle,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => sparkle.destroy(),
        });
    }

    endGame() {
        this.gameOver = true;
        this.physics.pause();
        this.speedTimer.remove();

        // Screen shake for obstacle death
        if (this.deathCause === 'obstacle') {
            this.cameras.main.shake(300, 0.02);
        }

        // Save high score
        const highScore = localStorage.getItem('holdthehooch_highscore') || 0;
        const finalScore = Math.floor(this.score);
        if (finalScore > highScore) {
            localStorage.setItem('holdthehooch_highscore', finalScore);
        }

        // Transition to game over after brief delay
        this.time.delayedCall(800, () => {
            this.scene.start('GameOver', {
                score: finalScore,
                highScore: Math.max(finalScore, parseInt(highScore)),
                distance: finalScore,
                herbs: this.collectibleManager.getCollectedCount(),
                cause: this.deathCause,
            });
        });
    }
}
