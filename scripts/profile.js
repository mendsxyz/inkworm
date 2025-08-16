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
    avatar: updateProfileForm.querySelector('#user-avatar'),
    name: updateProfileForm.querySelector('#user-name'),
    phone: updateProfileForm.querySelector('#user-phone'),
    age: updateProfileForm.querySelector('#user-age'),
    gender: updateProfileForm.querySelector('#user-gender'),
    sexualTrait: updateProfileForm.querySelector('#user-sexual-trait'),
    heightRange: updateProfileForm.querySelector('#user-height'),
    skinType: updateProfileForm.querySelector('#user-skin-type'),
    personality: updateProfileForm.querySelector('#user-personality'),
    location: updateProfileForm.querySelector('#user-location'),
    educationLevel: updateProfileForm.querySelector('#user-education-level'),
    profession: updateProfileForm.querySelector('#user-profession'),
    mobilityStatus: updateProfileForm.querySelector('#user-mobility-status')
  }
  
  updateProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(updateProfileBtn, true);
    
    try {
      const formData = new FormData();
      formData.append("avatar", profileInfoParameters.avatar.src);
      formData.append("age", profileInfoParameters.age.textContent.trim());
      formData.append("gender", profileInfoParameters.gender.textContent.trim());
      formData.append("sexual_trait", profileInfoParameters.sexualTrait.textContent.trim());
      formData.append("height", profileInfoParameters.height.textContent.trim());
      formData.append("skin_type", profileInfoParameters.skinType.textContent.trim());
      formData.append("personality", profileInfoParameters.personality.textContent.trim());
      formData.append("location", profileInfoParameters.location.textContent.trim());
      formData.append("education_level", profileInfoParameters.educationLevel.textContent.trim());
      formData.append("profession", profileInfoParameters.profession.textContent.trim());
      formData.append("mobility_status", profileInfoParameters.mobilityStatus.textContent.trim());
      
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxMFdY_PIWkpjhCk-U35O_hxBlfXNR8oSCpnxxm32s3TgBuPftU4IXhWdkAxweYq1Ee-g/exec",
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      
      notify(
        "Toast", "Auto-dismiss",
        `<span class="icon filled">check_circle</span>`,
        `Profile info updated successfully!`,
        null, null, null, false, null, null, 10000
      );
      
      setTimeout(() => location.reload(), 3000);
    } catch (err) {
      notify(
        "Popup", "Dismissible", null, null,
        `<span class="icon filled">error</span>`,
        `${err}`,
        "Sorry, we're unable to update your profile info at the moment. Please try again later",
        true, { close: "Got it", cta: null },
        () => {},
        () => {
          document.querySelector('.notification')?.remove();
        }
      );
    } finally {
      setLoading(updateProfileBtn, false);
    }
  });
}

// CHATBAR
const chatTabGroupEl = document.querySelector('.user_chat-tab-group');

document.querySelectorAll('.chat-tab-btn')?.forEach(btn => {
  btn.addEventListener('click', () => tabGroup(btn, chatTabGroupEl));
});