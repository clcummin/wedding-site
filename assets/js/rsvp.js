'use strict';

// Utility function to sanitize text input
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>"']/g, function(match) {
    const htmlEscapes = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return htmlEscapes[match];
  });
}

function sanitizeNameValue(value) {
  return sanitizeInput(value);
}

function sanitizeAlcoholSelections(values) {
  const allowed = new Set(alcoholOptionsConfig.map((opt) => opt.value));
  if (!Array.isArray(values)) return [];
  const unique = [];
  values.forEach((val) => {
    if (allowed.has(val) && !unique.includes(val)) {
      unique.push(val);
    }
  });
  return unique.slice(0, 2);
}

function showElement(element) {
  if (!element) return;
  element.classList.remove('hidden');
  element.removeAttribute('hidden');
}

function hideElement(element) {
  if (!element) return;
  element.classList.add('hidden');
  element.setAttribute('hidden', '');
}
// Enhanced validation function
function validateInviteCode(code) {
  const sanitizedCode = sanitizeInput(code);
  
  if (!sanitizedCode) {
    return { valid: false, error: 'Invite code is required.' };
  }
  
  if (sanitizedCode.length < 3 || sanitizedCode.length > 20) {
    return { valid: false, error: 'Code must be between 3 and 20 characters.' };
  }
  
  if (!/^[A-Za-z0-9-]+$/.test(sanitizedCode)) {
    return { valid: false, error: 'Code can only contain letters, numbers, and hyphens.' };
  }
  
  return { valid: true, code: sanitizedCode };
}

// assets/js/rsvp.js
// Handles RSVP code validation and submission via JSONP

let updateSuccessMessage = 'RSVP submitted successfully';
const alcoholOptionsConfig = [
  { value: 'cognac', label: 'Cognac' },
  { value: 'bourbon', label: 'Bourbon' },
  { value: 'tequila', label: 'Tequila' },
  { value: 'beer/wine', label: 'Beer/Wine' },
  { value: 'n/a', label: 'N/A' },
];

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
    showElement(finalMessage);
    return;
  }

  let message = payload && payload.message;
  if (!message && ok) {
    message = updateSuccessMessage;
  }

  if (message) {
    finalMessage.textContent = message;
    showElement(finalMessage);
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
  const alcoholPrefs = sanitizeAlcoholSelections(payload && payload.alcohol);

  if (ok && size > 0) {
    hideElement(codeError);
    hideElement(stepCode);
    showElement(stepAttending);
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
    isEditingNames = false;
    namesEdited = false;
    alcoholSelections = alcoholPrefs;
    setAlcoholSelections(alcoholSelections);
    updateNameEditControls();

    if (welcomeMessage) {
      if (name) {
        // Sanitize the name before displaying
        const safeName = sanitizeInput(name);
        welcomeMessage.textContent = `We found your record. Welcome, ${safeName}`;
      } else {
        welcomeMessage.textContent = 'We found your record.';
      }
      showElement(welcomeMessage);
    }

    // Sanitize party name for display
    const safeName = name ? sanitizeInput(name) : null;
    partyNameMessage.textContent = safeName
      ? `Is ${safeName}'s party attending?`
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
    showElement(codeError);
  }
};

const apiBase =
  'https://script.google.com/macros/s/AKfycbxWH3YLiS4PGTM8wMGEqZMgrqzAT1DjvmpB6ejmDYhEP5TitSxoVP1A5rHhR-584n7XbA/exec';

function jsonpRequest(url, callbackName, timeout = 15000) {
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
    showElement(codeError);
  }).finally(() => {
    if (codeStatus) hideElement(codeStatus);
  });
}

function rsvpNo(code, alcoholPrefs = []) {
  const guests = guestsData.map((g) => ({
    guestCode: g.guestCode,
    attending: 'no',
    meal: '',
  }));
  const alcohol = sanitizeAlcoholSelections(alcoholPrefs);
  const url =
    apiBase +
    '?action=update&code=' +
    encodeURIComponent(code) +
    '&rsvped=no' +
    '&guests=' +
    encodeURIComponent(JSON.stringify(guests)) +
    '&alcohol=' +
    encodeURIComponent(JSON.stringify(alcohol)) +
    '&callback=handleUpdate';
  return jsonpRequest(url, 'handleUpdate');
}

function rsvpYes(code, guests, alcoholPrefs = []) {
  const guestPayload = guests.map((g) => {
    const payload = {
      guestCode: g.guestCode,
      attending: g.attending,
      meal: g.meal,
    };
    if (namesEdited) {
      payload.firstName = g.firstName || '';
      payload.lastName = g.lastName || '';
    }
    return payload;
  });
  const alcohol = sanitizeAlcoholSelections(alcoholPrefs);
  const url =
    apiBase +
    '?action=update&code=' +
    encodeURIComponent(code) +
    '&rsvped=yes' +
    '&guests=' +
    encodeURIComponent(JSON.stringify(guestPayload)) +
    '&alcohol=' +
    encodeURIComponent(JSON.stringify(alcohol)) +
    '&callback=handleUpdate';
  return jsonpRequest(url, 'handleUpdate');
}

