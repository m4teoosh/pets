import { Froggy } from './pets/froggy.js';
import { Fly } from './pets/fly.js';
import { Pet } from './pets/pet.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let froggy;
let flies = [];

createFrog();
createFly();
play();

function createFrog() {
  const idle = new Image();
  idle.src = 'assets/rob-the-frog/rob-the-frog-idle.png';

  const crouch = new Image();
  crouch.src = 'assets/rob-the-frog/rob-the-frog-crouch.png';

  const jump = new Image();
  jump.src = 'assets/rob-the-frog/rob-the-frog-jump.png';

  const land = new Image();
  land.src = 'assets/rob-the-frog/rob-the-frog-land.png';

  froggy = new Froggy( {
    idle: {
      sprite: idle,
      frames: [
        { x: 0, duration: 30 },
      ]
    },
    jump: {
      sprite: jump, 
      frames: [
        { x: 0, duration: 30 }
      ]
    },
    crouch: {
      sprite: crouch,
      frames: [
        { x: 0, duration: 30 }
      ]
    },
    land: {
      sprite: land,
      frames: [
        { x: 0, duration: 30 }
      ]
    },
    tongue: {
      sprite: idle,
      frames: [
        { x: 0, duration: 30 }
      ]
    }
  }, 160); 
  
  froggy.spawn(canvas);
}

function createFly() {
  const flySprite = new Image();
  flySprite.src = 'assets/fly-sheet2.png';

  let fly = new Fly( {
    idle: {
      sprite: flySprite,
      frames: [
        { x: 0, duration: 10 },
        { x: 1, duration: 10 },
      ]
    },
    jump: {
      sprite: flySprite,
      frames: [
        { x: 0, duration: 10 },
        { x: 1, duration: 10 },
      ]
    }
  }, 96);

  fly.spawn(canvas);
  flies.push(fly);
  
}

function play() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  froggy.update(canvas, flies);
  froggy.draw(ctx);

  flies.forEach(fly => {
    fly.update(canvas);
    fly.draw(ctx);
  });
  requestAnimationFrame(play);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function spawnFly() {
  const flySprite = new Image();
  flySprite.src = 'assets/fly-sheet2.png';
  
  const fly = new Fly({
    idle: {
      sprite: flySprite,
      frames: [
        { x: 0, duration: 10 },
        { x: 1, duration: 10 },
      ]
    },
    jump: {
      sprite: flySprite,
      frames: [
        { x: 0, duration: 10 },
        { x: 1, duration: 10 },
      ]
    }
  }, 96);
  
  fly.spawn(canvas);
  flies.push(fly);
}

//add fly on mouse click
canvas.addEventListener('click', spawnFly);
