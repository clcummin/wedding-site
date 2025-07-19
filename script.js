// 1. Fade‑in the intro card after 1s
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.getElementById('introCard').classList.add('visible');
  }, 1000);
});

// 2. On card click: fade out video & card, then navigate
document.querySelector('.intro-card').addEventListener('click', function(e) {
  e.preventDefault(); // stop immediate navigation
  const targetUrl = this.getAttribute('href');

  // fade out elements
  document.querySelector('.background-video video').classList.add('fade-out');
  document.querySelector('.video-overlay').classList.add('fade-out');
  document.getElementById('introCard').classList.add('fade-out');

  // after fade duration, go to home.html
  setTimeout(function() {
    window.location.href = targetUrl;
  }, 700); // match your CSS transition duration
});
