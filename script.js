// Lock scroll on intro page
document.documentElement.style.overflow = "hidden";
document.body.style.overflow = "hidden";
document.body.style.height = "100vh";

// Fade in the card after 1 second
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.getElementById('introCard').classList.add('visible');
  }, 1000);
});
