// assets/js/rsvp.js
'use strict';

function handleUpdate(res) {
  if (!finalMessage) return;

  // Support both flat and nested response shapes (e.g. res.data.message).
  const payload = res && res.data ? res.data : res;
  const ok =
    (res && res.ok) || (res && res.data && res.data.ok);

  let message = payload && payload.message;
  if (!message && ok) {
    message = 'RSVP submitted successfully';
  }

  if (message) {
    finalMessage.textContent = message;
    finalMessage.classList.remove('hidden');
  }
}

function handleValidate(res) {
  // Support both flat and nested response shapes.
  const ok =
    (res && res.ok) || (res && res.data && res.data.ok);
  const payload = res && res.data ? res.data : res;
  const rawGuests = Array.isArray(payload && payload.guests)
    ? payload.guests
    : [];
  const size =
    parseInt(payload && payload.partySize, 10) || rawGuests.length;
  const name = payload && payload.partyName;

  if (ok && size > 0) {
    codeError.classList.add('hidden');
    stepCode.classList.add('hidden');
    stepAttending.classList.remove('hidden');
    partySize = size;
    guestsData = rawGuests.slice(0, size);
    while (guestsData.length < size) {
      guestsData.push({
        firstName: '',
        lastName: '',
        attending: 'no',
        meal: '',
      });
    }
    partyName = name || '';

    if (welcomeMessage) {
      if (name) {
        welcomeMessage.textContent = `We found your record. Welcome, ${name}`;
      } else {
        welcomeMessage.textContent = 'We found your record.';
      }
      welcomeMessage.classList.remove('hidden');
    }

    partyNameMessage.textContent = name
      ? `Is ${name}'s party attending?`
      : 'Is your party attending?';
  } else {
    codeError.classList.remove('hidden');
  }
}

const apiBase =
  'https://script.google.com/macros/s/AKfycbxWH3YLiS4PGTM8wMGEqZMgrqzAT1DjvmpB6ejmDYhEP5TitSxoVP1A5rHhR-584n7XbA/exec';

function jsonpRequest(url, callbackName, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const original = window[callbackName];

    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      window[callbackName] = original;
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('timeout'));
    }, timeout);

    window[callbackName] = function (...args) {
      clearTimeout(timer);
      cleanup();
      if (typeof original === 'function') original(...args);
      resolve(...args);
    };

    script.onerror = () => {
      clearTimeout(timer);
      cleanup();
      reject(new Error('error'));
    };

    script.src = url;
    document.body.appendChild(script);
  });
}

function validateCode(code) {
  const url =
    apiBase +
    '?action=validate&code=' +
    encodeURIComponent(code) +
    '&callback=handleValidate';
  return jsonpRequest(url, 'handleValidate').catch(() => {
    codeError.textContent = 'Request failed. Please try again.';
    codeError.classList.remove('hidden');
  }).finally(() => {
    if (codeStatus) codeStatus.classList.add('hidden');
  });
}

function rsvpNo(code) {
  const guests = guestsData.map((g) => ({
    ...g,
    attending: 'no',
    meal: '',
  }));
  const url =
    apiBase +
    '?action=update&code=' +
    encodeURIComponent(code) +
    '&rsvped=no' +
    '&partyName=' +
    encodeURIComponent(partyName) +
    '&partySize=' +
    guests.length +
    '&guests=' +
    encodeURIComponent(JSON.stringify(guests)) +
    '&callback=handleUpdate';
  return jsonpRequest(url, 'handleUpdate').catch(() => {
    finalMessage.textContent =
      'There was a problem saving your RSVP. Please try again.';
    finalMessage.classList.remove('hidden');
  });
}

function rsvpYes(code, guests) {
  const url =
    apiBase +
    '?action=update&code=' +
    encodeURIComponent(code) +
    '&rsvped=yes' +
    '&partyName=' +
    encodeURIComponent(partyName) +
    '&partySize=' +
    guests.length +
    '&guests=' +
    encodeURIComponent(JSON.stringify(guests)) +
    '&callback=handleUpdate';
  return jsonpRequest(url, 'handleUpdate').catch(() => {
    finalMessage.textContent =
      'There was a problem saving your RSVP. Please try again.';
    finalMessage.classList.remove('hidden');
  });
}

let stepCode,
  stepAttending,
  stepGuests,
  guestCards,
  codeError,
  codeStatus,
  mealError,
  finalMessage,
  partyNameMessage,
  welcomeMessage,
  codeSubmit,
  codeForm,
  codeInput,
  partySize = 0,
  currentCode = '',
  guestsData = [],
  partyName = '';

