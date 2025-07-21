// assets/js/script.js

// 1) Helper: keep body padded under your fixed header
function updateBodyPadding() {
  const header = document.querySelector('.site-header');
  if (header) {
    document.body.style.paddingTop = header.offsetHeight + 'px';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // A) Reserve room for the header
  updateBodyPadding();
  window.addEventListener('resize', updateBodyPadding);

  // B) Shrink header when scrolled (optional)
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // C) Intro‑card fade + click (index.html only)
  const introCard = document.getElementById('introCard');
  if (introCard) {
    // fade in after 3s
    setTimeout(() => introCard.classList.add('visible'), 3000);

    // clicking the card transitions to home.html
    const link = introCard.querySelector('a.intro-card');
    if (link) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const url = link.getAttribute('href');
        document.querySelector('.background-video video')?.classList.add('fade-out');
        document.querySelector('.video-overlay')?.classList.add('fade-out');
        introCard.classList.add('fade-out');
        setTimeout(() => window.location.href = url, 700);
      });
    }
  }

  // D) Countdown ticker (wherever #countdown exists)
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const target = new Date('2026-09-12T00:00:00');
    function updateCountdown() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        countdownEl.textContent = "It's today!";
        clearInterval(timer);
        return;
      }
      const days    = Math.floor(diff / (1000*60*60*24));
      const hours   = Math.floor((diff / (1000*60*60)) % 24);
      const minutes = Math.floor((diff / (1000*60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
  }

  // E) Flipbook init + Prev/Next (our-story.html only)
  const $fb = $('#flipbook');
  if ($fb.length) {
    const vw      = $(window).width();
    const pageW   = Math.min(vw * 0.9, 800);
    const pageH   = pageW * 0.66;
    const spreadW = pageW * 2;

    $fb.turn({
      width:        spreadW,
      height:       pageH,
      display:      'double',
      autoCenter:   true,
      gradients:    false,
      elevation:    0,
      duration:     0
    });

    // start on page 2
    $fb.turn('page', 2);

    // Prev / Next buttons
    $('#prevBtn').on('click', e => {
      e.preventDefault();
      $fb.turn('previous');
    });
    $('#nextBtn').on('click', e => {
      e.preventDefault();
      $fb.turn('next');
    });

    // keep it responsive
    $(window).on('resize', () => {
      const vw2 = $(window).width();
      const pW  = Math.min(vw2 * 0.9, 800);
      const pH  = pW * 0.66;
      $fb.turn('size', pW * 2, pH);
    });
  }
});
