//scripts/profile
import { setLoading, tabGroup } from './helpers.js';

const tabGroupEl = document.querySelector('.tab-group');

document.querySelectorAll('.tab-btn')?.forEach(btn => {
  btn.addEventListener('click', () => tabGroup(btn, tabGroupEl));
});

const updateProfileForm = document.querySelector('.user-profile-update-form');
const updateProfileBtn = document.querySelector('.user-update-profile-btn');

updateProfileForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoading(updateProfileBtn, true);
});