// assets/js/rsvp-test.js

function handleUpdate(res) {
  console.log(res);
  const info = document.getElementById('guest-info');
  if (info) {
    info.textContent = res.message || JSON.stringify(res);
  }
}

const apiBase = 'https://script.google.com/macros/s/AKfycbxWH3YLiS4PGTM8wMGEqZMgrqzAT1DjvmpB6ejmDYhEP5TitSxoVP1A5rHhR-584n7XbA/exec';

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
