const params = new URLSearchParams(document.location.search);
const code = params.get('code');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const titleElement = document.getElementById('title');
let grid = [];
let width, height;
let title;
const numKey = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$%&+=?^/#".split('');
const numKey2 = ".!',({)}".split('');
const numKey2Value = [72, 288, 216, 144, 2880, 28800, 288000,  2880000];
let scrollx = 0, scrolly = 0;
let d;
let di;
let zoom = 100;
//let debugtile;
//let mi;
decode(code);

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

function decode(dcode) {
    const s = dcode.split(';');
    d = s[3];
    if (s[0] != 'MP1') {
        alert('Invalid Code! Only MP1 codes are accepted');
        return false;
    }
    width = lengththing2(s[1]);
    height = lengththing2(s[2]);
    title = s[4];
    if (title) {
        titleElement.innerHTML = title;
    }
    di = 0;

    //alert(lengththing(1));

    while (di < d.length) {
        let letter2add;
        if (d.charAt(di) == '.') {
            di++;
            letter2add = '.' + d.charAt(di);
        } else {
            letter2add = d.charAt(di);
        }
        if (d.charAt(di) == '-') {
            if(d.charAt(di + 1) == ':') {
                const length = lengththing(2) + 1;
                for (let i2 = 0; i2 < length; i2++) {
                    grid.push('');
                }
                di += 3;
            } else {
                grid.push('');
                di++;
            }
        } else if(d.charAt(di + 1) == ':') {
            const length = lengththing(2) + 1;
            for (let i2 = 0; i2 < length; i2++) {
                grid.push(letter2add);
            }
            di += 3;
        } else if(d.charAt(di) == ':') {
            const length = lengththing(1);
            for (let i2 = 0; i2 < length; i2++) {
                grid.push('');
            }
            di += 2;
        } else {
            grid.push(letter2add);
            di++;
        }
    }

    console.log(grid);
}

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

function lengththing(dif) {
    let letter = d.charAt(di + dif);
    let length = 0;
    while (numKey2.includes(letter)) {
        length += numKey2Value[numKey2.indexOf(letter)];
        di++;
        letter = d.charAt(di + dif);
        if (di > d.length) {
            console.log('Overload error at the lengththing function :(');
            return false;
        }
    }
    length += num(letter);
    console.log(length);
    return length;
}

function lengththing2(input) {
    let i = 0;
    input = input.toString();
    let letter = input.charAt(i);
    let length = 0;
    while (numKey2.includes(letter)) {
        length += numKey2Value[numKey2.indexOf(letter)];
        i++;
        letter = input.charAt(i);
        if (i > input.length) {
            console.log('Overload error at the lengththing2 function :(');
            return false;
        }
    }
    length += num(letter);
    console.log(length);
    return length;
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