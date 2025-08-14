document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('site-header');
  if (!container) return;

  container.innerHTML = `
<header class="site-header">
  <a class="site-title" href="#">Becoming Cummings</a>
</header>
`;

  if (window.initHeader) {
    window.initHeader();
  }
});
