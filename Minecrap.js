let pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }
let mouseheld = false;
window.onmousedown = function() {mouseheld = true}
window.onmouseup = function() {mouseheld = false}
let mousex, mousey;
let pausedmode = 'default';
let paused = false;

let pos = new THREE.Vector3();
const bgdirt = new Image();
bgdirt.src = 'https://i.pinimg.com/474x/0e/1f/c2/0e1fc2e0638e878d3ba8db495152164c.jpg';

window.onmousemove = function (e) {
    mousex = e.clientX;
    mousey = e.clientY;
}

let z = {
    flying: false,
    onstartmenu: true
};
let held = {
    equals: 0,
    paused: 0,
    mouse: 0
};

// uic stands for user interface canvas
const uic = document.getElementById('ui');
const ui = uic.getContext('2d');
uic.width = window.innerWidth;
uic.height = window.innerHeight;

bgdirt.onload = function() {
    drawstartmenu();
}

window.onresize = function() {
    uic.width = window.innerWidth;
    uic.height = window.innerHeight;
    if (z.onstartmenu) {
        drawstartmenu();
    }
}

function drawstartmenu() {
    ui.drawImage(bgdirt, 0, 0, uic.width, uic.height);
    ui.fillStyle = 'white';
    text('Minecrap', '100px sans-serif', 'center', 125);
    createButton('play', start, 'center', 200, 500, 75, 'cyan', 40, 5);
}

function text(text, font, x, y) {
    ui.font = font;
    if (x == 'center') {
        ui.fillText(text, (uic.width - ui.measureText(text).width)/2, y);
    } else {
        ui.fillText(text, x, y);
    }
}

function createButton(text, action, x, y, width, height, color, size, border) {
    if (x == 'center') {
        x = (uic.width - width)/2;
    }

    ui.fillStyle = 'black';
    ui.fillRect(x, y, width, height);
    ui.fillStyle = color;
    ui.fillRect(x + border, y+border, width - border*2, height - border*2);
    ui.fillStyle = 'black';
    ui.font = size + 'px sans-serif';
    ui.fillText(text, (x + width/2)-ui.measureText(text).width/2, y + height/2 + (size)/4);

    uic.onclick = function(e) {
        if ( (e.clientX > x && e.clientX < x + width) && (e.clientY > y && e.clientY < y + height) && z.onstartmenu ) {
            action();
        }
    }
}

function createTempButton(text, action, x, y, width, height, color, size, border) {
    if (x == 'center') {
        x = (uic.width - width)/2;
    }

    ui.fillStyle = 'black';
    ui.fillRect(x, y, width, height);
    ui.fillStyle = color;
    ui.fillRect(x + border, y+border, width - border*2, height - border*2);
    ui.fillStyle = 'black';
    ui.font = size + 'px sans-serif';
    ui.fillText(text, (x + width/2)-ui.measureText(text).width/2, y + height/2 + size/4);

        if ( (mousex > x && mousex < x + width) && (mousey > y && mousey < y + height) && held.mouse == 1 ) {
            action();
        }
}

function start() {

z.onstartmenu = false;

const speed = 0.2;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
  
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x64ffff);

renderer.domElement.requestPointerLock({unadjustedMovement: true});

window.onresize = function() {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    uic.width = window.innerWidth;
    uic.height = window.innerHeight;
}

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const blue = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
const darkgreen = new THREE.MeshLambertMaterial( {color: 0x007f00} );
const green = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
const red = new THREE.MeshLambertMaterial( {color: 0xff0000} );
const orange = new THREE.MeshLambertMaterial( {color: 0xffa500} );
const bluecube = new THREE.Mesh( geometry, blue );
const greencube = new THREE.Mesh( geometry, green );
const redcube = new THREE.Mesh( geometry, red );
const orangecube = new THREE.Mesh( geometry, orange );
const floorgeometry = new THREE.BoxGeometry( 100, 0.1, 100 );
const floor = new THREE.Mesh( floorgeometry, darkgreen );
scene.add( floor );
scene.add( bluecube );
scene.add( greencube );
scene.add( redcube );
scene.add( orangecube );

bluecube.position.z = -5;
greencube.position.z = 5;
redcube.position.x = -5;
orangecube.position.x = 5;
floor.position.y = -0.5;
pos.y = 2;

