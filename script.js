const panels = [
  "https://via.placeholder.com/800x600?text=Panel+1",
  "https://via.placeholder.com/800x600?text=Panel+2",
  "https://via.placeholder.com/800x600?text=Panel+3",
  "https://via.placeholder.com/800x600?text=Panel+4"
];

let currentIndex = 0;
const panelEl = document.getElementById("comicPanel");
const container = document.getElementById("comicContainer");

container.addEventListener("click", () => {
  panelEl.classList.add("hidden");
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % panels.length;
    panelEl.src = panels[currentIndex];
    panelEl.classList.remove("hidden");
  }, 300);
});
