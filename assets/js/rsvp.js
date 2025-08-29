// assets/js/rsvp.js
// Handles RSVP code validation and submission via JSONP
'use strict';

let updateSuccessMessage = 'RSVP submitted successfully';

// Exposed globally so the JSONP endpoint can invoke it
window.handleUpdate = function handleUpdate(res) {
  if (!finalMessage) return;

  // Support both flat and nested response shapes (e.g. res.data.message).
  const payload = res && res.data ? res.data : res;
  const ok =
    (res && res.ok) || (res && res.data && res.data.ok);
  const error = payload && payload.error;

  if (error) {
    // Surface friendly messaging for known errors and default to the server text.
    let msg;
    if (error.startsWith('Exception')) {
      msg = 'Something went wrong. Please try again later.';
    } else {
      msg = error;
    }
    finalMessage.textContent = msg;
    finalMessage.classList.remove('hidden');
    return;
  }

  let message = payload && payload.message;
  if (!message && ok) {
    message = updateSuccessMessage;
  }

  if (message) {
    finalMessage.textContent = message;
    finalMessage.classList.remove('hidden');
  }
};

// Exposed globally so the JSONP endpoint can invoke it
window.handleValidate = function handleValidate(res) {
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
    guestsData = rawGuests.slice(0, size);
    while (guestsData.length < size) {
      guestsData.push({
        firstName: '',
        lastName: '',
        guestCode: '',
        attending: 'no',
        meal: '',
      });
    }

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
    const error = payload && payload.error;
    let msg = 'Incorrect code. Please try again.';
    switch (error) {
      case 'Missing code':
        msg = 'Please enter your party code.';
        break;
      case 'Invalid code':
        msg = 'That party code looks invalid.';
        break;
      case 'Not found':
        msg = 'We couldn\u2019t find that code. Check and try again.';
        break;
      default:
        if (error) msg = error;
        break;
    }
    codeError.textContent = msg;
    codeError.classList.remove('hidden');
  }
};

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
    guestCode: g.guestCode,
    attending: 'no',
    meal: '',
  }));
  const url =
    apiBase +
    '?action=update&code=' +
    encodeURIComponent(code) +
    '&rsvped=no' +
    '&guests=' +
    encodeURIComponent(JSON.stringify(guests)) +
    '&callback=handleUpdate';
  return jsonpRequest(url, 'handleUpdate');
}

function rsvpYes(code, guests) {
  const guestPayload = guests.map((g) => ({
    guestCode: g.guestCode,
    attending: g.attending,
    meal: g.meal,
  }));
  const url =
    apiBase +
    '?action=update&code=' +
    encodeURIComponent(code) +
    '&rsvped=yes' +
    '&guests=' +
    encodeURIComponent(JSON.stringify(guestPayload)) +
    '&callback=handleUpdate';
  return jsonpRequest(url, 'handleUpdate');
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
  currentCode = '',
  guestsData = [];

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
    stepAttending.classList.add('hidden');
    updateSuccessMessage = "We'll miss you!";
    finalMessage.textContent = 'Submitting your RSVP...';
    finalMessage.classList.remove('hidden');
    if (currentCode)
      rsvpNo(currentCode).catch(() => {
        finalMessage.textContent =
          'There was a problem saving your RSVP. Please try again.';
      });
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
    stepGuests.classList.add('hidden');
    updateSuccessMessage = 'Thank you for your RSVP!';
    finalMessage.textContent = 'Submitting your RSVP...';
    finalMessage.classList.remove('hidden');
    if (currentCode)
      rsvpYes(currentCode, guestsData).catch(() => {
        finalMessage.textContent =
          'There was a problem saving your RSVP. Please try again.';
      });
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

