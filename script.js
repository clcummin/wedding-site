const panels = [
  "https://placehold.co/800x600?text=Panel+1",
  "https://placehold.co/800x600?text=Panel+2",
  "https://placehold.co/800x600?text=Panel+3",
  "https://placehold.co/800x600?text=Panel+4"
];

let currentIndex = 0;
const panelEl = document.getElementById("comicPanel");
const container = document.getElementById("comicContainer");

container.addEventListener("click", () => {
  panelEl.classList.add("page-turning");

  // Change image at halfway point of animation (300ms)
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % panels.length;
    panelEl.src = panels[currentIndex];
  }, 300);

  // Remove animation class after animation completes (600ms)
  setTimeout(() => {
    panelEl.classList.remove("page-turning");
  }, 600);
});
