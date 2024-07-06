const params = new URLSearchParams(document.location.search);
const code = params.get('code');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const titleElement = document.getElementById('title');
let scrollx = 0, scrolly = 0;
let zoom = 1;
//let debugtile;
//let mi;
const lvldata = decode(code);
let grid = lvldata.grid;
let width = lvldata.width, height = lvldata.height;
let title = lvldata.title;
if (title) {
    titleElement.innerHTML = title;
}

// resizing
resize();
window.onresize = resize;
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// images
let images = [];
for(let i = 0; i < cells.length; i++) {
    const img = new Image();
    img.src = 'tiles/' + cells[i] + '.png';
    //img.style.imageRendering = 'pixelated';
    images.push(img);
}

// get image of tile from tile name
function tNameImg(tname) {
    return images[cells.indexOf(tname)];
}

function tileImg(e) {
    return tNameImg(e.split(':')[0]);
}
function tDir(e) {
    return e.split(':')[1] * Math.PI;
}

/*document.onmousemove = function(e) {
    const ix = Math.round((e.clientX + scrollx) / 32);
    const iy = (((canvas.height - e.clientY) + scrolly) / 32);
    mi = iy; //+ (iy * width);
    debugtile = grid[mi];
}*/

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    let i = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (tileImg(grid[i]) != undefined) {
                ctx.save();
                ctx.translate(((x * 32 - scrollx) * zoom) + (1 - zoom) * (canvas.width / 2), ((y * -32 + scrolly) * zoom) + (1 - zoom) * (canvas.height / 2) );
                ctx.rotate( tDir( grid[i] ) );
                ctx.drawImage( tileImg(grid[i]), -16 * zoom, -16 * zoom, 32 * zoom, 32 * zoom);
                ctx.restore();
            }
            i++;
        }
    }
    //ctx.fillStyle = 'white';
    //ctx.fillText(debugtile + ',' + mi, 10, 10);
}

function tick() {
    render();
    requestAnimationFrame(tick);
}
tick();

document.onwheel = function(e) {
    if (e.ctrlKey || e.metaKey) {
        if (zoom < 0.01) {
            zoom += e.deltaY * 0.001;
        } else {
            zoom += e.deltaY * zoom * 0.01;
        }
        console.log(e.deltaY, zoom);
        if (zoom < 0) {
            zoom = 0;
        }
        if (zoom > 10) {
            zoom = 10;
        }
    } else {
        scrollx += e.deltaX;
        scrolly -= e.deltaY;
    }
}

document.onkeydown = function (e) {
    if (e.key == 'z') {
        zoom = 1;
    }
}
