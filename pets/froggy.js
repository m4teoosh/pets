import { Pet } from './pet.js';

const STATE_COOLDOWN = 50;

export class Froggy extends Pet {
  constructor(animations, petSize) {
    super(animations, petSize);
    this.stateCooldown = STATE_COOLDOWN;
    this.idleTime = 0;
    this.hopDistance = 50;      // Pixels per hop

    this.tongueProgress = 0;     // 0 to 1
    this.tongueRetracting = false;
    this.targetFly = null;
  }

  update(canvas, flies = []) {


    const findNearbyFlies = () => {
      // check for nearby fly
      const nearbyFly = flies.find(fly => {
        const dx = fly.x - this.x;
        const dy = fly.y - this.y;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        return dist < 200; // Eating range
      });

      if (nearbyFly && this.state !== 'tongue') {
        this.targetFly = nearbyFly;
        this.tongueTimer = 15; // frames
        return;
      }
    }

    const aquireRandomTarget = () => {
      this.idleTime++;
      if (this.idleTime > 300 + Math.floor(Math.random() * 200)) {
        this.target = {
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height - 100)
        };
        this.setState('crouch');
        this.idleTime = 0;
      }
    }

    findNearbyFlies();

    if (!this.target) {
      aquireRandomTarget();
    }

    // usual state handling
    switch (this.state) {
      case 'idle': this.idle(canvas); break;
      case 'crouch': this.crouch(canvas); break;
      case 'jump': this.jump(canvas); break;
      case 'land': this.land(canvas); break;
      case 'tongue': this.tongue(canvas, flies); break;
    }
  }

  idle(canvas) {
    if (this.stateCooldown > 0) {
      this.stateCooldown--;
      return;
    }
    this.stateCooldown = STATE_COOLDOWN;

    if (this.targetFly) {
      this.setState('tongue');
      return;
    } else if (this.target) {
      this.setState('crouch');
      return;
    }
  }

  crouch(canvas) {
    if (this.stateCooldown > 0) {
      this.stateCooldown--;
      return;
    }
    this.stateCooldown = STATE_COOLDOWN;
    console.log("Preparing to jump towards target:", this.target);
    const deltaX = this.target.x - this.x;
    const deltaY = this.target.y - this.y;
    this.distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    this.stepX = (deltaX / this.distance) * this.hopDistance;
    this.stepY = (deltaY / this.distance) * this.hopDistance;

    this.x += this.stepX;
    this.y += this.stepY;

    this.setState('jump');
  }

  jump(canvas) {
    if (this.stateCooldown > 0) {
      this.stateCooldown--;
      return;
    }
    this.stateCooldown = STATE_COOLDOWN;

    this.x += this.stepX;
    this.y += this.stepY;

    if (this.distance < this.hopDistance) {
      this.x = this.target.x;
      this.y = this.target.y;
      this.target = null;
    }

    this.setState('land');
  }


  land(canvas) {
    if (this.stateCooldown > 0) {
      this.stateCooldown--;
      return;
    }
    this.stateCooldown = STATE_COOLDOWN;
    this.setState('idle');
  }

  tongue(canvas, flies) {
    const originX = this.x + this.petSize / 2;
    const originY = this.y + this.petSize / 2;

    // Freeze direction and fly position once when hitting the fly
    if (!this.tongueRetracting) {
      const targetX = this.targetFly.x + this.targetFly.petSize / 2;
      const targetY = this.targetFly.y + this.targetFly.petSize / 2;

      const dx = targetX - originX;
      const dy = targetY - originY;
      const tongueLength = Math.sqrt(dx ** 2 + dy ** 2);


      // Animate extending
      this.tongueProgress += 0.05;

      if (this.tongueProgress >= 1) {
        this.tongueProgress = 1;
        this.tongueRetracting = true;
        this.flyPosition = {
          x: this.targetFly.x,
          y: this.targetFly.y
        };
        this.tongueVector = { dx, dy, length: tongueLength }; // freeze
        this.targetFly.eat();
      }

    } else {
      // RETRACTING
      this.tongueProgress -= 0.05;

      const { dx, dy, length } = this.tongueVector;
      const directionX = dx / length;
      const directionY = dy / length;

      const tipX = originX + directionX * length * this.tongueProgress;
      const tipY = originY + directionY * length * this.tongueProgress;

      // Move fly along the tongue tip
      this.targetFly.x = tipX - this.targetFly.petSize / 2;
      this.targetFly.y = tipY - this.targetFly.petSize / 2;

      if (this.tongueProgress <= 0) {
        flies.splice(flies.indexOf(this.targetFly), 1);
        this.setState('idle');
        this.tongueProgress = 0;
        this.tongueRetracting = false;
        this.targetFly = null;
        this.flyPosition = null;
        this.tongueVector = null;
      }
    }
  }

  draw(ctx) {
    super.draw(ctx);

    if (this.state === 'tongue') {
      const originX = this.x + this.petSize / 2;
      const originY = this.y + this.petSize / 2;

      let targetX, targetY;

      if (!this.tongueRetracting) {
        targetX = this.targetFly.x + this.targetFly.petSize / 2;
        targetY = this.targetFly.y + this.targetFly.petSize / 2;

        const dx = targetX - originX;
        const dy = targetY - originY;
        const length = Math.sqrt(dx ** 2 + dy ** 2);
        const dirX = dx / length;
        const dirY = dy / length;
        targetX = originX + dirX * length * this.tongueProgress;
        targetY = originY + dirY * length * this.tongueProgress;

      } else if (this.tongueVector) {
        const { dx, dy, length } = this.tongueVector;
        const dirX = dx / length;
        const dirY = dy / length;
        targetX = originX + dirX * length * this.tongueProgress;
        targetY = originY + dirY * length * this.tongueProgress;
      }

      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 6;
      ctx.stroke();
    }
  }
}