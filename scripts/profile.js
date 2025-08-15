//scripts/profile
import { setLoading, tabGroup } from './helpers.js';

// TAB_GROUPS
const tabGroupEl = document.querySelector('.tab-group');

document.querySelectorAll('.tab-btn')?.forEach(btn => {
  btn.addEventListener('click', () => tabGroup(btn, tabGroupEl));
});

// PROFILE_UPDATE_TAB
const updateProfileForm = document.querySelector('.user-profile-update-form');
const updateProfileBtn = document.querySelector('.user-update-profile-btn');

if (updateProfileForm) {
  const profileInfoParameters = {
    avatar: updateProfileForm.querySelector('.upload-image-preview'),
    name: updateProfileForm.querySelector('.user_update-name'),
    phone: updateProfileForm.querySelector('.user_update-phone'),
    age: updateProfileForm.querySelector('#set-age'),
    gender: updateProfileForm.querySelector('#set-gender'),
    sexualTrait: updateProfileForm.querySelector('#set-sexual-trait'),
    heightRange: updateProfileForm.querySelector('#set-height'),
    skinType: updateProfileForm.querySelector('#set-skin-type'),
    setPersonality: updateProfileForm.querySelector('#set-personality'),
    setLocation: updateProfileForm.querySelector('#set-location'),
    setEducationLevel: updateProfileForm.querySelector('#set-education-level'),
    setProfession: updateProfileForm.querySelector('#set-profession'),
    setMobilityStatus: updateProfileForm.querySelector('#set-mobility-status')
  }
  
  updateProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(updateProfileBtn, true);
  });
}

// CHATBAR
const chatTabGroupEl = document.querySelector('.user_chat-tab-group');

document.querySelectorAll('.chat-tab-btn')?.forEach(btn => {
  btn.addEventListener('click', () => tabGroup(btn, chatTabGroupEl));
});