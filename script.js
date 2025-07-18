function revealMain() {
  const video = document.getElementById("bg-video-container");
  const overlay = document.getElementById("bg-overlay");

  // Fade out video and overlay
  video.classList.add("fade-out");
  overlay.classList.add("fade-out");

  // Change background color for main-welcome (handled by CSS)
  document.body.style.backgroundColor = "#013b27"; // deep green

  // Remove video/overlay after fade
  setTimeout(() => {
    if(video) video.remove();
    if(overlay) overlay.remove();
    // Show main content after fade
    document.getElementById("main-content").classList.remove("hidden");
  }, 1000);

  // Hide intro button
  document.getElementById("intro").style.display = "none";
}
