function $(selector) {return document.querySelector(selector);}

/**
 * @type {HTMLInputElement}
 */
const upload = $('#files');
/**
 * @type {HTMLInputElement}
 */
const resDiv = $('#div');
/**
 * @type {HTMLCanvasElement}
 */
const lines = $('#lines');
const lctx = lines.getContext('2d');
/**
 * @type {HTMLCanvasElement}
 */
const img = $('#image');
const ictx = img.getContext('2d');

function generateLines(numFrames, speed) {
    const col = (lines.width / speed) / numFrames;
    const fild = col * (numFrames - 1);
    for (let x = 0; x < lines.width; x += fild + col) {
        lctx.fillStyle = 'black';
        lctx.fillRect(x, 0, fild, lines.height);
    }
}
function generateImage(frames, speed) {
    const col = (img.width / speed) / frames.length;
    const space = col * (frames.length - 1);
    for (let i = 0; i < frames.length; i++) {
        const e = frames[i];
        for (let x = i * col; x < img.width; x += col + space) {
            ictx.drawImage(e, x, 0, col, img.height, x, 0, col, img.height);
        }
    }
}

upload.onchange = ()=>{
    let images = [];
    Array.from(upload.files).forEach(e => {
        const theImage = new Image();
        const url = URL.createObjectURL(e);
        theImage.src = url;
        images.push(theImage);
    });
    Promise.all(images.map(e=>new Promise(res=>e.onload=res))).then(()=>{
        lines.width = Math.max(...images.map(e=>e.naturalWidth));
        lines.height = Math.max(...images.map(e=>e.naturalHeight));
        img.width = lines.width;
        img.height = lines.height;

        generateLines(upload.files.length, resDiv.valueAsNumber);
        generateImage(images, resDiv.valueAsNumber);
    });
};