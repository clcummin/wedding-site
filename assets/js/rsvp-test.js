// assets/js/rsvp-test.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lookup-form');
  const input = document.getElementById('code-input');
  const info = document.getElementById('guest-info');
  const apiUrl = 'https://script.google.com/macros/s/AKfycbxWH3YLiS4PGTM8wMGEqZMgrqzAT1DjvmpB6ejmDYhEP5TitSxoVP1A5rHhR-584n7XbA/exec';

  if (!form || !input || !info) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = input.value.trim();
    if (!code) return;

    info.textContent = 'Looking up...';

    try {
      const response = await fetch(`${apiUrl}?code=${encodeURIComponent(code)}`);

      if (response.status === 404) {
        info.textContent = 'Guest not found, please try again.';
        return;
      }

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const party = await response.json();
      if (!party || !Object.keys(party).length) {
        info.textContent = 'Guest not found, please try again.';
        return;
      }

      showAttendancePrompt(party);
    } catch (err) {
      console.error(err);
      info.textContent = 'Unable to lookup guest.';
    }
  });

  function showAttendancePrompt(party) {
    info.innerHTML = `
      <h2>${party.name || 'Guest'}</h2>
      <p>Will your party be attending?</p>
      <div class="rsvp-choice">
        <button type="button" id="attend-yes">Accept</button>
        <button type="button" id="attend-no">Decline</button>
      </div>
    `;

    const yesBtn = document.getElementById('attend-yes');
    const noBtn = document.getElementById('attend-no');

    noBtn.addEventListener('click', () => {
      info.innerHTML = '<p>We\'re sorry you can\'t make it. Thank you for letting us know!</p>';
    });

    yesBtn.addEventListener('click', () => showGuestForm(party));
  }

  function showGuestForm(party) {
    const guestNames = Array.isArray(party.guests)
      ? party.guests.map((g) => g.name || g)
      : Array.from({ length: party.partySize || 1 }, (_, i) => `Guest ${i + 1}`);

    const formFields = guestNames
      .map(
        (name, i) => `
        <div class="guest-response">
          <label>
            <input type="checkbox" id="guest-attend-${i}" checked />
            ${name}
          </label>
          <select id="guest-meal-${i}">
            <option value="">Food choice</option>
            <option value="beef">Beef</option>
            <option value="chicken">Chicken</option>
            <option value="vegetarian">Vegetarian</option>
          </select>
        </div>
      `,
      )
      .join('');

    info.innerHTML = `
      <h2>${party.name || 'Guest'}</h2>
      <form id="party-form">
        ${formFields}
        <button type="submit">Submit</button>
      </form>
    `;

    document.getElementById('party-form').addEventListener('submit', (ev) => {
      ev.preventDefault();
      info.innerHTML = '<p>Thank you for your response!</p>';
    });
  }
});
