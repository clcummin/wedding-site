// assets/js/rsvp-test.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lookup-form');
  const input = document.getElementById('code-input');
  const info = document.getElementById('guest-info');
  const apiUrl = 'https://script.google.com/macros/s/AKfycbxalKHwfwO4gbXgw0isA2r6vt4GxQGg5ODW48McjwSa28Tiu8n-hUiLaSfA427RV8Bg8A/exec';

  if (!form || !input || !info) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = input.value.trim();
    if (!code) return;

    info.textContent = 'Looking up...';

    try {
      const response = await fetch(`${apiUrl}?code=${encodeURIComponent(code)}`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const guest = await response.json();

      if (guest && Object.keys(guest).length) {
        info.innerHTML = `
          <h2>${guest.name || 'Guest'}</h2>
          ${guest.partySize ? `<p>Party size: ${guest.partySize}</p>` : ''}
        `;
      } else {
        info.textContent = 'Code not found.';
      }
    } catch (err) {
      console.error(err);
      info.textContent = 'Unable to lookup guest.';
    }
  });
});
