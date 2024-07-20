const params = new URLSearchParams(document.location.search);
let code = params.get('code');
if (!code) {
    const genw = params.get('width');
    const genh = params.get('height');
    if (!(genw && genh)) {
        alert('INVALID URL PARAMATERS!!!');
        document.head.innerHTML = '<title>bruh</title>';
        document.body.innerHTML = 'bruh';
        undefined["haha I caused an error to stop the code from running"];
    }
    let airs = [];
    for (let i = 0; i < genw * genh; i++) {
        airs.push('air:0');
    }
    params.delete('width');
    params.delete('height');
    params.set('code', encode(genw, genh, '', airs));
    history.replaceState(null, null, '?' + params.toString());
    code = params.get('code');
}
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
/**
 * @type {HTMLDivElement}
 */
const menu = document.querySelector('.menu');

let {grid, width, height, title} = decode(code);

// resizing
resize();
onresize = resize;
function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

tick();

// menu
function hidemenu() {
    menu.style.display = 'none';
}
function showmenu() {
    menu.style.display = 'block';
}
function copycode() {
    navigator.clipboard.writeText(params.get('code'));
    alert('Code Copied!');
}

// stuff
function limit(num, min, max) {
    return Math.min(Math.max(min, num), max);
}

let brushid = 0;
let rotation = 0;
let visrot = 0;
let pageid = 0;
let itmimgs = document.querySelectorAll('.invitem');
let pages = document.querySelectorAll('.page');

let pageoffsets = [0];
for (let i = 1; i < pages.length; i++) {
    pageoffsets[i] = pages[i - 1].querySelectorAll('.invitem').length + pageoffsets[i - 1];
}

showpage(0);
function showpage(pagetoshow) {
    for (let i = 0; i < pages.length; i++) {
        if (i === pagetoshow) {
            pages[i].style.display = 'block';
        } else {
            pages[i].style.display = 'none';
        }
    }
}
for (let i = 0; i < itmimgs.length; i++) {
    itmimgs[i].onclick = ()=>{
        brushid = i + 1;
        lightup(brushid);
    };
}
document.onkeydown = e => {
    if (/[1-9]/.test(e.key)) {
        brushid = Number(e.key) + pageoffsets[pageid];
        lightup(brushid);
    }
    if (e.key === 'q') {
        rotation--;
        visrot -= 90;
        rotatem(rotation);
    }
    if (e.key === 'e') {
        rotation++;
        visrot += 90;
        rotatem(rotation);
    }
    if (e.key === 'q' || e.key === 'e') {
        if (rotation > 3) {
            rotation = 0;
        }
        if (rotation < 0) {
            rotation = 3;
        }
    }
    if (e.key === 'z') {
        pageid = limit(pageid - 1, 0, pages.length - 1);
        showpage(pageid);
    }
    if (e.key === 'x') {
        pageid = limit(pageid + 1, 0, pages.length - 1);
        showpage(pageid);
    }
    if (e.key === 'Escape') {
        if (menu.style.display === 'block') {
            hidemenu();
        } else {
            showmenu();
        }
    }
};
lightup(brushid);
function lightup(id) {
    for (let i = 0; i < itmimgs.length; i++) {
        if (i + 1 === id) {
            itmimgs[i].style.filter = '';
        } else {
            itmimgs[i].style.filter = 'brightness(50%)';
        }
    }
}
function rotatem(rot) {
    itmimgs.forEach(e=>{
        e.style.transform = `rotate(${visrot}deg)`;
    });
}

function updateCode() {
    params.set('code', encode(width, height, title, grid));
    history.replaceState(null, null, '?' + params.toString());
}

let mousedown = false;
let mousebtn = 0;

const breaksfx = new Audio('sounds/break.wav');
breaksfx.volume = 0.5;

canvas.onmousedown = e=>{mousedown = true; mousebtn = e.button; place(e);};
document.onmouseup = ()=>{mousedown = false; updateCode();};
document.onmousemove = place;
function place(e) {
    if (!mousedown) {return;}
    const ix = Math.round((lerp(e.clientX, canvas.width / 2, 1 / zoom) + scrollx) / 32);
    const iy = Math.round((-lerp(e.clientY, canvas.height / 2, 1 / zoom) + scrolly) / 32);
    if (ix < 0 || ix >= width || iy < 0 || iy >= height) {return;}
    const mi = ix + iy * width;
    if (mousebtn === 2) {
        if (grid[mi] != cells[0] + ':0') {
            grid[mi] = cells[0] + ':0';
            breaksfx.load();
            breaksfx.play();
        }
    } else if (mousebtn === 0 && cells[brushid]) {
        if (grid[mi] != cells[brushid] + ':' + rotation) {
            grid[mi] = cells[brushid] + ':' + rotation;
            new Audio('sounds/place.wav').play();
        }
    }
}