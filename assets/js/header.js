// assets/js/header.js
// Dynamically builds the navigation header used across the site
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('site-header');
  if (!container) return;

  const navLinks = [
    { href: 'our-story.html', text: 'Our Story' },
    { href: 'events.html', text: 'Events' },
    { href: 'dress_code.html', text: 'Dress Code' },
    { href: 'wedding-party.html', text: 'Wedding Party' },
    { href: 'registry.html', text: 'Registry' },
    { href: 'travel.html', text: 'Travel' },
    { href: 'gallery.html', text: 'Gallery' },
    { href: 'rsvp.html', text: 'RSVP' },
    { href: 'faqs.html', text: 'FAQs' },
  ];

  const header = document.createElement('header');
  header.className = 'site-header';

  const title = document.createElement('a');
  title.className = 'site-title';
  title.href = 'home.html';
  title.textContent = 'Becoming Cummings';
  header.appendChild(title);

  const nav = document.createElement('nav');
  nav.className = 'main-nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const ul = document.createElement('ul');
  ul.setAttribute('role', 'menubar');

  navLinks.forEach((link) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'none');

    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    a.setAttribute('role', 'menuitem');

    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  header.appendChild(nav);

  container.appendChild(header);

  const navItems = Array.from(ul.querySelectorAll('a'));
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navItems.forEach((link) => {
    const linkTarget = link.getAttribute('href');
    if (linkTarget === currentPage) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('is-current');
    }
  });

  // Provide roving-focus arrow key navigation for keyboard users.
  if (navItems.length > 1) {
    navItems.forEach((link) => {
      link.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
          return;
        }

        event.preventDefault();
        const currentIndex = navItems.indexOf(event.currentTarget);
        if (currentIndex === -1) return;

        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (currentIndex + direction + navItems.length) % navItems.length;
        navItems[nextIndex].focus();
      });
    });
  }

  // header markup is now in the DOM; run shared header behaviors
  if (window.initHeader) {
    window.initHeader();
  }
});

