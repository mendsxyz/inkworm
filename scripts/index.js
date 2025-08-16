//scripts/index
import { calculateAge, toggleTheme, setPageLoading, storageAvailable, notify, setLoading, setActive, toggleSidebar, navTo, switchThumbnails, handleImageUpload, inpSelect, inpDateSelect, inpLocationSelect, popupCard, selectPlan } from './helpers.js';

const pageLoad = document.querySelector('.page-load');
setPageLoading(pageLoad);

if (!storageAvailable()) {
  const messageElement = document.createElement('div');
  messageElement.id = 'localStorage-disabled-prompt';
  messageElement.innerHTML = `
    <div style="padding: 0 2rem 1rem; border: 1px solid #ccc; background-color: #f8f8f8; color: var(--text-light); text-align: center; transition: 0.5s ease;">
      <h3 style="font-size: 1.4em;">LocalStorage is Disabled</h3>
      <p style="line-height: 1.4;">This application requires localStorage access to save your settings. Please enable cookies and site data in your browser settings to continue.</p>
      <button onclick="document.getElementById('localStorage-disabled-prompt').style.display='none';" style="padding: 10px 20px; cursor: pointer;">Got It</button>
    </div>
  `;
  document.body.prepend(messageElement);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('theme-btn')?.addEventListener('click', () => {
    toggleTheme();
  });
  
  document.querySelector('.sidebar-toggle-btn')?.addEventListener('click', () => {
    toggleSidebar('.user-sidebar', false);
    
  });
  
  document.querySelectorAll('.group-el').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(el);
    });
  });
  
  document.querySelectorAll('.link').forEach(el => {
    el.addEventListener('click', () => {
      navTo(el);
    });
  });
  
  // IMAGE_UPLOAD
  document.querySelectorAll("input[type='file'].inp-image").forEach(el => {
    el.addEventListener("change", async function(e) {
      const inpRoot = el.closest(".thumbnail-avatar");
      const base64StringEl = inpRoot.querySelector("#base64Str");
      const imgPreview = inpRoot.querySelector(".upload-image-preview");
      
      const uploadTimeSpinner = `<div class="image-upload loading-spinner"></div>`;
      const resetImgBtn = `<span class="reset-image-upload_btn icon">close</span>`;
      
      // PARSE_UPLOADED_FILE
      const file = e.target.files[0];
      if (!file) return;
      
      imgPreview.style.display = "none";
      inpRoot.insertAdjacentHTML("beforeend", uploadTimeSpinner);
      
      const reader = new FileReader();
      reader.onload = function(e) {
        setImage(e.target.result, imgPreview);
      };
      reader.readAsDataURL(file);
      
      // SEND_TO_CLOUDINARY
      const uploadedUrl = await handleImageUpload(file);
      
      // SET_NEW_URL
      base64StringEl.value = uploadedUrl;
      setImage(uploadedUrl, imgPreview);
      
      inpRoot.querySelector(".image-upload.loading-spinner")?.remove();
      inpRoot.insertAdjacentHTML("beforeend", resetImgBtn);
      imgPreview.style.display = "inherit";
      imgPreview.classList.add("upload-done");
      
      // RESET_AVATAR_UPLOAD
      document.querySelector(".reset-image-upload_btn")?.addEventListener("click", function() {
        inp.value = "";
        imgPreview.style.display = "none";
        imgPreview.classList.remove("upload-done");
        this.remove();
      });
    });
  });
  
  function setImage(content, img) { img.src = content }
  
  // SELECT_INPUT
  document.querySelectorAll('form .inp-select')?.forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('form .inp-select')?.forEach(el => el.classList.remove('active'))
      el.classList.add('active');
      
      document.addEventListener('click', function(e) {
        if (!e.target.matches('.inp-select')) el.classList.remove('active');
      });
      inpSelect(el, true);
    });
  });
  
  document.querySelectorAll('form .inp-date-select')?.forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('form .inp-date-select')?.forEach(el => el.classList.remove('active'))
      el.classList.add('active');
      
      document.addEventListener('click', function(e) {
        if (!e.target.matches('.inp-date-select') &&
          !e.target.matches('.inp-date') &&
          !e.target.matches('.inp-date-value')
        ) el.classList.remove('active');
      });
      inpDateSelect(el, true);
    });
  });
  
  document.querySelectorAll('form .inp-date_set-values-btn')?.forEach(el => {
    el.addEventListener('click', (e) => {
      const inpEl = e.target.closest('.inp-date-select');
      const selectedEl = inpEl.querySelector('.inp-selected-date');
      const birthdayValue = selectedEl?.dataset.selected;
      
      const age = calculateAge(birthdayValue);
      
      if (age !== null) {
        selectedEl.textContent = `${age} years`;
      } else {
        notify(
          "Toast", "Auto-dismiss",
          `<span class="icon filled">error</span>`,
          `Invalid or null birthday format!`,
          null, null, null, false, null, null, 5000
        );
      }
    });
  });
  
  document.querySelectorAll('form .inp-location-select')?.forEach(el => {
    el.addEventListener('click', (e) => {
      document.querySelectorAll('form .inp-location-select')?.forEach(el => el.classList.remove('active'));
      el.classList.add('active');
      
      document.addEventListener('click', function(e) {
        if (!e.target.matches('.inp-location-select') &&
          !e.target.matches('.inp-location-cities') &&
          !e.target.matches('.inp-location')
        ) el.classList.remove('active');
      });
      inpLocationSelect(e.target, '../scripts/profile-states-and-cities.json');
    });
  });
  
  setTimeout(() => {
    setPageLoading(pageLoad, false);
  }, 2000);
  
  setTimeout(() => {
    document.querySelectorAll('.thumbnail-switchable').forEach(container => {
      switchThumbnails(container);
    });
  }, 6000);
  
  const popupCardData = [
  {
    "id": "incoming",
    "content": `
      <div class="user-incoming-signals">
        <span id="card-top" hidden></span>
        <p class="null-text">&lt; -- You will see all incoming signals here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "sent",
    "content": `
      <div class="user-sent-signals">
        <span id="card-top" hidden></span>
        <p class="null-text">&lt; -- You will see all sent out signals here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "incoming-hooks",
    "content": `
      <div class="user-incoming-hooks">
        <span id="card-top" hidden></span>
        <p class="null-text">&lt; -- You will see all incoming hooks here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "sent-hooks",
    "content": `
      <div class="user-sent-hooks">
        <span id="card-top" hidden></span>
        <p class="null-text">&lt; -- You will see all sent hooks here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "matches",
    "content": `
      <div class="user-signal-matches">
        <span id="card-top" hidden></span>
        <p class="null-text">&lt; -- You will see signal matches here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "updates",
    "content": `
      <div class="user-updates">
        <span id="card-top" hidden></span>
        <p class="null-text">&lt; -- You will see all system and product updates here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "subscription",
    "content": `
      <div class="user-subscription">
        <span id="card-top" hidden></span>
        <h3 style="display: flex; align-items: center; gap: 1rem;">
          <span class="icon">info</span>
          <span>You're currently on our <span class="user-subscription-status">Free</span> plan</span>
        </h3>
        <div class="user-subscription-plan-list">
          <div class="user-subscription-plan active thumbnail-fluid h200" data-plan="free">
            <img src="../assets/static/pages/profile/profile-thumbnail-free-plan.png" alt="free_thumbnail">
          </div>
          <div class="user-subscription-plan thumbnail-fluid h200" data-plan="premium">
            <img src="../assets/static/pages/profile/profile-thumbnail-premium-plan.png" alt="premium_thumbnail">
          </div>
        </div>
      </div>
    `
  },
  {
    "id": "account",
    "content": `
      <div class="user-account-settings">
        <span id="card-top" hidden></span>
      </div>
    `
  }];
  
  // TOGGLE_CHATBAR
  document.addEventListener('click', function(e) {
    if (e.target.matches('.user-chatbar') ||
      e.target.matches('.user_chat-tab-group') ||
      e.target.matches('.user_chat-tab-group *')
    ) document.querySelector('.user-chatbar')?.classList.add('active');
    
    if (e.target.matches('.open-chatbar-fab') ||
      e.target.matches('.open-chatbar-fab *') ||
      e.target.matches('.user-chatbar')
    ) document.querySelector('.user-chatbar')?.classList.add('active');
    
    if (e.target.matches('.close-chatbar-btn') ||
      e.target.matches('.close-chatbar-btn *')
    ) document.querySelector('.user-chatbar').classList.remove('active');
  });
  
  document.querySelector('.user-subscription-btn')?.addEventListener('click', function() {
    const popupCardId = this.dataset.popup;
    const popupTitle = this.querySelector('.title').textContent;
    const matchedBody = popupCardData.find(obj => obj.id == popupCardId);
    popupCard(popupCardId, popupTitle, matchedBody.content, true);
    
    // SELECT_PLAN
    document.querySelector('.user-subscription-plan-list')?.addEventListener('click', function(e) {
      const plan = e.target.closest('.user-subscription-plan');
      
      selectPlan(this, plan, plan.dataset.plan, plan.classList.contains('active') ? true : false);
    });
  });
  
  document.querySelectorAll('.user-sidebar-navlink')?.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const popupCardId = btn.dataset.popup;
      const popupTitle = btn.querySelector('.title').textContent;
      const matchedBody = popupCardData.find(obj => obj.id == popupCardId);
      popupCard(popupCardId, popupTitle, matchedBody.content, true);
      
      // SELECT_PLAN
      document.querySelector('.user-subscription-plan-list')?.addEventListener('click', function(e) {
        const plan = e.target.closest('.user-subscription-plan');
        
        selectPlan(this, plan, plan.dataset.plan, plan.classList.contains('active') ? true : false);
      });
    });
  });
  
  document.querySelectorAll('.view-inks-btn')?.forEach(btn => {
    btn.addEventListener('click', () => {
      const userInkCard = btn.nextElementSibling();
      userInkCard.classList.add('active');
    });
  });
  
  // SYNC_USER_INFO
  async function sync() {
    const inkwormLocalEnabled = JSON.parse(localStorage.getItem('inkworm-362L0oc18al-7eyn4wlEd')) || [];
    const data = inkwormLocalEnabled?.find(obj => obj.email != null);
    const email = data?.email ?? 'no@email.record';
    
    if (!email.includes('no@email.record')) {
      try {
        const checkRes = await fetch(
          `https://script.google.com/macros/s/AKfycbxMFdY_PIWkpjhCk-U35O_hxBlfXNR8oSCpnxxm32s3TgBuPftU4IXhWdkAxweYq1Ee-g/exec?email=${encodeURIComponent(email)}`,
          {
            method: 'GET'
          }
        );
        
        if (!checkRes.ok) {
          throw new Error(`HTTP error! Status: ${checkRes.status}`);
        }
        
        const checkData = await checkRes.json();
        
        if (checkData.exists) {
          const userPlan = checkData.user.plan;
          const userName = checkData.user.name;
          const userEmail = checkData.user.email;
          const userPhone = checkData.user.phone;
          const userAge = checkData.user.age;
          const userGender = checkData.user.gender;
          const userSexualTrait = checkData.user.sexual_trait;
          const userHeight = checkData.user.height;
          const userSkinType = checkData.user.skin_type;
          const userPersonality = checkData.user.personality;
          const userLocation = checkData.user.location;
          const userEducationLevel = checkData.user.education_level;
          const userProfession = checkData.user.profession;
          const userMobilityStatus = checkData.user.mobility_status;
          
          // SET_PLAN_STATUS
          const freeStatusOnProfile = `
            <span class="icon">favorite</span>
            <span class="user-subscription-status user-populate-info" data-info="plan">Free</span>
          `;
          
          const premiumStatusOnProfile = `
            <span class="icon filled">favorite</span>
            <span class="user-subscription-status user-populate-info" data-info="plan">Premium</span>
          `;
          
          if (userPlan === 'free') {
            document.querySelector('.user-menu-bar').dataset.plan = 'free';
            document.querySelector('.user-menu-bar').innerHTML = freeStatusOnProfile;
          } else if (userPlan === 'premium') {
            document.querySelector('.user-menu-bar').dataset.plan = 'premium';
            document.querySelector('.user-menu-bar').innerHTML = premiumStatusOnProfile;
          } else {
            document.querySelector('.user-menu-bar').innerHTML = '<p>Plan error</p>';
          }
          
          // POPULATE_ALL_DYNAMIC_USER_INFO
          document.querySelectorAll('.user-populate-info').forEach(el => {
            if (el.dataset.info === 'greeting') el.textContent = `${userName ? 'Hi, ' + userName : 'User'}`;
            
            if (el.id === 'user-name') el.value = `${userName ? userName : ''}`;
            if (el.id === 'user-phone') el.value = `${userPhone ? userPhone : ''}`;
            if (el.id === 'user-age') el.textContent = `${userAge ? userAge : 'YYYY/MM/DD'}`;
            if (el.id === 'user-gender') el.textContent = `${userGender ? userGender : 'Male'}`;
            if (el.id === 'user-sexual-trait') el.textContent = `${userSexualTrait ? userSexualTrait : 'Regular'}`;
            if (el.id === 'user-height') el.textContent = `${userHeight ? userHeight : 'Select height range'}`;
            if (el.id === 'user-skin-type') el.textContent = `${userSkinType ? userSkinType : 'Select skin type'}`;
            if (el.id === 'user-personality') el.textContent = `${userPersonality ? userPersonality : 'Select personality'}`;
            if (el.id === 'user-location') el.textContent = `${userLocation ? userLocation : 'City, State'}`;
            if (el.id === 'user-education-level') el.textContent = `${userEducationLevel ? userEducationLevel : 'Select education level'}`;
            if (el.id === 'user-profession') el.textContent = `${userProfession ? userProfession : 'Select profession'}`;
            if (el.id === 'user-mobility-status') el.textContent = `${userMobilityStatus ? userMobilityStatus : 'Flexible'}`;
            
            const inpFieldGroup = el.closest('.input-field-group');
            if (inpFieldGroup) {
              const inpToPreSelect = inpFieldGroup.querySelectorAll('.inp-option');
              inpToPreSelect.forEach(toSelect => {
                if (toSelect.textContent === el.textContent) toSelect.classList.add('selected');
              });
            }
          });
        }
        
        document.body.style.pointerEvents = 'auto';
      } catch (err) {
        notify(
          "Toast", "Auto-dismiss",
          `<span class="icon filled">error</span>`,
          `Unable to fetch data, logging you out..`,
          null, null, null, false, null, null, 10000
        );
        
        // REACT_TO_ERROR
        document.querySelector('.user-menu-bar').innerHTML = '<p>Plan error</p>';
        
        //document.body.style.pointerEvents = 'none';
      }
    } else {
      notify(
        "Toast", "Auto-dismiss",
        `<span class="icon filled">error</span>`,
        `Unable to fetch data, logging you out..`,
        null, null, null, false, null, null, 5000
      );
      
      // REACT_TO_ERROR
      document.querySelector('.user-menu-bar').innerHTML = '<p>Plan error</p>';
      
      //document.body.style.pointerEvents = 'none';
    }
  }
  sync();
});