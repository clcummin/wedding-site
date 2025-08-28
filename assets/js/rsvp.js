// assets/js/rsvp.js

function handleUpdate(res) {
  console.log(res);
  const final = document.getElementById('final-message');
  if (final && res && res.message) {
    final.textContent = res.message;
  }
}

const apiBase = 'https://script.google.com/macros/s/AKfycbxWH3YLiS4PGTM8wMGEqZMgrqzAT1DjvmpB6ejmDYhEP5TitSxoVP1A5rHhR-584n7XbA/exe';

function rsvpNo(code) {
  const url =
    apiBase +
    '?action=update&code=' + encodeURIComponent(code) +
    '&rsvped=no' +
    '&callback=handleUpdate';
  const s = document.createElement('script');
  s.src = url;
  document.body.appendChild(s);
}

function rsvpYes(code, num, chicken, beef, vegetarian) {
  const url =
    apiBase +
    '?action=update&code=' + encodeURIComponent(code) +
    '&rsvped=yes' +
    '&number_attending=' + encodeURIComponent(num) +
    '&chicken=' + encodeURIComponent(chicken) +
    '&beef=' + encodeURIComponent(beef) +
    '&vegetarian=' + encodeURIComponent(vegetarian) +
    '&callback=handleUpdate';
  const s = document.createElement('script');
  s.src = url;
  document.body.appendChild(s);
}

document.addEventListener('DOMContentLoaded', () => {
  let guests = [];
  let currentParty = null;
  let currentCode = '';

  fetch('assets/guests.json')
    .then((res) => res.json())
    .then((data) => {
      guests = data;
    });

  const stepCode = document.getElementById('step-code');
  const stepAttending = document.getElementById('step-attending');
  const stepGuests = document.getElementById('step-guests');
  const guestCards = document.getElementById('guest-cards');
  const codeError = document.getElementById('code-error');
  const mealError = document.getElementById('meal-error');
  const finalMessage = document.getElementById('final-message');

  document.getElementById('code-submit').addEventListener('click', () => {
    const input = document.getElementById('code-input');
    const code = input.value.trim();
    currentParty = guests.find((g) => g.code === code);
    if (!currentParty) {
      codeError.classList.remove('hidden');
      return;
    }
    codeError.classList.add('hidden');
    currentCode = code;
    stepCode.classList.add('hidden');
    stepAttending.classList.remove('hidden');
  });

  document.getElementById('party-no').addEventListener('click', () => {
    if (currentCode) rsvpNo(currentCode);
    stepAttending.classList.add('hidden');
    finalMessage.textContent = "We'll miss you!";
    finalMessage.classList.remove('hidden');
  });

  document.getElementById('party-yes').addEventListener('click', () => {
    stepAttending.classList.add('hidden');
    generateGuestCards(currentParty.partySize);
    stepGuests.classList.remove('hidden');
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

  guestCards.addEventListener('change', (e) => {
    if (e.target.classList.contains('attending')) {
      const mealSelect = e.target.closest('.guest-card').querySelector('.meal');
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
    if (!valid || num === 0 || num !== chicken + beef + vegetarian) {
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
