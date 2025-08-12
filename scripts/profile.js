//scripts/profile
import { setLoading } from './helpers.js';

const updateProfileForm = document.querySelector('.user-profile-update-form');
const updateProfileBtn = document.querySelector('.user-update-profile-btn');

updateProfileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoading(updateProfileBtn, true);
});