function renderAlcoholOptions() {
  if (!alcoholOptions) return;
  alcoholOptions.textContent = '';
  alcoholOptionsConfig.forEach((opt) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'alcohol-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `alcohol-${opt.value.replace(/[^a-z0-9]/gi, '-')}`;
    checkbox.value = opt.value;

    const label = document.createElement('label');
    label.setAttribute('for', checkbox.id);
    label.textContent = opt.label;

    const description = document.createElement('span');
    description.textContent =
      opt.value === 'n/a'
        ? 'Select if you do not have a preference.'
        : 'Add to your party preferences.';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    wrapper.appendChild(description);
    alcoholOptions.appendChild(wrapper);
  });
  setAlcoholSelections(alcoholSelections);
}

function getSelectedAlcoholSelections() {
  if (!alcoholOptions) return [];
  const selectedValues = Array.from(
    alcoholOptions.querySelectorAll('input[type="checkbox"]:checked')
  ).map((input) => input.value);
  return sanitizeAlcoholSelections(selectedValues);
}

function setAlcoholSelections(selections) {
  const sanitized = sanitizeAlcoholSelections(selections);
  alcoholSelections = sanitized;
  if (!alcoholOptions) return;
  const inputs = alcoholOptions.querySelectorAll('input[type="checkbox"]');
  inputs.forEach((input) => {
    input.checked = sanitized.includes(input.value);
  });
}

function updateAlcoholSelections(changedInput) {
  const selected = getSelectedAlcoholSelections();
  if (selected.length > 2) {
    if (changedInput) changedInput.checked = false;
    if (alcoholError) {
      alcoholError.textContent = 'Please select up to two alcohol preferences.';
      showElement(alcoholError);
    }
    return;
  }
  alcoholSelections = selected;
  hideElement(alcoholError);
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
  alcoholOptions,
  alcoholError,
  codeSubmit,
  codeForm,
  codeInput,
  nameEditToggle,
  nameEditNote,
  currentCode = '',
  guestsData = [],
  isEditingNames = false,
  namesEdited = false,
  alcoholSelections = [];

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
  alcoholOptions = document.getElementById('alcohol-options');
  alcoholError = document.getElementById('alcohol-error');
  codeSubmit = document.getElementById('code-submit');
  codeForm = document.getElementById('code-form');
  codeInput = document.getElementById('code-input');
  nameEditToggle = document.getElementById('name-edit-toggle');
  nameEditNote = document.getElementById('name-edit-note');

  updateNameEditControls();
  renderAlcoholOptions();

  if (nameEditToggle) {
    nameEditToggle.addEventListener('click', () => {
      toggleNameEditing();
    });
  }

  codeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = codeInput.value;
    const validation = validateInviteCode(code);
    
    hideElement(codeError);

    if (!validation.valid) {
      codeError.textContent = validation.error;
      showElement(codeError);
      return;
    }

    currentCode = validation.code;
    codeSubmit.disabled = true;
    if (codeStatus) {
      codeStatus.textContent = 'Looking up record...';
      showElement(codeStatus);
    }
    validateCode(code).finally(() => {
      codeSubmit.disabled = false;
    });
  });

  document.getElementById('party-no').addEventListener('click', () => {
    hideElement(stepAttending);
    updateSuccessMessage = "We'll miss you!";
    finalMessage.textContent = 'Submitting your RSVP...';
    showElement(finalMessage);
    if (currentCode)
      rsvpNo(currentCode, alcoholSelections).catch(() => {
        finalMessage.textContent =
          'There was a problem saving your RSVP. Please try again.';
      });
  });

  document.getElementById('party-yes').addEventListener('click', () => {
    hideElement(stepAttending);
    isEditingNames = false;
    namesEdited = false;
    updateNameEditControls();
    generateGuestCards(guestsData);
    setAlcoholSelections(alcoholSelections);
    hideElement(alcoholError);
    showElement(stepGuests);
  });

  if (alcoholOptions) {
    alcoholOptions.addEventListener('change', (e) => {
      if (e.target && e.target.type === 'checkbox') {
        updateAlcoholSelections(e.target);
      }
    });
  }

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
    if (isEditingNames) {
      saveEditedNames();
    }
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
      showElement(mealError);
      return;
    }
    if (!valid) {
      mealError.textContent = 'Every attending guest must choose a meal.';
      showElement(mealError);
      return;
    }
    const selectedAlcohol = getSelectedAlcoholSelections();
    if (!selectedAlcohol.length) {
      if (alcoholError) {
        alcoholError.textContent =
          'Please select up to two alcohol preferences (choose "N/A" if none).';
        showElement(alcoholError);
      }
      return;
    }
    if (selectedAlcohol.length > 2) {
      if (alcoholError) {
        alcoholError.textContent = 'Please select up to two alcohol preferences.';
        showElement(alcoholError);
      }
      return;
    }
    hideElement(alcoholError);
    hideElement(mealError);
    guestsData = updatedGuests;
    alcoholSelections = selectedAlcohol;
    hideElement(stepGuests);
    isEditingNames = false;
    updateNameEditControls();
    updateSuccessMessage = 'Thank you for your RSVP!';
    finalMessage.textContent = 'Submitting your RSVP...';
    showElement(finalMessage);
    if (currentCode)
      rsvpYes(currentCode, guestsData, alcoholSelections).catch(() => {
        finalMessage.textContent =
          'There was a problem saving your RSVP. Please try again.';
      });
  });
});

