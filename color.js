const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const color = document.querySelector('#color');
const imageLink = document.querySelector('#file');
const text = document.querySelector('p');
const optionElement = document.querySelector('select');
let option;

function reload() {
    text.innerHTML = "Prossesing...";

    option = optionElement.value;
    let image = new Image();
    image.src = URL.createObjectURL(imageLink.files[0]);

    image.onload = function() {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image,0,0);
    effects();
    }
}
function effects() {
    let data;
    for(let x = 0; x < canvas.width; x += 1) {
        for(let y = 0; y < canvas.height; y += 1) {
            data = ctx.getImageData(x,y,1,1).data;

            if (option == 'i') {
                ctx.fillStyle = 'rgba('+ (255 - data[0]) +','+ (255 - data[1]) +','+(255 - data[2]) +','+ data[3] +')';
            } if (option == 'cc') {
                let gray = (data[0]+data[1]+data[2])/3;
                let rgb = hexToRgb(color.value);
                ctx.fillStyle = 'rgba('+ (rgb.r * gray/255) +','+ (rgb.g * gray/255) +','+(rgb.b * gray/255) +','+ data[3] +')';
            } if (option == 't') {
                let gray = (data[0]+data[1]+data[2])/3;
                ctx.fillStyle = 'rgba('+ 0 +','+ 0 +','+ 0 +','+ (1-( gray/255 )) +')';
                //document.writeln('rgba('+ data[0] +','+ data[1] +','+ data[2] +','+ gray +')');
            }
            
            
            ctx.clearRect(x,y,1,1);
            ctx.fillRect(x,y,1,1);
        }
    }

    text.innerHTML = "Done. Save by right clicking the image and click save image as. And/or upload another picture";
}

// not my code below
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
