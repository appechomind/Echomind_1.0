function initFractal() {
  const canvas = document.getElementById('fractalBg');
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let t = 0;
  function drawFractal() {
    let w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < 200; i++) {
      let x = w/2 + Math.sin(i * 0.1 + t) * i * 0.8;
      let y = h/2 + Math.cos(i * 0.1 + t) * i * 0.8;
      
      ctx.fillStyle = `hsla(${(t * 50 + i * 2) % 360}, 100%, ${30 + i % 50}%, 0.5)`;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    
    t += 0.01;
    requestAnimationFrame(drawFractal);
  }
  
  drawFractal();
}

window.addEventListener('load', initFractal);
