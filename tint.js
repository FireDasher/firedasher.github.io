const c = document.querySelector('canvas');
const ctx = c.getContext('2d');
const input = document.querySelector('#file');
const incolor = document.querySelector('#color');
let image;

function stuff() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = incolor.value;
    ctx.fillRect(0, 0, c.width, c.height);
    
    requestAnimationFrame(stuff);
}

input.onchange = function () {
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    image = new Image();
    image.src = url;
    image.onload = function () {
        c.width = image.naturalWidth;
        c.height = image.naturalHeight;
        stuff();
    };
}