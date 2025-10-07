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
    card.addEventListener("click", () => {
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