//looker
const euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
document.onmousemove = function(e) {
    if (document.pointerLockElement == renderer.domElement && !paused) {
        
        euler.setFromQuaternion( camera.quaternion );
		euler.y -= e.movementX/500;
		euler.x -= e.movementY/500;
        camera.quaternion.setFromEuler( euler );

        //console.log(camera.rotation.x+','+camera.rotation.y +','+camera.rotation.z);
    }
}

const light = new THREE.HemisphereLight(0xFFFFFF, 0x080123, 4);
//light.position.set(2, 10, 5);
scene.add( light );

let textrans = 1;
setTimeout(function() {
    function loop(i) {
        textrans -= 0.02;
        setTimeout(function(){
            if (i > 0) {
                loop( i - 1 );
            }
        },10)
    }
    loop(50);
},3000)

//movement
function animate() {
    requestAnimationFrame(animate);

    paused = document.pointerLockElement != renderer.domElement;

    const vector = new THREE.Vector3();

    if (!paused) {

    if (pressedKeys[87]) {
        vector.setFromMatrixColumn( camera.matrix, 0 );
        vector.crossVectors( camera.up, vector );
        pos.addScaledVector( vector, speed );
    }
    if (pressedKeys[83]) {
        vector.setFromMatrixColumn( camera.matrix, 0 );
        vector.crossVectors( camera.up, vector );
        pos.addScaledVector( vector, -speed );
    }
    if (pressedKeys[65]) {
        vector.setFromMatrixColumn( camera.matrix, 0 );
        pos.addScaledVector( vector, -speed );
    }
    if (pressedKeys[68]) {
        vector.setFromMatrixColumn( camera.matrix, 0 );
        pos.addScaledVector( vector, speed );
    }
    if (z.flying) {
        if (pressedKeys[32]) {
            pos.y += speed;
        }
        if (pressedKeys[16]) {
            pos.y -= speed;
        }
    }

    }

    camera.position.x = pos.x;
    camera.position.y = pos.y;
    camera.position.z = pos.z;
    renderer.render(scene, camera);

    ui.clearRect( 0, 0, uic.width, uic.height );
    if (textrans > 0) {
        ui.font = '40px serif';
        ui.fillStyle = 'orange';
        ui.globalAlpha = textrans;
        ui.fillText('Press esc to pause and veiw controls, click to activate mouse', 10, uic.height - 20);
    }

    ui.globalAlpha = 1;
    ui.fillStyle = 'black';

    ui.font = '15px serif';
    //ui.fillText(held.paused, 7, 15);

    if (paused) {
        held.paused += 1;

        ui.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ui.fillRect(10, 10, uic.width - 20, uic.height - 20);

        if (pausedmode == 'default') {
            ui.fillStyle = 'white';
        
            text('Paused', '40px sans-serif', 'center', 75);
            createTempButton('resume', function(){
                renderer.domElement.requestPointerLock();
            }, 'center', 100, uic.width - 40, 50, 'lightgray', 20, 2.5);
            createTempButton('controls', function(){
                pausedmode = 'controls';
                held.mouse = 99;
            }, 'center', 160, uic.width - 40, 50, 'lightgray', 20, 2.5);
            createTempButton('quit', function(){window.close();}, 'center', 220, uic.width - 40, 50, 'lightgray', 20, 2.5);
        }
        if (pausedmode == 'controls') {
            ui.fillStyle = 'white';
        
            text('Controls', '40px sans-serif', 'center', 75);
            text('WASD to move, Space/Shift to fly up/down, = to toggle flight.', '20px sans-serif', 'center', 125)
            createTempButton('back', function(){
                pausedmode = 'default';
            }, 'center', 175, uic.width - 40, 50, 'lightgray', 20, 2.5);
        }
    } else {
        held.paused = 0;
    }

    if (held.paused == 1) {
        pausedmode = 'default';
    }

    if (pressedKeys[187]) {
        held.equals += 1;
    } else {
        held.equals = 0;
    }

    if (held.equals == 1) {
        z.flying = !z.flying;
    }

    if (mouseheld) {
        held.mouse += 1;
    } else {
        held.mouse = 0;
    }
}

animate();

}
