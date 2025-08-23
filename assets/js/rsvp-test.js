// assets/js/rsvp-test.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lookup-form');
  const input = document.getElementById('code-input');
  const info = document.getElementById('guest-info');

  if (!form || !input || !info) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = input.value.trim();
    if (!code) return;

    try {
      const response = await fetch('assets/guests.json');
      const guests = await response.json();
      const guest = guests.find((g) => g.code === code);
      if (guest) {
        info.textContent = `Welcome, ${guest.name}!`;
      } else {
        info.textContent = 'Code not found.';
      }
    } catch (err) {
      info.textContent = 'Unable to lookup guest.';
      console.error(err);
    }
  });
});
