CanvasRenderingContext2D.prototype.drawImageRotated = function(image, x, y, width, height, angleInRad) {
	this.save(); // Save the current state of the canvas
	this.translate(x + width / 2, y + height / 2); // Translate to the center of the image
	this.rotate(angleInRad); // Rotate the canvas
	this.drawImage(image, -width / 2, -height / 2, width, height); // Draw the image centered at the origin
	this.restore(); // Restore the canvas state
};

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game");
const pauseScreen = document.getElementById("pauseScreen");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const flappy = new Image();
flappy.src = "./bird.png";
const flapSound = new Audio("./flap.mp3");
const explosion = new Audio("./die.mp3");
const music = new Audio("./music.mp3");
const pipeSpace = 75;
const scrollSpeed = 10;
let maxPipeYDifference = canvas.height / 2;
let posX = canvas.width / 3;
let speed = -8;
let pos = canvas.height / 2;
let pipes = [];
let score = 0;
let pipesSummoningCooldown = 60;
let gamePaused = false;

addEventListener("resize", ()=>{
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	posX = canvas.width / 3;
	maxPipeYDifference = canvas.height / 2;
});

onbeforeunload = ()=>{
	return "you might loose progress or something";
};

function tick(timeScale) {
	// This runs every frame
	
	// Player
	pos += speed * timeScale;
	speed += 0.4 * timeScale;

	// Checking for death
	if (canvas.height - pos > canvas.height || canvas.height - pos < 0) {
		explosion.load();
		explosion.play();
		reset();
	}

	// Pipes
	pipes.forEach((pipe, pipeidx)=>{
		// Moving the pipes
		pipe.x -= scrollSpeed * timeScale;

		if (pipe.x < -50) {
			delete pipes[pipeidx];
		}

		// Checking for death
		if (posX > pipe.x-25 && posX < pipe.x+25 && !(pos < pipe.y + pipeSpace && pos > pipe.y - pipeSpace) ) {
			explosion.load();
			explosion.play();
			reset();
		}

		// Score
		if (pipe.x < posX && !pipe.passed) {
			score++;
			pipe.passed = true;
		}
	});

	// Summon Pipes
	pipesSummoningCooldown -= timeScale;
	if (pipesSummoningCooldown <= 0) {
		pipesSummoningCooldown = 60;
		summonPipe();
	}
}

function render() {
	// Clear Screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Player
	ctx.drawImageRotated(flappy, posX, pos - 25, 50, 50, Math.atan2(speed, scrollSpeed));
	// Pipes
	pipes.forEach(pipe=>renderPipe(pipe.x, pipe.y));
	// Text
	ctx.font = "30px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(score, 10, 30);
}

function renderPipe(x, y) {
	ctx.fillStyle = "green";
	ctx.fillRect(x - 50/2, y + pipeSpace, 50, 1000);
	ctx.fillRect(x - 50/2, y - (1000 + pipeSpace), 50, 1000);
	ctx.fillRect(x - 100/2, y + pipeSpace, 100, 25);
	ctx.fillRect(x - 100/2, y - pipeSpace - 25, 100, 25);
}

function summonPipe() {
	const lastPipeY = pipes.at(-1) !== undefined ? pipes.at(-1).y : pos;
	const minY = Math.max(pipeSpace, lastPipeY - maxPipeYDifference);
    const maxY = Math.min(canvas.height - pipeSpace, lastPipeY + maxPipeYDifference);
	pipes.push({
		"x": canvas.width + 50,
		"y": random(minY, maxY),
		"passed": false
	});
}

// Other

function jump() {
	speed = -8;
	flapSound.load();
	flapSound.play();
	if (music.paused) {
		music.play();
		music.loop = true;
	}
}

function random(min, max) {
	return Math.random() * (max - min) + min;
}

document.addEventListener("keydown", (e)=>{
	if (e.key === " ") {
		jump();
	}

	if (e.key === "r") {
		reset();
	}

	if (e.key === "Escape") {
		gamePaused = !gamePaused;
		if (gamePaused) {
			pauseScreen.style.display = "block";
		} else {
			pauseScreen.style.display = "none";
		}
	}
});

addEventListener('touchstart', ()=>{
	jump();
});

addEventListener('mousedown', ()=>{
	jump();
});

function reset() {
	speed = -8;
	pos = canvas.height / 2;
	pipes = [];
	pipesSummoningCooldown = 60;
	score = 0;
}

let lastTime = performance.now();
function loop(currentTime) {
	const timeScale = (currentTime - lastTime) * 0.06;
	lastTime = currentTime;
	if (!gamePaused) tick(timeScale);
	render();
	requestAnimationFrame(loop);
}
requestAnimationFrame(loop);