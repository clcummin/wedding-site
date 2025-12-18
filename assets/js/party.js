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
  const close = modal.querySelector(".modal-close");
  const proposalToggle = document.querySelector(".proposal-toggle");
  const proposalWrapper = document.getElementById("proposalVideo");
  const proposalVideo = proposalWrapper?.querySelector("video");

  const orderedCards = Array.from(cards);
  let currentIndex = 0;

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
    modal.classList.remove("hidden");
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
      currentIndex = index;
      showMember(currentIndex);
    });
  });

  close.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Also close when clicking outside the modal content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // Swipe navigation for modal content
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 40;

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < swipeThreshold) return;
    if (distance < 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  modal.addEventListener("touchstart", handleTouchStart, { passive: true });
  modal.addEventListener("touchend", handleTouchEnd, { passive: true });

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
      proposalVideo?.pause();
    }
  });
});
