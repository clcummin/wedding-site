// assets/js/rsvp-test.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lookup-form');
  const input = document.getElementById('code-input');
  const info = document.getElementById('guest-info');
  const apiUrl =
    'https://script.google.com/macros/s/AKfycbxWH3YLiS4PGTM8wMGEqZMgrqzAT1DjvmpB6ejmDYhEP5TitSxoVP1A5rHhR-584n7XbA/exec';

  if (!form || !input || !info) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = input.value.trim();
    if (!code) return;

    info.textContent = 'Looking up...';

    try {
      const response = await fetch(`${apiUrl}?code=${encodeURIComponent(code)}`);
      const result = await response.json();

      if (!result.ok && result.status === 404) {
        info.textContent = result.message || 'Guest not found, please try again.';
        return;
      }

      if (!result.ok) {
        throw new Error(result.message || 'Request failed');
      }

      const party = result.party || result;
      if (!party || !Object.keys(party).length) {
        info.textContent = 'Guest not found, please try again.';
        return;
      }

      showAttendancePrompt(party, code);
    } catch (err) {
      console.error(err);
      info.textContent = 'Unable to lookup guest.';
    }
  });

  function showAttendancePrompt(party, code) {
    const inviteMarkup =
      party.inviteCard || party.invite_card || party.name || 'Guest';

    info.innerHTML = `
      <div class="invite-card">${inviteMarkup}</div>
      <p>Will your party be attending?</p>
      <div class="rsvp-choice">
        <button type="button" id="attend-yes">Accept</button>
        <button type="button" id="attend-no">Decline</button>
      </div>
    `;

    const yesBtn = document.getElementById('attend-yes');
    const noBtn = document.getElementById('attend-no');

    noBtn.addEventListener('click', () => {
      info.innerHTML = "<p>We're sorry you can't make it. Thank you for letting us know!</p>";
    });

    yesBtn.addEventListener('click', () => showGuestForm(party, code));
  }

  function showGuestForm(party, code) {
    const partySize =
      party.partySize ||
      party.party_size ||
      (Array.isArray(party.guests) ? party.guests.length : 1);

    const guestNames = Array.from({ length: partySize }, (_, i) => {
      if (Array.isArray(party.guests) && party.guests[i]) {
        const g = party.guests[i];
        return g.name || g;
      }
      return `Guest ${i + 1}`;
    });

    const formFields = guestNames
      .map(
        (name, i) => `
        <div class="card guest-card">
          <span class="guest-name">${name}</span>
          <label>
            <input type="checkbox" id="guest-attend-${i}" checked />
            Attending
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

    guestNames.forEach((_, i) => {
      const attendBox = document.getElementById(`guest-attend-${i}`);
      const mealSelect = document.getElementById(`guest-meal-${i}`);
      attendBox.addEventListener('change', () => {
        mealSelect.disabled = !attendBox.checked;
        if (!attendBox.checked) mealSelect.value = '';
      });
    });

    document
      .getElementById('party-form')
      .addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const responses = guestNames.map((name, i) => ({
          name,
          attending: document.getElementById(`guest-attend-${i}`).checked,
          meal: document.getElementById(`guest-meal-${i}`).value,
        }));

        info.textContent = 'Submitting...';
        try {
          const submitRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, responses }),
          });
          const submitData = await submitRes.json();

          if (!submitData.ok) {
            info.textContent = submitData.message || 'Submission failed.';
            return;
          }

          info.innerHTML = `
          <p>${submitData.message || 'Thank you for your response!'}</p>
          <pre>${JSON.stringify(submitData, null, 2)}</pre>
        `;
        } catch (error) {
          console.error(error);
          info.textContent = 'Unable to submit response.';
        }
      });
  }
});
