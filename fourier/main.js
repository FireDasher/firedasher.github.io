/** @type {HTMLCanvasElement} */ const canvas = document.getElementById("the");
/** @type {HTMLInputElement} */ const follow = document.getElementById("follow");
/** @type {HTMLInputElement} */ const speed = document.getElementById("speed");
/** @type {HTMLInputElement} */ const numarrows = document.getElementById("numarrows");

const ctx = canvas.getContext("2d");

let cx = 0;
let cy = 0;
let zoom = 1;

function toScreen(x, y) {
	return [(x - cx)*zoom + canvas.width/2, canvas.height/2 - (y - cy)*zoom];
}

function fromScreen(x, y) {
	return [(x - canvas.width/2)/zoom + cx, (canvas.height/2 - y)/zoom + cy];
}

// [[x, y], [x, y]]
let drawnPoints = [];
// [[x, y], [x, y]]
let trail = [];
// [[n, real, imag], [n, real, imag]]
let vectors = [];

let drawing = false;
canvas.addEventListener("mousedown", (e)=>{ drawing = true; drawnPoints.push(fromScreen(e.offsetX, e.offsetY)); });
document.addEventListener("mouseup", ()=>{ drawing = false; });

canvas.addEventListener("mousemove", (e)=>{
	if (drawing) {
		if (drawnPoints.length == 0) {
			drawnPoints.push(fromScreen(e.offsetX, e.offsetY));
		} else {
			const dx = e.offsetX - drawnPoints[drawnPoints.length - 1][0];
			const dy = e.offsetY - drawnPoints[drawnPoints.length - 1][1];
			if (dx * dx + dy * dy > 100) {
				drawnPoints.push(fromScreen(e.offsetX, e.offsetY));
			}
		}
	}
});

function getNearest(t) {
	const i = t * (drawnPoints.length - 1);
	const min = Math.floor(i);
	const max = Math.ceil(i);
	const fact = i - min;
	const interpX = drawnPoints[min][0]*(1 - fact) + drawnPoints[max][0]*fact;
	const interpY = drawnPoints[min][1]*(1 - fact) + drawnPoints[max][1]*fact;
	return [interpX, interpY];
}

function createVector(n) {
	let cumulative = [0.0, 0.0];
	let dt = 0.001;

	for (let t = 0.0; t < 1.0; t += dt) {
		const [real, imag] = getNearest(t);
		const angle = -2 * Math.PI * n * t;
		const expReal = Math.cos(angle);
    	const expImag = Math.sin(angle);
		const prodReal = real * expReal - imag * expImag;
		const prodImag = real * expImag + imag * expReal;
		cumulative[0] += prodReal * dt;
    	cumulative[1] += prodImag * dt;
	}

	return [n, cumulative[0], cumulative[1]];
}

function process() {
	vectors = [];

	let n = 0;
	for (let i = 0; i < numarrows.valueAsNumber; i++) {
		vectors.push(createVector(n));

		if (n > 0) n = -n;
		else n = -n + 1;
	}
}

let time = 0;

let lastTime = performance.now();

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const now = performance.now();
	const dt = (now - lastTime) / 1000;
	lastTime = now;

	time += dt * speed.valueAsNumber;

	// axis
	ctx.fillStyle = "#444";
	const centre = toScreen(0, 0);
	ctx.fillRect(0, centre[1], canvas.width, 2);
	ctx.fillRect(centre[0], 0, 2, canvas.height);
	
	// draw drawing
	ctx.beginPath();
	if (drawnPoints.length > 0) ctx.moveTo(...toScreen(drawnPoints[0][0], drawnPoints[0][1]));
	
	for (let i = 1; i < drawnPoints.length; i++) ctx.lineTo(...toScreen(drawnPoints[i][0], drawnPoints[i][1]));

	if (drawnPoints.length > 0) ctx.lineTo(...toScreen(drawnPoints[0][0], drawnPoints[0][1]));
	
	ctx.strokeStyle = "#FFF";
	ctx.lineWidth = 2;
	ctx.stroke();
	
	// draw vectors
	
	let startx = 0;
	let starty = 0;
	for (let i = 0; i < vectors.length; i++) {
		const v = vectors[i];
		const val = 2 * Math.PI * v[0] * time;
		const cos = Math.cos(val), sin = Math.sin(val);
		const endx = startx + (v[1] * cos - v[2] * sin);
		const endy = starty + (v[1] * sin + v[2] * cos);

		const dx = endx - startx;
		const dy = endy - starty;
		const length = Math.sqrt(dx*dx + dy*dy);
		
		ctx.beginPath();
		ctx.moveTo(...toScreen(startx, starty));
		ctx.lineTo(...toScreen(endx, endy));
		ctx.strokeStyle = "#0FF";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(...toScreen(startx, starty), length * zoom, 0, 2*Math.PI);
		ctx.strokeStyle = "#8888";
		ctx.lineWidth = 1;
		ctx.stroke();

		startx = endx;
		starty = endy;
	}

	if (follow.checked) {
		cx = startx;
		cy = starty;
		zoom = 10;
	} else {
		cx = 0;
		cy = 0;
		zoom = 1;
	}

	trail.push([startx, starty]);
	if (trail.length > 500) {
		trail.shift();
	}

	// draw trail
	ctx.beginPath();
	trail.forEach(i => ctx.lineTo(...toScreen(...i)));
	ctx.strokeStyle = "#F00";
	ctx.lineWidth = 2;
	ctx.stroke();

	// next frame
	requestAnimationFrame(render);
}

render();