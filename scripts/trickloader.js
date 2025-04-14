
document.addEventListener('DOMContentLoaded', () => {
  const trickContainer = document.getElementById('trickContainer');
  if (!trickContainer) return;

  const enabled = JSON.parse(localStorage.getItem('enabledTricks') || '[]');

  if (enabled.length === 0) {
    trickContainer.innerHTML = '<p style="color: white; text-align:center; font-size: 1.5em;">No tricks enabled.<br>Visit the Admin Panel to turn them on.</p>';
    return;
  }

  enabled.forEach(name => {
    import(`../plugins/plugin.${name}.js`).then(mod => {
      const btn = document.createElement('button');
      btn.textContent = mod.trick.name;
      btn.style = 'display:block;margin:15px auto;padding:10px 20px;font-size:1.2em;';
      btn.onclick = () => mod.trick.start();
      trickContainer.appendChild(btn);
    }).catch(err => {
      console.error("Failed to load plugin:", name, err);
    });
  });
});
