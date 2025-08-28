// assets/js/rsvp-test.js

const DEBUG = false;

function handleUpdate(res) {
  if (DEBUG) console.log('handleUpdate response:', res);
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
  if (DEBUG) console.log(res);
  // Support both flat and nested response shapes.
  const ok =
    (res && res.ok) || (res && res.data && res.data.ok);
  const payload = res && res.data ? res.data : res;

  const size = parseInt(payload && payload.partySize, 10);

  if (ok && !Number.isNaN(size) && size > 0) {
    codeError.classList.add('hidden');
    stepCode.classList.add('hidden');
    stepAttending.classList.remove('hidden');
    partySize = size;
  } else {
    codeError.classList.remove('hidden');
  }
}

const apiBase =
  'https://script.google.com/macros/s/AKfycbxWH3YLiS4PGTM8wMGEqZMgrqzAT1DjvmpB6ejmDYhEP5TitSxoVP1A5rHhR-584n7XbA/exec';

function jsonpRequest(url, callbackName, onError, timeout = 5000) {
  const script = document.createElement('script');
  const original = window[callbackName];

  const cleanup = () => {
    if (script.parentNode) script.parentNode.removeChild(script);
    window[callbackName] = original;
  };

  const timer = setTimeout(() => {
    cleanup();
    onError();
  }, timeout);

  window[callbackName] = function (...args) {
    clearTimeout(timer);
    cleanup();
    if (typeof original === 'function') original(...args);
  };

  script.onerror = () => {
    clearTimeout(timer);
    cleanup();
    onError();
  };

  script.src = url;
  document.body.appendChild(script);
}

function validateCode(code) {
  const url =
    apiBase +
    '?action=validate&code=' +
    encodeURIComponent(code);
  fetch(url, { mode: 'cors' })
    .then((res) => res.json())
    .then((data) => handleValidate(data))
    .catch(() => {
      codeError.textContent = 'Request failed. Please try again.';
      codeError.classList.remove('hidden');
    });
}

function rsvpNo(code) {
  const url =
    apiBase +
    '?action=update&code=' +
    encodeURIComponent(code) +
    '&rsvped=no' +
    '&callback=handleUpdate';
  jsonpRequest(url, 'handleUpdate', () => {
    finalMessage.textContent =
      'There was a problem saving your RSVP. Please try again.';
    finalMessage.classList.remove('hidden');
  });
}

function rsvpYes(code, num, chicken, beef, vegetarian) {
  const url =
    apiBase +
    '?action=update&code=' +
    encodeURIComponent(code) +
    '&rsvped=yes' +
    '&number_attending=' +
    encodeURIComponent(num) +
    '&chicken=' +
    encodeURIComponent(chicken) +
    '&beef=' +
    encodeURIComponent(beef) +
    '&vegetarian=' +
    encodeURIComponent(vegetarian) +
    '&callback=handleUpdate';
  jsonpRequest(url, 'handleUpdate', () => {
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
  mealError,
  finalMessage,
  partySize = 0,
  currentCode = '';

document.addEventListener('DOMContentLoaded', () => {
  stepCode = document.getElementById('step-code');
  stepAttending = document.getElementById('step-attending');
  stepGuests = document.getElementById('step-guests');
  guestCards = document.getElementById('guest-cards');
  codeError = document.getElementById('code-error');
  mealError = document.getElementById('meal-error');
  finalMessage = document.getElementById('final-message');

  document.getElementById('code-submit').addEventListener('click', () => {
    const input = document.getElementById('code-input');
    const code = input.value.trim();
    currentCode = code;
    if (/^\d{5}$/.test(code)) {
      codeError.classList.add('hidden');
      validateCode(code);
    } else {
      codeError.classList.remove('hidden');
    }
  });

  document.getElementById('party-no').addEventListener('click', () => {
    if (currentCode) rsvpNo(currentCode);
    stepAttending.classList.add('hidden');
    finalMessage.textContent = "We'll miss you!";
    finalMessage.classList.remove('hidden');
  });

  document.getElementById('party-yes').addEventListener('click', () => {
    stepAttending.classList.add('hidden');
    generateGuestCards(partySize);
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
    let num = 0,
      chicken = 0,
      beef = 0,
      vegetarian = 0,
      valid = true;
    cards.forEach((card) => {
      const attending = card.querySelector('.attending').checked;
      if (attending) {
        num++;
        const meal = card.querySelector('.meal').value;
        if (!meal) valid = false;
        if (meal === 'chicken') chicken++;
        else if (meal === 'beef') beef++;
        else if (meal === 'vegetarian') vegetarian++;
      }
    });
    if (num === 0) {
      mealError.textContent = 'Please select at least one guest to attend.';
      mealError.classList.remove('hidden');
      return;
    }
    if (!valid || num !== chicken + beef + vegetarian) {
      mealError.textContent = 'Every attending guest must choose a meal.';
      mealError.classList.remove('hidden');
      return;
    }
    mealError.classList.add('hidden');
    if (currentCode) rsvpYes(currentCode, num, chicken, beef, vegetarian);
    stepGuests.classList.add('hidden');
    finalMessage.textContent = 'Thank you for your RSVP!';
    finalMessage.classList.remove('hidden');
  });
});

function generateGuestCards(size) {
  guestCards.innerHTML = '';
  for (let i = 1; i <= size; i++) {
    const card = document.createElement('div');
    card.className = 'guest-card';
    card.innerHTML = `
        <label><input type="checkbox" class="attending" checked /> Guest ${i}</label>
        <select class="meal">
          <option value="">Select meal</option>
          <option value="chicken">Chicken</option>
          <option value="beef">Beef</option>
          <option value="vegetarian">Vegetarian</option>
        </select>
      `;
    guestCards.appendChild(card);
  }
}