function updateNameEditControls() {
  if (nameEditToggle) {
    const label = isEditingNames ? 'Save name edits' : 'Edit names';
    nameEditToggle.textContent = label;
    nameEditToggle.setAttribute('aria-pressed', isEditingNames ? 'true' : 'false');
    nameEditToggle.disabled = !guestsData.length;
  }
  if (nameEditNote) {
    if (isEditingNames && guestsData.length) {
      showElement(nameEditNote);
    } else {
      hideElement(nameEditNote);
    }
  }
}

function saveEditedNames() {
  if (!guestCards) return false;
  const cards = guestCards.querySelectorAll('.guest-card');
  let hasChanges = false;
  cards.forEach((card, idx) => {
    const firstInput = card.querySelector('.name-first');
    const lastInput = card.querySelector('.name-last');
    if (!firstInput || !lastInput || !guestsData[idx]) return;
    const sanitizedFirst = sanitizeNameValue(firstInput.value);
    const sanitizedLast = sanitizeNameValue(lastInput.value);
    if ((guestsData[idx].firstName || '') !== sanitizedFirst) {
      hasChanges = true;
    }
    if ((guestsData[idx].lastName || '') !== sanitizedLast) {
      hasChanges = true;
    }
    guestsData[idx] = {
      ...guestsData[idx],
      firstName: sanitizedFirst,
      lastName: sanitizedLast,
    };
    firstInput.value = sanitizedFirst;
    lastInput.value = sanitizedLast;
  });
  if (hasChanges) {
    namesEdited = true;
  }
  return hasChanges;
}

function toggleNameEditing() {
  if (!guestsData.length) return;
  if (!isEditingNames) {
    isEditingNames = true;
    updateNameEditControls();
    generateGuestCards(guestsData);
    const firstInput = guestCards && guestCards.querySelector('.name-first');
    if (firstInput) firstInput.focus();
    return;
  }

  saveEditedNames();
  isEditingNames = false;
  updateNameEditControls();
  generateGuestCards(guestsData);
  if (nameEditToggle) nameEditToggle.focus();
}

function generateGuestCards(guests, editing = isEditingNames) {
  if (!guestCards) return;
  guestCards.textContent = '';
  guests.forEach((guest, idx) => {
    const card = document.createElement('div');
    card.className = 'guest-card';
    const attending = guest.attending === 'yes';
    const displayName =
      guest.firstName || guest.lastName
        ? `${guest.firstName || ''} ${guest.lastName || ''}`.trim()
        : `Guest ${idx + 1}`;

    if (editing) {
      const nameFields = document.createElement('div');
      nameFields.className = 'name-edit-fields';

      const firstWrapper = document.createElement('div');
      firstWrapper.className = 'name-field';
      const firstId = `guest-${idx}-first`;
      const firstLabel = document.createElement('label');
      firstLabel.setAttribute('for', firstId);
      firstLabel.textContent = 'First name';
      const firstInput = document.createElement('input');
      firstInput.type = 'text';
      firstInput.id = firstId;
      firstInput.className = 'name-first';
      firstInput.value = guest.firstName || '';
      firstInput.setAttribute('autocomplete', 'off');
      if (nameEditNote) {
        firstInput.setAttribute('aria-describedby', 'name-edit-note');
      }
      firstWrapper.appendChild(firstLabel);
      firstWrapper.appendChild(firstInput);

      const lastWrapper = document.createElement('div');
      lastWrapper.className = 'name-field';
      const lastId = `guest-${idx}-last`;
      const lastLabel = document.createElement('label');
      lastLabel.setAttribute('for', lastId);
      lastLabel.textContent = 'Last name';
      const lastInput = document.createElement('input');
      lastInput.type = 'text';
      lastInput.id = lastId;
      lastInput.className = 'name-last';
      lastInput.value = guest.lastName || '';
      lastInput.setAttribute('autocomplete', 'off');
      if (nameEditNote) {
        lastInput.setAttribute('aria-describedby', 'name-edit-note');
      }
      lastWrapper.appendChild(lastLabel);
      lastWrapper.appendChild(lastInput);

      nameFields.appendChild(firstWrapper);
      nameFields.appendChild(lastWrapper);
      card.appendChild(nameFields);
    }

    const label = document.createElement('label');
    label.className = 'guest-attendance';
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
      { value: 'med-well beef', text: 'Medium Well Beef' },
      { value: 'med-rare beef', text: 'Medium Rare Beef' },
      { value: 'fish', text: 'Fish' },
      { value: 'vegetarian', text: 'Vegetarian' },
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
