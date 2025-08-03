// assets/js/party.js
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

  // also close if clicking outside content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});
