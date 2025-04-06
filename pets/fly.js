import { Pet } from "./pet.js";

export class Fly extends Pet {
    constructor(animations, petSize) {
        super(animations, petSize); // Call the Pet constructor
        console.log("Creating Fly instance");
        this.speed = 2; // Speed of the fly
        this.direction = Math.random() * Math.PI * 2; // Random initial direction
    }

    update(canvas) {
        if (!this.beingEaten) {
            // change direction gradualy but when going out of bounds, change direction to go back in slowly
            const deltaX = Math.cos(this.direction) * this.speed;
            const deltaY = Math.sin(this.direction) * this.speed;
            this.x += deltaX;
            this.y += deltaY;
            // Check for canvas boundaries
            if (this.x < 0 || this.x > canvas.width - this.petSize) {
                this.direction = Math.PI - this.direction; // Reverse direction
                this.x = Math.max(0, Math.min(this.x, canvas.width - this.petSize)); // Keep within bounds
            }
            if (this.y < 0 || this.y > canvas.height - this.petSize) {
                this.direction = -this.direction; // Reverse direction
                this.y = Math.max(0, Math.min(this.y, canvas.height - this.petSize)); // Keep within bounds
            }
            // Randomly change direction every 50 frames
            if (Math.random() < 0.02) {
                this.direction += (Math.random() - 0.5) * Math.PI / 4; // Change direction slightly
            }
        }
    }

    eat() {
        this.beingEaten = true;
        this.setState('idle');
        this.frameIndex = 0;
        this.frameTimer = 0;
    }
}