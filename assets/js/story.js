// assets/js/story.js
'use strict';

document.addEventListener("DOMContentLoaded", () => {
  // ── Orientation hint for mobile portrait ──
  const orientationOverlay = document.getElementById("orientationOverlay");
  const orientationClose = document.getElementById("orientationClose");
  let orientationDismissed = false;

  function checkOrientation() {
    if (!orientationOverlay) return;
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    if (orientationDismissed) return;
    if (isMobile && isPortrait) {
      orientationOverlay.classList.remove("hidden");
    } else {
      orientationOverlay.classList.add("hidden");
    }
  }

  if (orientationClose) {
    orientationClose.addEventListener("click", () => {
      orientationOverlay.classList.add("hidden");
      orientationDismissed = true;
    });
  }

  window.addEventListener("orientationchange", checkOrientation);
  window.addEventListener("resize", checkOrientation);
  checkOrientation();

  // ── Flipbook setup ──
  // 1) Grab the flipbook container
  const flipbook = document.getElementById("flipbook");
  if (!flipbook) return; // nothing to do if it's not on this page

  // 2) Collect all the pages
  const pages = Array.from(flipbook.querySelectorAll(".page"));
  if (!pages.length) return;

  // 3) Remove the preload class so pages can become visible
  flipbook.classList.remove("preload");

  // 4) Determine if we should show single pages on small screens
  let singlePage = window.matchMedia("(max-width: 700px)").matches;

  function handleResize() {
    const nowSingle = window.matchMedia("(max-width: 700px)").matches;
    if (nowSingle !== singlePage) {
      window.location.reload();
    }
  }

  window.addEventListener("orientationchange", handleResize);
  window.addEventListener("resize", handleResize);
  let index = 0; // page index or spread index
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");

  function show(n) {
    pages.forEach((p, i) => {
      if (singlePage) {
        p.style.display = i === n ? "flex" : "none";
      } else {
        p.style.display = i === n * 2 || i === n * 2 + 1 ? "flex" : "none";
      }
    });
    if (prev) prev.style.display = n === 0 ? "none" : "";
    if (next) {
      const atEnd = singlePage
        ? n >= pages.length - 1
        : (n + 1) * 2 >= pages.length;
      next.style.display = atEnd ? "none" : "";
    }
  }

  if (prev)
    prev.addEventListener("click", (e) => {
      e.preventDefault();
      if (index > 0) show(--index);
    });

  if (next)
    next.addEventListener("click", (e) => {
      e.preventDefault();
      if (singlePage) {
        if (index < pages.length - 1) show(++index);
      } else if ((index + 1) * 2 < pages.length) {
        show(++index);
      }
    });

  show(index);
});
