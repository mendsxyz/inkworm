//scripts/index
import { calculateAge, toggleTheme, setPageLoading, storageAvailable, notify, setLoading, setActive, toggleSidebar, navTo, switchThumbnails, inpSelect, inpDateSelect, popupCard, selectPlan } from './helpers.js';

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
    "id": "Primary",
    "content": `
      <div class="user-primary">
        <a id="top" hidden>top</a>
        <p class="null-text">&lt; -- You will see all incoming signals or matches here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "Sent",
    "content": `
      <div class="user-sent">
        <a id="top" hidden>top</a>
        <p class="null-text">&lt; -- You will see all sent out signals here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "Updates",
    "content": `
      <div class="user-updates">
        <a id="top" hidden>top</a>
        <p class="null-text">&lt; -- You will see all system and product updates here -- &gt;</p>
      </div>
    `
  },
  {
    "id": "Subscription",
    "content": `
      <div class="user-subscription">
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
  }];
  
  document.querySelector('.to-subscription-btn')?.addEventListener('click', function() {
    const title = this.dataset.title;
    const matchedBody = popupCardData.find(obj => obj.id == title);
    popupCard(title, matchedBody.content, true);
    
    // SELECT_PLAN
    document.querySelector('.user-subscription-plan-list')?.addEventListener('click', function(e) {
      const plan = e.target.closest('.user-subscription-plan');
      
      selectPlan(this, plan, plan.dataset.plan, plan.classList.contains('active') ? true : false);
    });
  });
  
  document.querySelectorAll('.user-sidebar-navlink')?.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title;
      const matchedBody = popupCardData.find(obj => obj.id == title);
      popupCard(title, matchedBody.content, true);
      
      // SELECT_PLAN
      document.querySelector('.user-subscription-plan-list')?.addEventListener('click', function(e) {
        const plan = e.target.closest('.user-subscription-plan');
        
        selectPlan(this, plan, plan.dataset.plan, plan.classList.contains('active') ? true : false);
      });
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
          const userName = checkData.user.name;
          const userUID = checkData.user.uid;
          
          document.querySelectorAll('.user-populate-info').forEach(el => {
            if (el.dataset.info === 'greeting') el.textContent = `${userName ? 'Hi, ' + userName : 'User'}`;
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
        
        //document.body.style.pointerEvents = 'none';
      }
    } else {
      notify(
        "Toast", "Auto-dismiss",
        `<span class="icon filled">error</span>`,
        `Unable to fetch data, logging you out..`,
        null, null, null, false, null, null, 5000
      );
      
      //document.body.style.pointerEvents = 'none';
    }
  }
  sync();
});