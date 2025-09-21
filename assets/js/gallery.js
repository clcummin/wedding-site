// assets/js/gallery.js
// Simple gallery with lightbox and navigation
'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  let images = [];

  // Try to fetch list of images from assets/photos.json
  async function fetchPhotos() {
    try {
      const res = await fetch("assets/photos.json");
      if (!res.ok) return [];
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
      if (Array.isArray(data.photos)) {
        return data.photos;
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  // Default placeholders
  const placeholders = Array.from({ length: 12 }).map(
    (_, i) => `https://via.placeholder.com/600x400?text=Photo+${i + 1}`,
  );

  async function init() {
    const files = await fetchPhotos();
    images = files.length ? files : placeholders;
    renderGrid();
    setupLightbox();
  }

  function renderGrid() {
    // Clear existing content safely
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    images.forEach((src, idx) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-item";
      button.dataset.index = idx;

      const img = document.createElement("img");
      img.src = src;
      img.alt = `Photo ${idx + 1}`;
      img.loading = "lazy";

      button.setAttribute("aria-label", img.alt);
      button.appendChild(img);
      grid.appendChild(button);
    });
  }

  // ── Lightbox ──
  let current = 0;
  let lastFocusedElement = null;
  const lightbox = document.getElementById("lightbox");
  const lightMedia = lightbox.querySelector(".lightbox-media");
  const lightImg = lightMedia.querySelector("img");
  const prevBtn = lightMedia.querySelector(".prev");
  const nextBtn = lightMedia.querySelector(".next");
  const closeBtn = lightbox.querySelector(".close");
  const dotsContainer = lightbox.querySelector(".lightbox-dots");

  lightbox.setAttribute("aria-hidden", "true");

  function updateDots() {
    // Clear existing dots safely
    while (dotsContainer.firstChild) {
      dotsContainer.removeChild(dotsContainer.firstChild);
    }
    images.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot" + (i === current ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `View image ${i + 1}`);
      dot.setAttribute("aria-selected", i === current ? "true" : "false");
      dot.tabIndex = 0;
      dot.addEventListener("click", () => open(i));
      dot.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(i);
        }
      });
      dotsContainer.appendChild(dot);
    });
  }

  function show() {
    lightImg.src = images[current];
    updateDots();
  }

  function open(i) {
    current = i;
    show();
    lightbox.classList.remove("hidden");
    document.body.classList.add("no-scroll");
    lightbox.setAttribute("aria-hidden", "false");
    lastFocusedElement = document.activeElement;
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    lightbox.setAttribute("aria-hidden", "true");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  function next() {
    current = (current + 1) % images.length;
    show();
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
    show();
  }

  function setupLightbox() {
    grid.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        open(parseInt(item.dataset.index, 10));
      });
    });
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (lightbox.classList.contains("hidden")) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  });

  init();
});
