// elements
/** @type {HTMLAudioElement} */ const audio = document.getElementById("audio");
/** @type {HTMLCanvasElement} */ const canvas = document.getElementById("oscilloscope");
/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext("2d");
/** @type {HTMLInputElement} */ const fileInput = document.getElementById("fileInput");
/** @type {HTMLParagraphElement} */ const fileName = document.getElementById("fileName");

fileInput.addEventListener("change", ()=>{
	const file = fileInput.files[0];
	fileName.innerText = file.name;
	audio.src = URL.createObjectURL(file);
});

// constants
const beamSize = 3;
const size = 2048;

// initialize stuff
const actx = new (window.AudioContext || window.webkitAudioContext)();
const source = actx.createMediaElementSource(audio);
const splitter = actx.createChannelSplitter(2);
const analyzerL = actx.createAnalyser();
const analyzerR = actx.createAnalyser();
analyzerL.fftSize = size;
analyzerR.fftSize = size;
source.connect(splitter);
splitter.connect(analyzerL, 0);
splitter.connect(analyzerR, 1);
source.connect(actx.destination);
const dataArrayL = new Float32Array(analyzerL.fftSize);
const dataArrayR = new Float32Array(analyzerR.fftSize);

// cavsa
function resize() {
	canvas.height = Math.min(innerWidth, innerHeight);
	canvas.width = canvas.height;
}
resize();
window.onresize = resize;

function draw() {
	requestAnimationFrame(draw);

	analyzerL.getFloatTimeDomainData(dataArrayL);
	analyzerR.getFloatTimeDomainData(dataArrayR);

	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	let lastX = (dataArrayL[0] + 1.0) * 0.5 * canvas.width;
	let lastY = (-dataArrayR[0] + 1.0) * 0.5 * canvas.height;
	
	for (let i = 0; i < size; ++i) {
		const x = (dataArrayL[i] + 1.0) * 0.5 * canvas.width;
		const y = (-dataArrayR[i] + 1.0) * 0.5 * canvas.height;

		const alpha = Math.sqrt(beamSize / (Math.hypot(x-lastX, y-lastY) + 1e-6)) * Math.min((i / size) / 0.33, 1) * 0.5;
		
		ctx.globalCompositeOperation = "lighter";
		ctx.lineWidth = beamSize;
		ctx.lineCap = "round";
		ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();

		lastX = x;
		lastY = y;
	}
}

// initiate loop
draw();