// 1s delay then fade in the intro card
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('introCard').classList.add('visible');
  }, 3000);
});

// when the card (<a>) is clicked…
document.querySelector('.intro-card').addEventListener('click', e => {
  e.preventDefault();
  const url = e.currentTarget.getAttribute('href');

  // fade-out video, overlay, intro
  document.querySelector('.background-video video').classList.add('fade-out');
  document.querySelector('.video-overlay').classList.add('fade-out');
  document.getElementById('introCard').classList.add('fade-out');

  // after fade completes, go to home.html
  setTimeout(() => window.location.href = url, 700);
});

// —— COUNTDOWN TICKER ——
(function() {
  const countdownEl = document.getElementById('countdown');
  // Wedding date: Sept 12, 2026 at midnight
  const target = new Date('2026-09-12T00:00:00');

  function update() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      countdownEl.textContent = "It's today!";
      clearInterval(timer);
      return;
    }
    const days    = Math.floor(diff / (1000*60*60*24));
    const hours   = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    countdownEl.textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  update(); // initial populate
  const timer = setInterval(update, 1000);
})();

// assets/js/fix-nav-padding.js
function fixContentPadding() {
  const header = document.querySelector('.site-header');
  const mainContent = document.querySelector('body');
  if (header) {
    mainContent.style.paddingTop = header.offsetHeight + 'px';
  }
}
window.addEventListener('DOMContentLoaded', fixContentPadding);
window.addEventListener('resize', fixContentPadding);
