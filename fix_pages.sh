#!/bin/bash

# Create scripts directory if it doesn't exist
mkdir -p tricks/scripts

# Create necessary script files
cat > tricks/scripts/fractal.js << 'EOL'
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
EOL

cat > tricks/scripts/audio.js << 'EOL'
class AudioManager {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await this.context.resume();
    this.initialized = true;
  }

  async playTone(frequency, duration) {
    await this.init();
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.start();
    
    gainNode.gain.setValueAtTime(0.5, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
    }, duration * 1000);
  }
}

window.audioManager = new AudioManager();
EOL

# Template for trick pages
TEMPLATE='<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EchoMind - TITLE</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #0b0b0b;
      overflow-x: hidden;
      font-family: "Segoe UI", system-ui, sans-serif;
      color: white;
      text-align: center;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .back-button {
      position: fixed;
      top: 20px;
      left: 20px;
      color: white;
      text-decoration: none;
      font-size: 1.5em;
      z-index: 10;
      background: rgba(0, 0, 0, 0.5);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid gold;
      transition: all 0.3s ease;
    }
    
    .back-button:hover {
      transform: scale(1.1);
      box-shadow: 0 0 15px #ffe066;
    }
    
    h1 {
      color: gold;
      text-shadow: 0 0 10px gold;
      margin: 40px 0;
      font-size: 2.5em;
    }
    
    canvas#fractalBg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      opacity: 0.5;
    }
  </style>
</head>
<body>
  <a href="../index.html" class="back-button">←</a>
  <h1>TITLE</h1>
  <div class="content">
    <!-- Content will go here -->
  </div>
  <script src="scripts/fractal.js"></script>
  <script src="scripts/audio.js"></script>
</body>
</html>'

# List of pages to fix
PAGES=("phone_effects" "puzzles" "gizmo" "settings" "dont_click" "dual_device" "community")

# Fix each page
for page in "${PAGES[@]}"; do
  echo "Fixing $page.html..."
  echo "$TEMPLATE" | sed "s/TITLE/${page^}/g" > "tricks/$page.html"
done

echo "All pages have been updated with the proper template." 