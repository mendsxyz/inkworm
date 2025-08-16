//scripts/profile
import { notify, setLoading, tabGroup } from './helpers.js';

// LOCAL_DATA 
const inkwormLocalEnabled = JSON.parse(localStorage.getItem('inkworm-362L0oc18al-7eyn4wlEd')) || [];
const existingData = inkwormLocalEnabled.find(obj => obj.email !== undefined);
const savedEmailId = existingData?.email;

// TAB_GROUPS
const tabGroupEl = document.querySelector('.tab-group');

document.querySelectorAll('.tab-btn')?.forEach(btn => {
  btn.addEventListener('click', () => tabGroup(btn, tabGroupEl));
});

// PROFILE_UPDATE_TAB
const updateProfileForm = document.querySelector('.user-profile-update_form');
const updateProfileBtn = document.querySelector('.user-profile-update_btn');

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
    
    if (profileInfoParameters.age.dataset.selected === '' ||
      profileInfoParameters.gender.dataset.selected === '' ||
      profileInfoParameters.sexualTrait.dataset.selected === '' ||
      profileInfoParameters.heightRange.dataset.selected === '' ||
      profileInfoParameters.personality.dataset.selected === '' ||
      profileInfoParameters.location.dataset.selected === '' ||
      profileInfoParameters.educationLevel.dataset.selected === '' ||
      profileInfoParameters.profession.dataset.selected === '' ||
      profileInfoParameters.mobilityStatus.dataset.selected === ''
    ) {
      notify(
        "Toast", "Auto-dismiss",
        `<span class="icon filled">error</span>`,
        `Some profile info parameters are missing!`,
        null, null, null, false, null, null, 10000
      );
      setLoading(updateProfileBtn, false);
      return;
    }
    
    try {
      const checkRes = await fetch(
        `https://script.google.com/macros/s/AKfycbxMFdY_PIWkpjhCk-U35O_hxBlfXNR8oSCpnxxm32s3TgBuPftU4IXhWdkAxweYq1Ee-g/exec?email=${encodeURIComponent(savedEmailId)}`,
        {
          method: "GET"
        }
      );
      
      if (!checkRes.ok) {
        throw new Error(`HTTP error! Status: ${checkRes.status}`);
      }
      
      const checkData = await checkRes.json();
      
      const formData = new FormData();
      formData.append("email", savedEmailId);
      formData.append("avatar", profileInfoParameters.avatar.src);
      formData.append("age", profileInfoParameters.age.textContent.trim());
      formData.append("gender", profileInfoParameters.gender.textContent.trim());
      formData.append("sexual_trait", profileInfoParameters.sexualTrait.textContent.trim());
      formData.append("height_range", profileInfoParameters.heightRange.textContent.trim());
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
          body: formData
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