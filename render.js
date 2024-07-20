// images
let images = [];
for(let i = 0; i < cells.length; i++) {
    const img = new Image();
    img.src = 'tiles/' + cells[i] + '.png';
    //img.style.imageRendering = 'pixelated';
    images.push(img);
}

let scrollx = 0, scrolly = 0;
let zoom = 1;

// get image of tile from tile name
function tNameImg(tname) {
    return images[cells.indexOf(tname)];
}
function tileImg(e) {
    return tNameImg(e.split(':')[0]);
}
// get tile direction
function tDir(e) {
    return e.split(':')[1] * 0.5 * Math.PI;
}
// just a lerp function
function lerp(a, b, t) {
    return a * t + b * (1 - t);
}
// RENDERING!!!
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    let i = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (tileImg(grid[i]) != undefined) {
                ctx.save();
                ctx.translate(lerp(x * 32 - scrollx, canvas.width / 2, zoom), lerp(y * -32 + scrolly, canvas.height / 2, zoom) );
                ctx.rotate( tDir( grid[i] ) );
                ctx.drawImage( tileImg(grid[i]), -16 * zoom, -16 * zoom, 32 * zoom, 32 * zoom);
                ctx.restore();
            }
            i++;
        }
    }
}

function tick() {
    render();
    requestAnimationFrame(tick);
}

document.onwheel = function(e) {
    if (e.ctrlKey || e.metaKey) {
        if (zoom < 0.01) {
            zoom += e.deltaY * 0.001;
        } else {
            zoom += e.deltaY * zoom * 0.01;
        }
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

/*document.onmousemove = function(e) {
    const ix = Math.round((e.clientX + scrollx) / 32);
    const iy = Math.round(((- e.clientY) + scrolly) / 32);
    mi = ix + iy * width;
    debugtile = grid[mi];
}*/