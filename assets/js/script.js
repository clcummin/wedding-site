// assets/js/script.js

document.addEventListener('DOMContentLoaded', () => {
  // ── 1) Reserve space for fixed header & toggle "scrolled" on scroll ──
  const header = document.querySelector('.site-header');
  if (header) {
    const updateBodyPadding = () => {
      document.body.style.paddingTop = header.offsetHeight + 'px';
    };
    updateBodyPadding();
    window.addEventListener('resize', updateBodyPadding);
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ── 2) Intro‑card fade‑in + click (only on index.html) ──
  const introCard = document.getElementById('introCard');
  if (introCard) {
    // fade in after 3s
    setTimeout(() => introCard.classList.add('visible'), 3000);

    const introLink = introCard.querySelector('a.intro-card');
    if (introLink) {
      introLink.addEventListener('click', e => {
        e.preventDefault();
        const url = introLink.getAttribute('href');
        document.querySelector('.background-video video')?.classList.add('fade-out');
        document.querySelector('.video-overlay')?.classList.add('fade-out');
        introCard.classList.add('fade-out');
        setTimeout(() => window.location.href = url, 700);
      });
    }
  }

  // ── 3) Countdown ticker (flip clock) ──
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const target = new Date('2026-09-12T00:00:00');
    const digits = [];
    let timer;

    function createDigit() {
      const d = document.createElement('div');
      d.className = 'flip-digit';
      d.innerHTML = '<span class="top">0</span><span class="bottom">0</span>';
      return d;
    }

    function setupClock() {
      countdownEl.classList.add('flip-clock');
      const total = 3 + 2 + 2 + 2; // days, hours, minutes, seconds
      for (let i = 0; i < total; i++) {
        const digit = createDigit();
        digits.push(digit);
        countdownEl.appendChild(digit);
        if (i === 2 || i === 4 || i === 6) {
          const sep = document.createElement('span');
          sep.className = 'separator';
          sep.textContent = ':';
          countdownEl.appendChild(sep);
        }
      }
    }

    function flipTo(digitEl, newNumber) {
      const top = digitEl.querySelector('.top');
      const bottom = digitEl.querySelector('.bottom');
      if (top.textContent === newNumber) return;

      const topFlip = document.createElement('span');
      topFlip.className = 'top-flip';
      topFlip.textContent = top.textContent;

      const bottomFlip = document.createElement('span');
      bottomFlip.className = 'bottom-flip';
      bottomFlip.textContent = newNumber;

      digitEl.appendChild(topFlip);
      digitEl.appendChild(bottomFlip);

      top.textContent = newNumber;
      bottom.textContent = newNumber;

      topFlip.addEventListener('animationend', () => topFlip.remove());
      bottomFlip.addEventListener('animationend', () => bottomFlip.remove());
    }

    function updateClock() {
      const diff = target - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        countdownEl.innerHTML = "It's today!";
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const str =
        days.toString().padStart(3, '0') +
        hours.toString().padStart(2, '0') +
        minutes.toString().padStart(2, '0') +
        seconds.toString().padStart(2, '0');

      str.split('').forEach((num, idx) => {
        flipTo(digits[idx], num);
      });
    }

    setupClock();
    updateClock();
    timer = setInterval(updateClock, 1000);
  }
});
