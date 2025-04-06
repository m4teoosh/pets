const IDLE_COOLDOWN = 50; // 5 seconds

export class Pet {
    constructor(animations, petSize) {
      console.log("Creating Pet instance");
      this.animations = animations;
      this.state = 'idle';
      this.frameIndex = 0;
      this.frameTimer = 0;
      this.petSize = petSize;
      this.idleTime = 0;
    }

    spawn(canvas){
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * (canvas.height - 100);
    }
  
    setState(state) {
      console.log(`Setting state to ${state}`);
      if (this.state !== state) {
        this.state = state;
        this.frameIndex = 0;
        this.frameTimer = 0;
      }
    }
  
    update(canvas) {
      //if idling for more than 5 seconds, set a random target
      if (this.state === 'idle') {
        this.idleTime++;
        if (this.idleTime > IDLE_COOLDOWN + Math.floor(Math.random() * IDLE_COOLDOWN)) { // 5 to 10 seconds
          this.targetX = Math.random() * canvas.width; // Random X target
          this.targetY = Math.random() * (canvas.height - 100); // Random Y target
          this.setState('jump');
          this.idleTime = 0;
        }
      } else {
        this.idleTime = 0;
      }
      // if target is aquired, move towards it
      if (this.state === 'jump') {
        const deltaX = this.targetX - this.x;
        const deltaY = this.targetY - this.y;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > 5) { // Move towards the target
          this.x += (deltaX / distance) * 5;
          this.y += (deltaY / distance) * 5;
        } else {
          // When the target is reached, go back to idle
          this.setState('idle');
        }
      }

    }
  
    draw(ctx) {
      const anim = this.animations[this.state];
      const frame = anim.frames[this.frameIndex];
      const sx = frame.x * this.petSize;

      this.frameTimer++;
      if (this.frameTimer >= frame.duration) {
        this.frameTimer = 0;
        this.frameIndex = (this.frameIndex + 1) % anim.frames.length;
      }
  
      ctx.drawImage(
        anim.sprite,
        sx, 0, this.petSize, this.petSize,
        this.x, this.y, this.petSize, this.petSize
      );
    }
    
    chase(targetX, targetY) {
      this.targetX = targetX;
      this.targetY = targetY;
    }
  
  }
  