document.addEventListener('DOMContentLoaded', () => {
  stepCode = document.getElementById('step-code');
  stepAttending = document.getElementById('step-attending');
  stepGuests = document.getElementById('step-guests');
  guestCards = document.getElementById('guest-cards');
  codeError = document.getElementById('code-error');
  codeStatus = document.getElementById('code-status');
  mealError = document.getElementById('meal-error');
  finalMessage = document.getElementById('final-message');
  partyNameMessage = document.getElementById('party-name-message');
  welcomeMessage = document.getElementById('welcome-message');
  codeSubmit = document.getElementById('code-submit');
  codeForm = document.getElementById('code-form');
  codeInput = document.getElementById('code-input');

  codeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = codeInput.value.trim();
    currentCode = code;
    codeError.classList.add('hidden');

    if (!code) {
      codeError.textContent = 'Invite code is required.';
      codeError.classList.remove('hidden');
      return;
    }

    if (!/^[A-Za-z0-9-]+$/.test(code)) {
      codeError.textContent = 'Invalid code format.';
      codeError.classList.remove('hidden');
      return;
    }

    codeSubmit.disabled = true;
    if (codeStatus) {
      codeStatus.textContent = 'Looking up record...';
      codeStatus.classList.remove('hidden');
    }
    validateCode(code).finally(() => {
      codeSubmit.disabled = false;
    });
  });

  document.getElementById('party-no').addEventListener('click', () => {
    if (currentCode) rsvpNo(currentCode);
    stepAttending.classList.add('hidden');
    finalMessage.textContent = "We'll miss you!";
    finalMessage.classList.remove('hidden');
  });

  document.getElementById('party-yes').addEventListener('click', () => {
    stepAttending.classList.add('hidden');
    generateGuestCards(guestsData);
    stepGuests.classList.remove('hidden');
  });

  guestCards.addEventListener('change', (e) => {
    if (e.target.classList.contains('attending')) {
      const mealSelect = e.target
        .closest('.guest-card')
        .querySelector('.meal');
      mealSelect.disabled = !e.target.checked;
      if (!e.target.checked) mealSelect.value = '';
    }
  });

  stepGuests.addEventListener('submit', (e) => {
    e.preventDefault();
    const cards = guestCards.querySelectorAll('.guest-card');
    const updatedGuests = [];
    let valid = true;
    cards.forEach((card, idx) => {
      const attending = card.querySelector('.attending').checked;
      const meal = card.querySelector('.meal').value;
      if (attending && !meal) valid = false;
      updatedGuests.push({
        ...guestsData[idx],
        attending: attending ? 'yes' : 'no',
        meal: attending ? meal : '',
      });
    });
    const anyAttending = updatedGuests.some((g) => g.attending === 'yes');
    if (!anyAttending) {
      mealError.textContent = 'Please select at least one guest to attend.';
      mealError.classList.remove('hidden');
      return;
    }
    if (!valid) {
      mealError.textContent = 'Every attending guest must choose a meal.';
      mealError.classList.remove('hidden');
      return;
    }
    mealError.classList.add('hidden');
    guestsData = updatedGuests;
    if (currentCode) rsvpYes(currentCode, guestsData);
    stepGuests.classList.add('hidden');
    finalMessage.textContent = 'Thank you for your RSVP!';
    finalMessage.classList.remove('hidden');
  });
});

function generateGuestCards(guests) {
  guestCards.textContent = '';
  guests.forEach((guest, idx) => {
    const card = document.createElement('div');
    card.className = 'guest-card';
    const attending = guest.attending === 'yes';
    const displayName =
      guest.firstName || guest.lastName
        ? `${guest.firstName} ${guest.lastName}`.trim()
        : `Guest ${idx + 1}`;

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'attending';
    checkbox.checked = attending;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${displayName}`));

    const select = document.createElement('select');
    select.className = 'meal';
    if (!attending) select.disabled = true;

    const options = [
      { value: '', text: 'Select meal' },
      { value: 'chicken', text: 'Chicken' },
      { value: 'beef', text: 'Beef' },
      { value: 'veg', text: 'Vegetarian' },
    ];

    options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.text;
      if (guest.meal === opt.value) option.selected = true;
      select.appendChild(option);
    });

    card.appendChild(label);
    card.appendChild(select);
    guestCards.appendChild(card);
  });
}

