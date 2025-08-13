// assets/js/attack-surfaces.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('attack-form');
  const nameInput = document.getElementById('surface-name');
  const descInput = document.getElementById('surface-description');

  if (!form || !nameInput || !descInput) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();
    if (!name || !desc) return;

    // Use native Streamline helper if available
    if (window.streamline && typeof window.streamline.addTableRow === 'function') {
      window.streamline.addTableRow('attack-table', [name, desc]);
    } else {
      // Fallback to basic DOM manipulation
      const tableBody = document.querySelector('#attack-table tbody');
      if (!tableBody) return;
      const row = document.createElement('tr');
      row.innerHTML = `<td>${name}</td><td>${desc}</td>`;
      tableBody.appendChild(row);
    }

    form.reset();
    nameInput.focus();
  });
});
