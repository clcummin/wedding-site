function revealMain() {
  const video = document.getElementById("bg-video-container");
  const overlay = document.getElementById("bg-overlay");
  const intro = document.getElementById("intro");

  // Fade out video, overlay, and intro card
  video.classList.add("fade-out");
  overlay.classList.add("fade-out");
  intro.classList.add("fade-out");

  setTimeout(() => {
    if(video) video.remove();
    if(overlay) overlay.remove();
    if(intro) intro.remove();
    document.getElementById("main-content").classList.remove("hidden");
  }, 1000);
}
