function revealMain() {
  const video = document.getElementById("bg-video-container");
  const overlay = document.getElementById("bg-overlay");

  // Trigger fade out
  video.classList.add("fade-out");
  overlay.classList.add("fade-out");

  // Set solid background color (dark emerald green)
  document.body.style.backgroundColor = "#002d1f";

  // Remove video and overlay after fade transition
  setTimeout(() => {
    video.remove();
    overlay.remove();
  }, 1000); // Match CSS transition duration

  // Hide intro and show main content
  document.getElementById("intro").style.display = "none";
  document.getElementById("main-content").classList.remove("hidden");
}
