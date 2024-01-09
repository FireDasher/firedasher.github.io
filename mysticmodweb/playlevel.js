const params = new URLSearchParams(document.location.search);
const code = params.get('code');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const titleElement = document.getElementById('title');
const numKey = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$%&+=?^/#".split('');
const numKey2 = ".!',({)}".split('');
const numKey2Value = [72, 288, 216, 144, 2880, 28800, 288000,  2880000];
let scrollx = 0, scrolly = 0;
let zoom = 100;
//let debugtile;
//let mi;
const lvldata = decode(code);
let grid = lvldata.grid;
let width = lvldata.width, height = lvldata.height;
let title = lvldata.title;
if (title) {
    titleElement.innerHTML = title;
}

// images
const cells = ['air', 'generator', 'mover', 'CWspinner', 'CCWspinner', 'push', 'slide', 'enemy', 'trash', 'immobile',
'converter', 'nudge', 'fixed_spinner', 'flipper', 'fall', 'directional', 'teleporter', 'puller', 'void',
'global_converter', 'counter',
'player', 'pac_man', 'input_generator', 'input_enemy', 'denier',
'present', 'random_spinner', 'strange'];

function list(list) {
    let value = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].charAt(0) == '.') {
            let letter = list[i].charAt(1);
            value.push( '.' + numKey[numKey.indexOf(letter) + 1] );
        } else {
            value.push( numKey[numKey.indexOf(list[i]) + 1] );
        }
    }
    return value;
}
const keyRight = ['', '0', 'c', '4', '8', 'k', 'g', 's', 'w', 'o',
'U', 'A', '.g', '.k', '.c', '?', 'Y', '%', '.w',
'.A', '.E',
'E', 'I', '.4', '.0',
'.8', '.I',
'M', 'Q', '.M'];
const keyDown = list(keyRight);
const keyLeft = list(keyDown);
const keyUp = list(keyLeft);
let images = [];
for(let i = 0; i < cells.length; i++) {
    const img = new Image();
    img.src = 'tiles/' + cells[i] + '.png';
    //img.style.imageRendering = 'pixelated';
    images.push(img);
}

// resizing
resize();
window.onresize = resize;
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// get image of tile from tile name
function tileName(tname) {
    return images[cells.indexOf(tname)];
}

function tick() {
    render();
    requestAnimationFrame(tick);
}
tick();

function num(sus) {
    return numKey.indexOf(sus);
}
document.onwheel = function(e) {
    if (e.ctrlKey || e.metaKey) {
        if (zoom < 1) {
            zoom += e.deltaY * 0.1;
        } else {
            zoom += e.deltaY * (zoom / 100);
        }
        if (zoom < 0) {
            zoom = 0;
        }
        if (zoom > 400) {
            zoom = 400;
        }
    } else {
        scrollx += e.deltaX;
        scrolly -= e.deltaY;
    }
}

document.onkeydown = function (e) {
    if (e.key == 'z') {
        zoom = 100;
    }
}

function tile(id) {
    if(keyRight.includes(id)) {
        return images[keyRight.indexOf(id)];
    } else if(keyDown.includes(id)) {
        return images[keyDown.indexOf(id)];
    } else if(keyLeft.includes(id)) {
        return images[keyLeft.indexOf(id)];
    } else if(keyUp.includes(id)) {
        return images[keyUp.indexOf(id)];
    }
}

function rotateTileAmount(id) {
    if(keyRight.includes(id)) {
        return 0;
    } else if(keyDown.includes(id)) {
        return Math.PI * 0.5;
    } else if(keyLeft.includes(id)) {
        return Math.PI;
    } else if(keyUp.includes(id)) {
        return Math.PI * 1.5;
    }
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
            if (tile(grid[i]) != undefined) {
                ctx.save();
                ctx.translate(((x * 32 - scrollx) * zoom / 100) + (1 - zoom / 100) * (canvas.width / 2), ((y * -32 + scrolly) * zoom / 100) + (1 - zoom / 100) * (canvas.height / 2) );
                ctx.rotate( rotateTileAmount( grid[i] ) );
                ctx.drawImage( tile(grid[i]), -16 * (zoom / 100), -16 * (zoom / 100), 32 * (zoom / 100), 32 * (zoom / 100));
                ctx.restore();
            }
            i++;
        }
    }
    //ctx.fillStyle = 'white';
    //ctx.fillText(debugtile + ',' + mi, 10, 10);
}
