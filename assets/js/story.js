document.addEventListener('DOMContentLoaded', () => {
  // 1) Grab the flipbook container
  const flipbook = document.getElementById('flipbook');
  if (!flipbook) return;         // nothing to do if it's not on this page

  // 2) Collect all the pages
  const pages = Array.from(flipbook.querySelectorAll('.page'));
  if (!pages.length) return;

  // 3) Remove the preload class so pages can become visible
  flipbook.classList.remove('preload');

  // 4) Show two‑page spreads (0→ pages[0]&pages[1], 1→ pages[2]&pages[3], etc.)
  let spread = 0;
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');

  function showSpread(n) {
    pages.forEach((p, i) => {
      p.style.display = (i === n*2 || i === n*2 + 1) ? 'flex' : 'none';
    });
    if (prev) prev.style.display = n === 0 ? 'none' : '';
    if (next) next.style.display = (n + 1) * 2 >= pages.length ? 'none' : '';
  }
  if (prev) prev.addEventListener('click', e => {
    e.preventDefault();
    if (spread > 0) showSpread(--spread);
  });
  if (next) next.addEventListener('click', e => {
    e.preventDefault();
    if ((spread + 1)*2 < pages.length) showSpread(++spread);
  });

  showSpread(spread);
});
