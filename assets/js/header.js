// Retired wedding navigation. Legacy pages remain accessible only by direct URL.
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('site-header');
  if (!container) return;
  const header = document.createElement('header');
  header.className = 'site-header';
  const title = document.createElement('a');
  title.className = 'site-title';
  title.href = 'index.html';
  title.textContent = 'Lorraine & Christopher';
  header.appendChild(title);
  container.appendChild(header);
});
