//scripts/signup
import { setLoading } from './helpers.js';

const signupForm = document.querySelector('.signup-form');
const signupBtn = document.querySelector('.signup-btn');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  setLoading(signupBtn, true);

  const email = signupForm.querySelector('#set-email').value.trim();
  const password = signupForm.querySelector('#set-password').value;
  
  
});