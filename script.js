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
