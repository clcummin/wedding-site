document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('site-header');
  if (!container) return;

  container.innerHTML = `
<header class="site-header">
  <a class="site-title" href="home.html">Becoming Cummings</a>
  <nav class="main-nav">
    <ul>
      <li><a href="our-story.html">Our Story</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="attire.html">Attire</a></li>
      <li><a href="wedding-party.html">Wedding Party</a></li>
      <li><a href="registry.html">Registry</a></li>
      <li><a href="travel.html">Travel</a></li>
      <li><a href="gallery.html">Gallery</a></li>
      <li><a href="faqs.html">FAQs</a></li>
    </ul>
  </nav>
</header>
`;

  if (window.initHeader) {
    window.initHeader();
  }
});
