import { setLoading } from './helpers.js';

const signupForm = document.querySelector('.signup-form');
const signupBtn = document.querySelector('.signup-btn');

const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx8VMeTzCtQ-GRH9-vkkzCDmVvFe0JPVGnajyUf1wNhM-kShyACVNeWxNBTE6rUBnyn/exec'; // replace this

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoading(signupBtn, true);

  const email = signupForm.querySelector('#set-email').value.trim();
  const password = signupForm.querySelector('#set-password').value;

  try {
    const res = await fetch(SHEET_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();

    if (result.status === 'success') {
      alert('Signup successful! Check email for verification');
      signupForm.reset();
    } else {
      alert('Signup failed: ' + result.message);
    }

  } catch (err) {
    alert('Signup failed: Network error');
  } finally {
    setLoading(signupBtn, false);
  }
});