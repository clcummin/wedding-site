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
    grid.innerHTML = "";
    images.forEach((src, idx) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Photo ${idx + 1}`;
      img.loading = "lazy";
      img.dataset.index = idx;
      grid.appendChild(img);
    });
  }

  // ── Lightbox ──
  let current = 0;
  const lightbox = document.getElementById("lightbox");
  const lightImg = lightbox.querySelector("img");
  const prevBtn = lightbox.querySelector(".prev");
  const nextBtn = lightbox.querySelector(".next");
  const closeBtn = lightbox.querySelector(".close");
  const dotsContainer = lightbox.querySelector(".lightbox-dots");

  function updateDots() {
    dotsContainer.innerHTML = "";
    images.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot" + (i === current ? " active" : "");
      dot.addEventListener("click", () => open(i));
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
  }

  function close() {
    lightbox.classList.add("hidden");
    document.body.classList.remove("no-scroll");
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
    grid.querySelectorAll("img").forEach((img) => {
      img.addEventListener("click", () => {
        // dataset values are strings; explicitly parse base 10
        open(parseInt(img.dataset.index, 10));
      });
    });
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
  }

  init();
});
