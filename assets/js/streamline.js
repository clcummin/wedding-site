// assets/js/streamline.js
// Minimal helper to provide a native-style API for dynamic tables.
// If a more complete Streamline library is present, this file can be removed.

window.streamline = window.streamline || {};

/**
 * Adds a row to a table by id using the provided array of cell values.
 * @param {string} tableId - id attribute of the table element
 * @param {string[]} cells - array of cell text contents
 */
window.streamline.addTableRow = function (tableId, cells) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody') || table;
  const row = document.createElement('tr');
  cells.forEach((text) => {
    const td = document.createElement('td');
    td.textContent = text;
    row.appendChild(td);
  });
  tbody.appendChild(row);
};
