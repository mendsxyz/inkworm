//scripts/profile
import { getToday, getFutureDate, notify, setLoading, tabGroup } from './helpers.js';

// GET_LOCAL_DATA 
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
      profileInfoParameters.heightRange.dataset.selected === '' ||
      profileInfoParameters.skinType.dataset.selected === '' ||
      profileInfoParameters.personality.dataset.selected === '' ||
      profileInfoParameters.location.dataset.selected === '' ||
      profileInfoParameters.educationLevel.dataset.selected === '' ||
      profileInfoParameters.profession.dataset.selected === ''
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
          method: "GET",
        }
      );
      
      if (!checkRes.ok) {
        throw new Error(`HTTP error! Status: ${checkRes.status}`);
      }
      
      const checkData = await checkRes.json();
      
      // NAME_CHANGE_COOLDOWN_PERIOD
      if (checkData.exists) {
        if (profileInfoParameters.name.value !== checkData.user.name) {
          if (profileInfoParameters.name.value === '') return;
          
          const todayFormatted = getToday();
          
          const lastNameChangeDateStr = String(checkData.user.last_name_change);
          
          if (!lastNameChangeDateStr) return;
          const y = parseInt(lastNameChangeDateStr.slice(0, 4));
          const m = parseInt(lastNameChangeDateStr.slice(4, 6)) - 1;
          const d = parseInt(lastNameChangeDateStr.slice(6, 8));
          
          const lastChangeDate = new Date(y, m, d);
          
          const cooldownEndDate = new Date(lastChangeDate);
          cooldownEndDate.setDate(cooldownEndDate.getDate() + 14);
          
          if (new Date() >= cooldownEndDate) {
            profileInfoParameters.name.disabled = false;
          } else {
            const y = cooldownEndDate.getFullYear();
            const m = String(cooldownEndDate.getMonth() + 1).padStart(2, '0'); // Add 1 because getMonth() is 0-indexed
            const d = String(cooldownEndDate.getDate()).padStart(2, '0');
            
            const formattedCooldownEndDate = `${y}/${m}/${d}`;
            
            notify(
              "Toast", "Auto-dismiss",
              `<span class="icon filled">check_circle</span>`,
              `You will be able to change your name after ${formattedCooldownEndDate}`,
              null, null, null, false, null, null, 10000
            );
          }
        } else {
          const formData = new FormData();
          formData.append("email", savedEmailId);
          formData.append("last_name_change", getFutureDate(0));
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
        }
      }
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