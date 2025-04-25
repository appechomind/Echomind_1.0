
import { trick as appetite } from '../plugins/plugin.appetite.js';
import { trick as mindreader } from '../plugins/plugin.mindreader.js';

const allTricks = [appetite, mindreader];

document.addEventListener('DOMContentLoaded', () => {
  const trickContainer = document.getElementById('trickContainer');
  if (!trickContainer) return;

  const enabled = JSON.parse(localStorage.getItem('enabledTricks') || '[]');

  const activeTricks = allTricks.filter(t => enabled.includes(t.name));

  if (activeTricks.length === 0) {
    trickContainer.innerHTML = '<p style="color: white; text-align:center; font-size: 1.5em;">No tricks enabled.<br>Visit the Admin Panel to turn them on.</p>';
    return;
  }

  activeTricks.forEach(trick => {
    const btn = document.createElement('button');
    btn.textContent = trick.name;
    btn.style = 'display:block;margin:15px auto;padding:10px 20px;font-size:1.2em;';
    btn.onclick = () => trick.start();
    trickContainer.appendChild(btn);
  });
});
