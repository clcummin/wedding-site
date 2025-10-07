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

  cards.forEach((card) => {
    const imgEl = card.querySelector("img");
    const bioText = card.dataset.bio;
    let cardBioEl = card.querySelector(".bio");

    if (bioText && !cardBioEl) {
      cardBioEl = document.createElement("p");
      cardBioEl.className = "bio";
      cardBioEl.hidden = true;
      card.appendChild(cardBioEl);
    }

    if (imgEl && cardBioEl) {
      imgEl.addEventListener("click", (event) => {
        event.stopPropagation();
        if (cardBioEl.hidden) {
          cardBioEl.textContent = bioText;
          cardBioEl.hidden = false;
        } else {
          cardBioEl.hidden = true;
        }
      });
    }

    card.addEventListener("click", (event) => {
      if (event.target === imgEl && cardBioEl) {
        return;
      }
      img.src = card.dataset.img;
      img.alt = card.dataset.name;
      nameEl.textContent = card.dataset.name;
      roleEl.textContent = card.dataset.role;
      bioEl.textContent = card.dataset.bio;
      modal.classList.remove("hidden");
    });
  });

  close.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Also close when clicking outside the modal content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});
