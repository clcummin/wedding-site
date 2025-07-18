function revealMain() {
  const video = document.getElementById("bg-video-container");
  const overlay = document.getElementById("bg-overlay");

  // Fade out video and overlay
  video.classList.add("fade-out");
  overlay.classList.add("fade-out");

  // Remove video/overlay after fade, show content
  setTimeout(() => {
    if(video) video.remove();
    if(overlay) overlay.remove();
    document.getElementById("main-content").classList.remove("hidden");
  }, 1000);

  // Hide intro button
  document.getElementById("intro").style.display = "none";
}

// Countdown logic
window.onload = function() {
  // Only run on the welcome screen
  if (document.getElementById('countdown')) {
    // Set the wedding date
    const weddingDate = new Date("2026-09-12T00:00:00");
    function updateCountdown() {
      const now = new Date();
      const diff = weddingDate - now;
      if (diff <= 0) {
        document.getElementById('countdown').textContent = "It's Wedding Day!";
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      document.getElementById('countdown').textContent =
        `${days} days, ${hours} hours, ${minutes} minutes to go`;
    }
    updateCountdown();
    setInterval(updateCountdown, 60000); // update every minute
  }
};
