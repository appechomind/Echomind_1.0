# Create scripts directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "tricks\scripts"

# Create fractal.js
@'
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
'@ | Set-Content -Path "tricks\scripts\fractal.js"

# Create audio.js
@'
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
'@ | Set-Content -Path "tricks\scripts\audio.js"

# Read the template
$template = Get-Content -Path "tricks\template.html" -Raw

# Function to convert string to title case
function ConvertTo-TitleCase {
    param([string]$text)
    $words = $text -split '_'
    $titleCase = foreach($word in $words) {
        $word.Substring(0,1).ToUpper() + $word.Substring(1).ToLower()
    }
    return $titleCase -join ' '
}

# Page specific content
$pageContent = @{
    "phone_effects" = @{
        "title" = "Phone Effects"
        "content" = @'
<div id="trick-content">
  <p>Experience mind-bending effects using your mobile device.</p>
  <div class="controls">
    <button class="button" onclick="startPhoneEffect()">Start Effect</button>
    <button class="button" onclick="calibrateDevice()">Calibrate</button>
  </div>
</div>
<script>
  function startPhoneEffect() {
    showMessage("Starting phone effect...");
    // Add phone-specific effect code here
  }

  function calibrateDevice() {
    showMessage("Calibrating device sensors...");
    // Add calibration code here
  }
</script>
'@
    }
    "puzzles" = @{
        "title" = "Puzzles"
        "content" = @'
<div id="trick-content">
  <p>Test your mind with these mystifying puzzles.</p>
  <div class="puzzle-grid">
    <div class="puzzle-item" onclick="selectPuzzle(1)">Puzzle 1</div>
    <div class="puzzle-item" onclick="selectPuzzle(2)">Puzzle 2</div>
    <div class="puzzle-item" onclick="selectPuzzle(3)">Puzzle 3</div>
  </div>
</div>
<script>
  function selectPuzzle(id) {
    showMessage(`Loading puzzle ${id}...`);
    // Add puzzle loading code here
  }
</script>
<style>
  .puzzle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }
  .puzzle-item {
    padding: 20px;
    border: 1px solid var(--gold);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .puzzle-item:hover {
    background: rgba(255, 215, 0, 0.1);
    transform: translateY(-2px);
  }
</style>
'@
    }
    "gizmo" = @{
        "title" = "Gizmo"
        "content" = @'
<div id="trick-content">
  <p>Control your magical devices.</p>
  <div class="gizmo-controls">
    <button class="button" onclick="connectDevice()">Connect Device</button>
    <button class="button" onclick="testConnection()">Test Connection</button>
  </div>
</div>
<script>
  function connectDevice() {
    showMessage("Searching for nearby devices...");
    // Add device connection code here
  }

  function testConnection() {
    showMessage("Testing connection...");
    // Add connection test code here
  }
</script>
'@
    }
    "settings" = @{
        "title" = "Settings"
        "content" = @'
<div id="trick-content">
  <div class="settings-grid">
    <div class="setting-item">
      <label>Theme</label>
      <select onchange="updateSetting('theme', this.value)">
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
    <div class="setting-item">
      <label>Sound Effects</label>
      <input type="checkbox" onchange="updateSetting('sound', this.checked)" checked>
    </div>
  </div>
</div>
<script>
  function updateSetting(setting, value) {
    showMessage(`Updated ${setting} to ${value}`);
    // Add settings update code here
  }
</script>
<style>
  .settings-grid {
    display: grid;
    gap: 20px;
    text-align: left;
  }
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  }
</style>
'@
    }
    "dont_click" = @{
        "title" = "Don't Click"
        "content" = @'
<div id="trick-content">
  <p>Whatever you do, don't click the button below...</p>
  <button class="button danger" onclick="dontClick()">DO NOT CLICK</button>
</div>
<script>
  function dontClick() {
    showMessage("I told you not to click!");
    // Add mysterious effects here
  }
</script>
<style>
  .danger {
    background: rgba(255, 0, 0, 0.1);
    border-color: #ff0000;
  }
  .danger:hover {
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
  }
</style>
'@
    }
    "dual_device" = @{
        "title" = "Dual Device"
        "content" = @'
<div id="trick-content">
  <p>Connect two devices for synchronized magic.</p>
  <div class="connection-status">Status: Not Connected</div>
  <div class="controls">
    <button class="button" onclick="createRoom()">Create Room</button>
    <button class="button" onclick="joinRoom()">Join Room</button>
  </div>
</div>
<script>
  function createRoom() {
    showMessage("Creating new room...");
    // Add room creation code here
  }

  function joinRoom() {
    showMessage("Enter room code to join...");
    // Add room joining code here
  }
</script>
<style>
  .connection-status {
    padding: 10px;
    margin: 20px 0;
    border: 1px solid var(--gold);
    border-radius: 5px;
  }
</style>
'@
    }
    "community" = @{
        "title" = "Community"
        "content" = @'
<div id="trick-content">
  <p>Connect with other magicians and share your experiences.</p>
  <div class="community-feed">
    <div class="post">Loading community posts...</div>
  </div>
  <button class="button" onclick="createPost()">Create Post</button>
</div>
<script>
  function createPost() {
    showMessage("Opening post creator...");
    // Add post creation code here
  }
</script>
<style>
  .community-feed {
    margin: 20px 0;
    text-align: left;
  }
  .post {
    padding: 15px;
    margin: 10px 0;
    border: 1px solid rgba(255, 215, 0, 0.1);
    border-radius: 5px;
  }
</style>
'@
    }
}

# Fix each page
foreach ($page in $pageContent.Keys) {
    Write-Host "Fixing $page.html..."
    $content = $template -replace "TITLE", $pageContent[$page]["title"]
    $content = $content -replace "<!-- Content will be dynamically loaded here -->", $pageContent[$page]["content"]
    $content | Set-Content -Path "tricks\$page.html"
}

Write-Host "All pages have been updated with the proper template and content." 