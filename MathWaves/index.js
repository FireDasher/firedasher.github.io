const $ = document.querySelector.bind(document);
/** @type {HTMLInputElement} */ const exprElement = $("#expression");
/** @type {HTMLInputElement} */ const durationElement = $("#duration");
/** @type {HTMLInputElement} */ const volumeElement = $("#volume");
/** @type {HTMLInputElement} */ const resolutionElement = $("#resolution");
/** @type {HTMLButtonElement} */ const playElement = $("#play");
/** @type {HTMLButtonElement} */ const stopElement = $("#stop");
/** @type {HTMLButtonElement} */ const downloadElement = $("#download");
/** @type {HTMLParagraphElement} */ const errorElement = $("#error");
/** @type {HTMLCanvasElement} */ const canvas = $("#waveform");
const ctx = canvas.getContext("2d");
const actx = new (window.AudioContext || window.webkitAudioContext)();

/** @type {AudioBufferSourceNode} */ let source;
/** @type {GainNode} */ let sourceVolume;
/** @type {AudioBuffer} */ let buffer;

let startTime = 0;
let duration = 1;

function compileSound() {
    try {
        const sampleRate = actx.sampleRate;
        duration = Number(durationElement.value);

        const numSamples = sampleRate * duration;
        buffer = actx.createBuffer(1, numSamples, sampleRate);
        const data = buffer.getChannelData(0);

        const expression = math.compile(exprElement.value.replaceAll("\n", ""));
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            data[i] = Math.max(-1, Math.min(1, expression.evaluate({ t })));
        }

        errorElement.textContent = "";
    } catch (e) {
        errorElement.textContent = e;
    }
}

function playSound() {
    if (source) source.stop();

    source = actx.createBufferSource();
    sourceVolume = actx.createGain();

    source.buffer = buffer;
    sourceVolume.gain.value = Number(volumeElement.value);

    source.connect(sourceVolume);
    sourceVolume.connect(actx.destination);

    startTime = Date.now();
    source.start();
}

exprElement.addEventListener("input", compileSound);
durationElement.addEventListener("input", compileSound);
playElement.addEventListener("click", playSound);
stopElement.addEventListener("click", ()=>{
    if (!source) return;
    source.stop();
    startTime = 0;
});
volumeElement.addEventListener("input", ()=>{
    sourceVolume.gain.value = Number(volumeElement.value);
});

function download() {
    const wavbuffer = encodeWAV(buffer);
    const blob = new Blob([wavbuffer], {type: "audio/wav"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MathWavesSound.wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

downloadElement.addEventListener("click", download);

function setSize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = window.innerWidth - rect.left * 2;
    canvas.height = window.innerHeight - rect.top - 20;
}
setSize();
window.addEventListener("resize", setSize);

let zoom = 1;
let pan = 0;

canvas.addEventListener("wheel", e=>{
    const mouseX = e.offsetX;
    const before = fromCanvas(mouseX);
    zoom -= e.deltaY * 0.0001;
    zoom = Math.max(0.1, zoom);
    const after = fromCanvas(mouseX);
    pan += before - after;
});

let mouseDown = false;

canvas.addEventListener("mousedown", e=>{
    mouseDown = true;
    document.body.style.cursor = "grabbing";
});

window.addEventListener("mouseup", e=>{
    mouseDown = false;
    document.body.style.cursor = "auto";
});

window.addEventListener("mousemove", e=>{
    if (!mouseDown) return;
    pan -= e.movementX / (canvas.width * zoom);
});

function toCanvas(t) {
    return (t - 0.5 - pan) * canvas.width * zoom + canvas.width * 0.5;
}
function fromCanvas(x) {
    return (x - canvas.width * 0.5) / (canvas.width * zoom) + 0.5 + pan;
}

let lastTime = Date.now();
let deltaTime = 0.016;

function render() {
    const time = Date.now();
    deltaTime = time - lastTime;
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFF";
    ctx.font = "16px Arial, sans-serif"
    ctx.fillText(`FPS: ${Math.floor(1000/deltaTime)}`, 10, 24);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#F00";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);
    ctx.lineTo(canvas.width, canvas.height * 0.5);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0F0";
    ctx.beginPath();
    ctx.moveTo(toCanvas(0), 0);
    ctx.lineTo(toCanvas(0), canvas.height);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0F0";
    ctx.beginPath();
    ctx.moveTo(toCanvas(1), 0);
    ctx.lineTo(toCanvas(1), canvas.height);
    ctx.stroke();

    const t = ((time - startTime)*0.001 / duration);
    if (t > 0 && t < 1) {
        const playBackMarkerX = toCanvas(t);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#0FF";
        ctx.beginPath();
        ctx.moveTo(playBackMarkerX, 0);
        ctx.lineTo(playBackMarkerX, canvas.height);
        ctx.stroke();
    }

    if (!buffer) return;
    const step = 1/Number(resolutionElement.value);

    const data = buffer.getChannelData(0);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);
    for (let x = 0.0; x < canvas.width; x += step) {
        const i = Math.round(fromCanvas(x)*(data.length - 1));
        const y = data[i] === undefined ? canvas.height * 0.5 : data[i] * (canvas.height * -0.5) + (canvas.height * 0.5);
        ctx.lineTo(x, y);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
}

function tick() {
    render();
    requestAnimationFrame(tick);
}
tick();