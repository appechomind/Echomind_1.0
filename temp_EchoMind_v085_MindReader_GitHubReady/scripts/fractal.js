
// Placeholder for evolving fractal logic
window.addEventListener("load", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "fractalBg";
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-1";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function draw() {
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 50, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.1)`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
});
