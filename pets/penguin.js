import { Pet } from "./pet.js";

const STATE_COOLDOWN = 50;

export class Penguin extends Pet {
    constructor(animations, petSize) {
        super(animations, petSize);
        this.stateCooldown = 50;
        this.idleTime = 0;
        this.target = null;
    }

    update(canvas) {
        const aquireRandomTarget = () => {
            this.idleTime++;
            if (this.idleTime > 300 + Math.floor(Math.random() * 200)) {
                this.target = {
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height - 100)
                };
                this.idleTime = 0;
            }
        }

        if (!this.target) {
            aquireRandomTarget();
        }

        switch (this.state) {
            case 'idle': this.idle(canvas); break;
            case 'left': this.left(canvas); break;
            case 'right': this.right(canvas); break;
        }
    }

    idle(canvas) {
        this.idleTime++;
        if (this.idleTime > 300 + Math.floor(Math.random() * 200)) {
            this.target = {
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height - 100)
            };
            this.setState('left');
            this.idleTime = 0;
        }
    }

    left() {
        if (this.stateCooldown > 0) {
            this.stateCooldown--;
            return;
        }
        this.stateCooldown = STATE_COOLDOWN;
        this.setState('right');
    }

    right() {
        if (this.stateCooldown > 0) {
            this.stateCooldown--;
            return;
        }
        this.stateCooldown = STATE_COOLDOWN;
        this.setState('idle');
    }
}