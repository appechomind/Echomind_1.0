
const canvas = document.getElementById('fractalBg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let time = 0;
function drawFractal() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const cx = Math.cos(time * 0.0005) * 0.6;
  const cy = Math.sin(time * 0.0003) * 0.6;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let zx = (x - width / 2) / width * 3;
      let zy = (y - height / 2) / height * 3;
      let i = 0;
      while (zx*zx + zy*zy < 4 && i < 64) {
        let tmp = zx*zx - zy*zy + cx;
        zy = 2.0 * zx * zy + cy;
        zx = tmp;
        i++;
      }
      const p = (y * width + x) * 4;
      data[p] = i * 5;
      data[p + 1] = i * 4;
      data[p + 2] = i * 10;
      data[p + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  time += 1;
  requestAnimationFrame(drawFractal);
}

drawFractal();
