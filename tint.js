const c = document.querySelector('canvas');
const ctx = c.getContext('2d');
const input = document.querySelector('#file');
const incolor = document.querySelector('#color');
let image;

incolor.oninput = render;

input.onchange = function () {
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    image = new Image();
    image.src = url;
    image.onload = function () {
        c.width = image.naturalWidth;
        c.height = image.naturalHeight;
        render();
    };
}

function render() {
    if (!image) {return};
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = incolor.value;
    ctx.fillRect(0, 0, c.width, c.height);
}
