// assets/js/header.js
// Dynamically builds the navigation header used across the site
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('site-header');
  if (!container) return;

  const navLinks = [
    { href: 'our-story.html', text: 'Our Story' },
    { href: 'events.html', text: 'Events' },
    { href: 'attire.html', text: 'Attire' },
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
  const ul = document.createElement('ul');
  navLinks.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  header.appendChild(nav);

  container.appendChild(header);

  // header markup is now in the DOM; run shared header behaviors
  if (window.initHeader) {
    window.initHeader();
  }
});

