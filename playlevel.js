const params = new URLSearchParams(document.location.search);
const code = params.get('code');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const titleElement = document.getElementById('title');

let {grid, width, height, title} = decode(code);
if (title) {
    titleElement.innerHTML = title;
}

// resizing
resize();
onresize = resize;
function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

tick();