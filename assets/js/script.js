// assets/js/script.js
'use strict';

const supportsPassiveListeners = (() => {
  try {
    let supported = false;
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supported = true;
        return true;
      },
    });
    const noop = () => {};
    window.addEventListener('testPassive', noop, opts);
    window.removeEventListener('testPassive', noop, opts);
    return supported;
  } catch (error) {
    return false;
  }
})();

const passiveScrollOptions = supportsPassiveListeners ? { passive: true } : false;

// Initialize the fixed header and keep body content from hiding underneath it.
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const setHeaderOffset = () => {
    document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight}px`);
  };
  setHeaderOffset();

  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(setHeaderOffset);
    resizeObserver.observe(header);
  } else {
    window.addEventListener('resize', setHeaderOffset);
  }

  window.addEventListener(
    'scroll',
    () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    },
    passiveScrollOptions,
  );

  const mainNav = header.querySelector('.main-nav');
  const navList = mainNav?.querySelector('ul');
  if (!mainNav || !navList) return;

  const updateNavScroll = () => {
    const maxScroll = navList.scrollWidth - navList.clientWidth;
    const currentScroll = navList.scrollLeft;

    mainNav.classList.toggle('show-left', currentScroll > 0);
    mainNav.classList.toggle('show-right', currentScroll < maxScroll);
  };

  let scheduled = false;
  const scheduleNavUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      updateNavScroll();
    });
  };

  navList.addEventListener('scroll', scheduleNavUpdate, passiveScrollOptions);
  window.addEventListener('resize', scheduleNavUpdate);
  updateNavScroll();
}

function initCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  const targetDate = countdownEl.dataset.targetDate || '2026-09-12T00:00:00';
  const target = new Date(targetDate);

  if (Number.isNaN(target.getTime())) {
    console.error('Invalid wedding date');
    countdownEl.textContent = 'Wedding Date: September 12, 2026';
    return;
  }

  const digits = [];
  let timerId = null;

  const groups = [
    { size: 3, label: 'Days' },
    { size: 2, label: 'Hours' },
    { size: 2, label: 'Minutes' },
    { size: 2, label: 'Seconds' },
  ];

  const createDigit = () => {
    const digit = document.createElement('div');
    digit.className = 'flip-digit';
    digit.textContent = '0';
    return digit;
  };

  const buildClockMarkup = () => {
    countdownEl.classList.add('flip-clock');

    countdownEl.replaceChildren();

    digits.length = 0;

    groups.forEach((group, index) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'flip-group';

      const row = document.createElement('div');
      row.className = 'digit-row';

      for (let i = 0; i < group.size; i += 1) {
        const digit = createDigit();
        digits.push(digit);
        row.appendChild(digit);
      }

      groupEl.appendChild(row);

      const labelEl = document.createElement('div');
      labelEl.className = 'flip-label';
      labelEl.textContent = group.label;
      groupEl.appendChild(labelEl);

      countdownEl.appendChild(groupEl);

      if (index < groups.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'separator';
        separator.textContent = ':';
        countdownEl.appendChild(separator);
      }
    });
  };

  const updateDigits = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      if (timerId) window.clearInterval(timerId);
      countdownEl.textContent = "It's today!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const displayValue =
      days.toString().padStart(3, '0') +
      hours.toString().padStart(2, '0') +
      minutes.toString().padStart(2, '0') +
      seconds.toString().padStart(2, '0');

    displayValue.split('').forEach((value, index) => {
      const digitEl = digits[index];
      if (digitEl && digitEl.textContent !== value) {
        digitEl.textContent = value;
      }
    });
  };

  try {
    buildClockMarkup();
    updateDigits();
    timerId = window.setInterval(() => {
      try {
        updateDigits();
      } catch (error) {
        window.clearInterval(timerId);
        console.error('Error updating countdown', error);
      }
    }, 1000);
  } catch (error) {
    console.error('Error initializing countdown:', error);
    countdownEl.textContent = 'Wedding Date: September 12, 2026';
  }
}

function initMapOverlay() {
  const mapTrigger = document.querySelector('.map-section .map-trigger');
  const mapOverlay = document.getElementById('mapOverlay');
  if (!mapTrigger || !mapOverlay) return;

  const closeBtn = mapOverlay.querySelector('.close');
  let lastFocusedElement = null;

  mapTrigger.setAttribute('aria-expanded', 'false');

  const closeOverlay = () => {
    mapOverlay.classList.add('hidden');
    mapOverlay.setAttribute('aria-hidden', 'true');
    mapTrigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  };

  const openOverlay = (event) => {
    if (event) {
      event.preventDefault();
    }

    lastFocusedElement = document.activeElement;
    mapOverlay.classList.remove('hidden');
    mapOverlay.setAttribute('aria-hidden', 'false');
    mapTrigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    (closeBtn || mapOverlay).focus();
  };

  mapTrigger.addEventListener('click', openOverlay);
  mapTrigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      openOverlay(event);
    }
  });

  closeBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    closeOverlay();
  });

  mapOverlay.addEventListener('click', (event) => {
    if (event.target === mapOverlay) {
      closeOverlay();
    }
  });

  mapOverlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeOverlay();
    }
  });
}

function initMapFallback() {
  const mapEmbed = document.querySelector('.map-section .map-embed');
  const fallback = document.querySelector('.map-section .map-fallback');
  if (!mapEmbed || !fallback) return;

  let hasLoaded = false;
  const revealFallback = () => {
    if (hasLoaded) return;
    fallback.classList.add('is-visible');
  };

  const loadTimeout = window.setTimeout(revealFallback, 4000);

  mapEmbed.addEventListener('load', () => {
    hasLoaded = true;
    fallback.classList.remove('is-visible');
    window.clearTimeout(loadTimeout);
  });

  mapEmbed.addEventListener('error', () => {
    hasLoaded = false;
    window.clearTimeout(loadTimeout);
    revealFallback();
  });
}

// Expose the initializer so header.js can call it after injecting markup.
window.initHeader = initHeader;

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMapOverlay();
  initMapFallback();
});
