
// Requires Tone.js to be included globally
window.addEventListener("DOMContentLoaded", async () => {
  await Tone.start();  // unlock audio on user interaction

  const synth = new Tone.AMSynth().toDestination();
  const loop = new Tone.Loop(time => {
    synth.triggerAttackRelease("C4", "8n", time);
  }, "2s");

  loop.start(0);
  Tone.Transport.start();
});
