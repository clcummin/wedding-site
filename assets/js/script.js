// assets/js/script.js

document.addEventListener('DOMContentLoaded', () => {
  // ── 1) Reserve space for fixed header & toggle "scrolled" on scroll ──
  const header = document.querySelector('.site-header');
  if (header) {
    const updateBodyPadding = () => {
      document.body.style.paddingTop = header.offsetHeight + 'px';
    };
    updateBodyPadding();
    window.addEventListener('resize', updateBodyPadding);
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ── 2) Intro‑card fade‑in + click (only on index.html) ──
  const introCard = document.getElementById('introCard');
  if (introCard) {
    // fade in after 3s
    setTimeout(() => introCard.classList.add('visible'), 3000);

    const introLink = introCard.querySelector('a.intro-card');
    if (introLink) {
      introLink.addEventListener('click', e => {
        e.preventDefault();
        const url = introLink.getAttribute('href');
        document.querySelector('.background-video video')?.classList.add('fade-out');
        document.querySelector('.video-overlay')?.classList.add('fade-out');
        introCard.classList.add('fade-out');
        setTimeout(() => window.location.href = url, 700);
      });
    }
  }

  // ── 3) Countdown ticker (wherever #countdown exists) ──
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const target = new Date('2026-09-12T00:00:00');
    let timer; // declared here so clearInterval(timer) works

    function updateCountdown() {
      const diff = target - Date.now();
      if (diff <= 0) {
        countdownEl.textContent = "It's today!";
        clearInterval(timer);
        return;
      }
      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
  }
});
