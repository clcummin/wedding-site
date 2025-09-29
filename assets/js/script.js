// assets/js/script.js
'use strict';

// Initialize the fixed header and keep body content from hiding underneath it
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  // Adjust the body's top padding so the fixed header doesn't overlap content
  const updateBodyPadding = () => {
    document.body.style.paddingTop = header.offsetHeight + "px";
  };
  updateBodyPadding();
  window.addEventListener("resize", updateBodyPadding);

  // Toggle a shadow class once the user scrolls past the top
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  const mainNav = header.querySelector(".main-nav");
  const navList = mainNav?.querySelector("ul");
  if (mainNav && navList) {
    const current = window.location.pathname.split("/").pop();
    navList.querySelectorAll("a").forEach((link) => {
      if (link.getAttribute("href") === current) {
        link.closest("li")?.remove();
      }
    });

    const updateNavScroll = () => {
      const maxScroll = navList.scrollWidth - navList.clientWidth;
      const cur = navList.scrollLeft;
      if (cur > 0) {
        mainNav.classList.add("show-left");
      } else {
        mainNav.classList.remove("show-left");
      }
      if (cur < maxScroll) {
        mainNav.classList.add("show-right");
      } else {
        mainNav.classList.remove("show-right");
      }
    };
    navList.addEventListener("scroll", updateNavScroll);
    window.addEventListener("resize", updateNavScroll);
    updateNavScroll();
  }
}

// Expose the initializer so header.js can call it after injecting markup
window.initHeader = initHeader;

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".site-header")) {
    initHeader();
  }

  // ── Countdown ticker (flip clock) ──
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    try {
      const target = new Date("2026-09-12T00:00:00");
      
      // Validate date
      if (isNaN(target.getTime())) {
        console.error('Invalid wedding date');
        countdownEl.textContent = 'Wedding Date: September 12, 2026';
        return;
      }
      
      const digits = [];
      let timer;

    function createDigit() {
      const d = document.createElement("div");
      d.className = "flip-digit";
      d.textContent = "0";
      return d;
    }

    function setupClock() {
      countdownEl.classList.add("flip-clock");
      const groups = [
        { size: 3, label: "Days" },
        { size: 2, label: "Hours" },
        { size: 2, label: "Minutes" },
        { size: 2, label: "Seconds" },
      ];

      groups.forEach((grp, idx) => {
        const groupEl = document.createElement("div");
        groupEl.className = "flip-group";

        const row = document.createElement("div");
        row.className = "digit-row";
        for (let i = 0; i < grp.size; i++) {
          const digit = createDigit();
          digits.push(digit);
          row.appendChild(digit);
        }
        groupEl.appendChild(row);

        const labelEl = document.createElement("div");
        labelEl.className = "flip-label";
        labelEl.textContent = grp.label;
        groupEl.appendChild(labelEl);

        countdownEl.appendChild(groupEl);

        if (idx < groups.length - 1) {
          const sep = document.createElement("span");
          sep.className = "separator";
          sep.textContent = ":";
          countdownEl.appendChild(sep);
        }
      });
    }

    function flipTo(digitEl, newNumber) {
      if (digitEl.textContent === newNumber) return;
      digitEl.textContent = newNumber;
    }

    function updateClock() {
      const diff = target - Date.now();
      // When the date arrives, show a friendly message and stop ticking
      if (diff <= 0) {
        clearInterval(timer);
        countdownEl.textContent = "It's today!";
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const str =
        days.toString().padStart(3, "0") +
        hours.toString().padStart(2, "0") +
        minutes.toString().padStart(2, "0") +
        seconds.toString().padStart(2, "0");

      str.split("").forEach((num, idx) => {
        flipTo(digits[idx], num);
      });
    }

      setupClock();
      updateClock();
      timer = setInterval(updateClock, 1000);
    } catch (error) {
      console.error('Error initializing countdown:', error);
      countdownEl.textContent = 'Wedding Date: September 12, 2026';
    }
  }

  // ── 5) Expandable venue map ──
  const mapTrigger = document.querySelector(".map-section .map-trigger");
  const mapOverlay = document.getElementById("mapOverlay");
  if (mapTrigger && mapOverlay) {
    const closeBtn = mapOverlay.querySelector(".close");
    const dismiss = () => {
      mapOverlay.classList.add("hidden");
      document.body.classList.remove("no-scroll");
    };
    mapTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      mapOverlay.classList.remove("hidden");
      document.body.classList.add("no-scroll");
    });
    closeBtn?.addEventListener("click", dismiss);
    mapOverlay.addEventListener("click", (e) => {
      if (e.target === mapOverlay) dismiss();
    });
  }
});
