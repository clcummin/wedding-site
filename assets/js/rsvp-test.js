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
        form.style.display = 'none';
        renderPartyForm(guest);
      } else {
        info.textContent = 'Code not found.';
      }
    } catch (err) {
      info.textContent = 'Unable to lookup guest.';
      console.error(err);
    }
  });

  function renderPartyForm(guest) {
    info.innerHTML = `<h2>Welcome, ${guest.name}!</h2>`;

    const container = document.createElement('div');
    container.id = 'party-form';
    const size = guest.partySize || 1;

    if (size > 1) {
      const applyBtn = document.createElement('button');
      applyBtn.type = 'button';
      applyBtn.id = 'apply-all';
      applyBtn.textContent = 'Copy Guest 1 selections to all';
      container.appendChild(applyBtn);
    }

    for (let i = 0; i < size; i++) {
      const personDiv = document.createElement('fieldset');
      personDiv.className = 'guest';
      personDiv.innerHTML = `
        <legend>Guest ${i + 1}</legend>
        <label><input type="checkbox" name="guest${i}-ceremony"> Ceremony</label>
        <label><input type="checkbox" name="guest${i}-reception"> Reception</label>
        <label><input type="checkbox" name="guest${i}-farewell"> Farewell</label>
        <label>Meal:
          <select name="guest${i}-meal">
            <option value="">Select</option>
            <option>Chicken</option>
            <option>Beef</option>
            <option>Veg</option>
          </select>
        </label>
      `;
      container.appendChild(personDiv);
    }

    info.appendChild(container);

    const applyAll = container.querySelector('#apply-all');
    if (applyAll) {
      applyAll.addEventListener('click', () => {
        const first = container.querySelector('.guest');
        if (!first) return;
        const ceremony = first.querySelector(`input[name="guest0-ceremony"]`).checked;
        const reception = first.querySelector(`input[name="guest0-reception"]`).checked;
        const farewell = first.querySelector(`input[name="guest0-farewell"]`).checked;
        const meal = first.querySelector(`select[name="guest0-meal"]`).value;

        for (let i = 1; i < size; i++) {
          container.querySelector(`input[name="guest${i}-ceremony"]`).checked = ceremony;
          container.querySelector(`input[name="guest${i}-reception"]`).checked = reception;
          container.querySelector(`input[name="guest${i}-farewell"]`).checked = farewell;
          container.querySelector(`select[name="guest${i}-meal"]`).value = meal;
        }
      });
    }
  }
});
