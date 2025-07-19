// 1s delay then fade in the intro card
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('introCard').classList.add('visible');
  }, 1000);
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
