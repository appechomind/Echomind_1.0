
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".bubble-container");
  const mainBtn = document.querySelector(".bubble-button.main");
  const items = document.querySelectorAll(".bubble-button:not(.main)");

  const radius = 120;
  const angleStep = (2 * Math.PI) / items.length;

  mainBtn.addEventListener("click", () => {
    container.classList.toggle("open");

    items.forEach((btn, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      btn.style.transform = container.classList.contains("open")
        ? `translate(${x}px, ${y}px)`
        : "scale(0)";
    });
  });
});
