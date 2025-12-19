// assets/js/party.js
// Handles modal popups for each member of the wedding party
'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".party-card");
  const modal = document.getElementById("partyModal");
  const img = document.getElementById("modalImg");
  const nameEl = document.getElementById("modalName");
  const roleEl = document.getElementById("modalRole");
  const bioEl = document.getElementById("modalBio");
  const close = modal?.querySelector(".modal-close");
  const prevBtn = modal?.querySelector(".modal-nav.prev");
  const nextBtn = modal?.querySelector(".modal-nav.next");
  const proposalToggle = document.querySelector(".proposal-toggle");
  const proposalWrapper = document.getElementById("proposalVideo");
  const body = document.body;
  const focusableSelector = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "iframe",
    "object",
    "embed",
    "[tabindex]:not([tabindex='-1'])",
    "[contenteditable='true']",
  ].join(",");

  if (!modal || !cards.length || !img || !nameEl || !roleEl || !bioEl || !close) return;

  modal.setAttribute("aria-hidden", "true");

  const orderedCards = Array.from(cards);
  let currentIndex = 0;
  let lastFocusedElement = null;
  let focusableElements = [];

  function refreshFocusableElements() {
    if (modal.classList.contains("hidden")) {
      focusableElements = [];
      return;
    }
    focusableElements = Array.from(modal.querySelectorAll(focusableSelector)).filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );
  }

  function showMember(index) {
    const card = orderedCards[index];
    if (!card) return;

    const imgSrc = card.dataset.img || "assets/images/attire.png";
    const name = card.dataset.name || "Wedding Party Member";
    const role = card.dataset.role || "Celebrating with us";
    const bio = card.dataset.bio || "More details about this member will be shared soon.";

    img.src = imgSrc;
    img.alt = name;
    nameEl.textContent = name;
    roleEl.textContent = role;
    bioEl.textContent = bio;
  }

  function openModal(index) {
    currentIndex = index;
    showMember(currentIndex);
    modal.classList.remove("hidden");
    body.classList.add("no-scroll");
    modal.setAttribute("aria-hidden", "false");
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    refreshFocusableElements();
    close.focus();
  }

  function closeModal() {
    modal.classList.add("hidden");
    body.classList.remove("no-scroll");
    modal.setAttribute("aria-hidden", "true");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % orderedCards.length;
    showMember(currentIndex);
  }

  function showPrevious() {
    currentIndex = (currentIndex - 1 + orderedCards.length) % orderedCards.length;
    showMember(currentIndex);
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      openModal(index);
    });
  });

  close.addEventListener("click", closeModal);

  // Also close when clicking outside the modal content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  prevBtn?.addEventListener("click", () => {
    showPrevious();
  });

  nextBtn?.addEventListener("click", () => {
    showNext();
  });

  document.addEventListener("keydown", (event) => {
    if (modal.classList.contains("hidden")) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    } else if (event.key === "Tab") {
      if (!focusableElements.length) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !modal.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !modal.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  proposalToggle?.addEventListener("click", () => {
    const isExpanded = proposalToggle.getAttribute("aria-expanded") === "true";
    proposalToggle.setAttribute("aria-expanded", String(!isExpanded));
    proposalToggle.textContent = isExpanded
      ? "Show bridal proposal video"
      : "Hide bridal proposal video";

    if (!isExpanded) {
      proposalWrapper?.removeAttribute("hidden");
      proposalWrapper?.classList.remove("collapsed");
    } else {
      proposalWrapper?.setAttribute("hidden", "");
      proposalWrapper?.classList.add("collapsed");
    }
  });
});
