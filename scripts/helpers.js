// scripts/helpers
export function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function generateYears(startYear = 1980) {
  const currentYear = parseInt(getToday().slice(0, 4), 10);
  const years = [];
  for (let y = startYear; y <= currentYear; y++) {
    years.push(y.toString());
  }
  return years;
}

function generateMonths() {
  const months = [];
  for (let m = 1; m <= 12; m++) {
    months.push(String(m).padStart(2, '0'));
  }
  return months;
}

function generateDays(month, year) {
  if (!month || !year) return [];
  month = parseInt(month, 10);
  year = parseInt(year, 10);
  let daysInMonth = 31;
  if ([4, 6, 9, 11].includes(month)) daysInMonth = 30;
  else if (month === 2) daysInMonth = isLeapYear(year) ? 29 : 28;
  
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(String(d).padStart(2, '0'));
  }
  return days;
}

export function calculateAge(birthday) {
  if (!birthday || birthday.length !== 8) return null;
  
  const birthYear = parseInt(birthday.slice(0, 4), 10);
  const birthMonth = parseInt(birthday.slice(4, 6), 10);
  const birthDay = parseInt(birthday.slice(6, 8), 10);
  
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  
  // If birthday hasn't happened in current year
  if (
    today.getMonth() + 1 < birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)
  ) {
    age--;
  }
  return age;
}

export function toggleTheme(themeClass = 'light') {
  document.body.classList.toggle(themeClass);
}

export function setPageLoading(pageLoadEl, isLoading = true) {
  if (!pageLoadEl) return;
  
  if (isLoading) {
    pageLoadEl.classList.add('page-loading');
    pageLoadEl.style.pointerEvents = 'none';
  } else {
    pageLoadEl.classList.remove('page-loading');
    pageLoadEl.style.pointerEvents = 'auto';
  }
}

export function storageAvailable() {
  try {
    const x = '__storage_test__';
    localStorage.setItem(x, x);
    localStorage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge that it's just helpful to know when it's disabled,
      // not a security issue, etc.
      e.code !== 18
    );
  }
}

export function notify(
  type, // "Toast" | "Popup"
  build, // "Dismissible" | "Persistent" | "Auto-dismiss"
  isToastIcon,
  isToastMsg,
  msgIcon,
  msgTitle,
  msgBody,
  hasButtons,
  buttonTexts = { close: "Close", cta: "Okay" },
  runbackFunction = () => {},
  ctaFunction = () => {},
  duration = undefined ?? 5000
) {
  // Remove any existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const wrapper = document.createElement('div');
  wrapper.className = `notification notification-${type.toLowerCase()} notification-${build.toLowerCase()}`;
  
  // Toast
  if (type === 'Toast') {
    wrapper.innerHTML = `
      <div class="toast">
        ${build === 'Auto-dismiss' ? `<div class="toast-progress"></div>` : ''}
        ${isToastIcon ? `<div class="toast-icon">${isToastIcon}</div>` : ''}
        <p class="toast-msg"><strong>${isToastMsg}</strong></p>
        ${
          build === 'Dismissible'
            ? `<button class="toast-close" aria-label="Close">&times;</button>`
            : ''
        }
        ${
          build === 'Persistent' && hasButtons
            ? `<button class="toast-cta">${buttonTexts.cta}</button>`
            : ''
        }
      </div>
    `;
  }
  
  // Popup
  if (type === 'Popup') {
    wrapper.innerHTML = `
      <div class="popup">
        <div class="popup-icon">${msgIcon || ''}</div>
        <h3 class="popup-title">${msgTitle}</h3>
        <p class="popup-body">${msgBody}</p>
        ${
          hasButtons
            ? `<div class="popup-actions">
                 ${build === 'Dismissible' ? `<button class="popup-close">${buttonTexts.close}</button>` : ''}
                 ${buttonTexts.cta !== null ? `<button class="popup-cta">${buttonTexts.cta}</button>` : ''}
               </div>`
            : ''
        }
      </div>
    `;
  }
  
  document.body.appendChild(wrapper);
  
  // Listeners
  if (type === 'Toast') {
    if (build === 'Dismissible') {
      wrapper.querySelector('.toast-close')?.addEventListener('click', () => wrapper.remove());
    }
    
    if (build === 'Persistent' && hasButtons) {
      wrapper.querySelector('.toast-cta')?.addEventListener('click', () => ctaFunction());
    }
    
    if (build === 'Auto-dismiss') {
      const progress = wrapper.querySelector('.toast-progress');
      progress.style.animation = `loadout ${duration}ms linear forwards`;
      setTimeout(() => wrapper.remove(), duration);
    }
  }
  
  if (type === 'Popup') {
    wrapper.querySelector('.popup-cta')?.addEventListener('click', () => ctaFunction());
    wrapper.querySelector('.popup-close')?.addEventListener('click', () => {
      runbackFunction();
      wrapper.remove();
    });
  }
}

export function saveLocally(data1, data2) {
  if (!storageAvailable()) return;
  
  const inkwormLocalEnabled = JSON.parse(localStorage.getItem('inkworm-362L0oc18al-7eyn4wlEd')) || [];
  const existingData = inkwormLocalEnabled.find(obj => obj.email === data1);
  const localData = {
    email: data1,
    uid: data2
  }
  
  if (!existingData) inkwormLocalEnabled.push(localData);
  localStorage.setItem('inkworm-362L0oc18al-7eyn4wlEd', JSON.stringify(inkwormLocalEnabled));
}

export function checkLocallySaved(data1) {
  const inkwormLocalEnabled = JSON.parse(localStorage.getItem('inkworm-362L0oc18al-7eyn4wlEd')) || [];
  const existingData = inkwormLocalEnabled.find(obj => obj.email === data1);
  if (!existingData) return false;
}

export function redirect(status, to, delay) {
  if (status === '200') {
    setTimeout(() => window.location.href = to, delay);
  }
}

export function setLoading(buttonEl, isLoading = true) {
  if (!buttonEl) return;
  
  if (isLoading) {
    buttonEl.classList.add('button-loading');
    buttonEl.disabled = true;
  } else {
    buttonEl.classList.remove('button-loading');
    buttonEl.disabled = false;
  }
}

export function setActive(groupEl, isActive = true) {
  if (!groupEl) return;
  
  const root = groupEl.closest('.group');
  if (!root) return;
  
  root.querySelectorAll('.group-el').forEach(el => {
    el.classList.remove('active');
  });
  
  if (isActive) {
    groupEl.classList.add('active');
  }
}

export function toggleSidebar(sidebarId, isActive = true) {
  if (!sidebarId) return;
  
  if (!isActive) {
    document.body.style.overflow = 'hidden';
    document.querySelector(`${sidebarId}`).classList.add('active');
    document.addEventListener('click', function(e) {
      if (!e.target.matches('.sidebar-toggle-btn') &&
        !e.target.matches('.sidebar-toggle-btn *') &&
        !e.target.matches('.user-sidebar')
      ) {
        if (!document.querySelector('.popup-card-active')) document.body.style.overflow = 'unset';
        document.querySelector(`${sidebarId}`).classList.remove('active');
      }
    });
  }
}

export function navTo(linkEl) {
  setPageLoading(document.querySelector('.page-load'));
  
  let loadTime;
  
  loadTime = setTimeout(() => {
    window.location.href = linkEl.dataset.link;
    clearTimeout(loadTime);
  }, 1000);
}

let intervals = {};

export function switchThumbnails(container) {
  const imgs = Array.from(container.querySelectorAll('img'));
  if (imgs.length <= 1) return;
  
  const containerId = container.id || 'container-' + Math.random().toString(36).substring(2, 9);
  container.id = containerId;
  
  if (intervals[containerId]) {
    clearInterval(intervals[containerId]);
  }
  
  let activeIndex = imgs.findIndex(img => img.classList.contains('active'));
  
  intervals[containerId] = setInterval(() => {
    imgs[activeIndex].classList.remove('active');
    activeIndex = (activeIndex + 1) % imgs.length;
    imgs[activeIndex].classList.add('active');
  }, 6000);
}

export function popupCard(title, body, isActive = false) {
  if (isActive) {
    const card = document.createElement('div');
    document.body.appendChild(card);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('popup-card-active');
    
    card.innerHTML = `
      <div class="popup-card">
        <button class="close-popup-card-btn">
          <span class="icon">close</button>
        </button>
        <h2 class="popup-card-title">${title}</h2>
        <div class="popup-card-body">${body}</div>
      </div>
    `;
    
    document.querySelector('.close-popup-card-btn')?.addEventListener('click', () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('popup-card-active');
      card.remove();
      isActive = false;
    });
  }
}

export function tabGroup(tabBtnEl, tabGroupEl) {
  if (!tabBtnEl) return;
  
  tabGroupEl.querySelectorAll('.tab').forEach(tabEl => {
    if (tabEl.dataset.tab === tabBtnEl.dataset.tab) {
      tabEl.classList.add('active');
    } else {
      tabEl.classList.remove('active');
    }
  });
}

export function selectPlan(container, planEl, plan, isSelected = true) {
  if (!container) return;
  
  container.querySelectorAll('.user-subscription-plan').forEach(el => el.classList.remove('active'));
  
  if (plan === "free") {
    if (isSelected) {
      // Already in free
      alert('Already in free');
    } else {
      notify(
        "Popup", "Dismissible", null, null,
        `<span class="icon filled">switch</span>`,
        "Switch to Inkworm Free?",
        "You're cancelling Inkworm Premium and will be switched back to the free plan on the next renewal date",
        true, { close: "Cancel", cta: "I understand" },
        () => {
          isSelected = false;
          container.querySelectorAll('.user-subscription-plan').forEach(el => el.classList.remove('active'));
          container.querySelector(`.user-subscription-plan[data-plan="free"]`).classList.add('active');
        },
        () => {
          alert('200') // Switch to free
        }
      );
    }
    planEl.classList.add('active');
  } else {
    if (isSelected) {
      // Already in premium
      alert('Already in premium');
    } else {
      notify(
        "Popup", "Dismissible", null, null,
        `<span class="icon filled">switch</span>`,
        "Upgrade to Inkworm Premium?",
        "You've selected Inkworm Premium to upgrade your experience and will be redirected to the payment page",
        true, { close: "Cancel", cta: "Proceed to pay" },
        () => {
          isSelected = false;
          container.querySelectorAll('.user-subscription-plan').forEach(el => el.classList.remove('active'));
          container.querySelector(`.user-subscription-plan[data-plan="free"]`).classList.add('active');
        },
        () => {
          alert('300') // Switch to premium 
        }
      );
    }
    planEl.classList.add('active');
  }
}

export function inpSelect(inpEl, isActive = false) {
  if (!inpEl) return;
  
  const selectedOption = inpEl.querySelector('.inp-selected-option');
  inpEl.querySelectorAll('.inp-option').forEach(el => {
    el.addEventListener('click', () => {
      inpEl.querySelectorAll('.inp-option').forEach(el => el.classList.remove('selected'));
      el.classList.add('selected');
      selectedOption.textContent = el.textContent;
      selectedOption.dataset.selected = el.dataset.value.trim();
    });
  });
}

function populateDateType(container, items, type = null) {
  container.innerHTML = '';
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  items.forEach(val => {
    const div = document.createElement('div');
    div.className = 'inp-option inp-date-value';
    div.dataset.value = val;
    
    if (type === 'month') {
      div.textContent = monthNames[parseInt(val, 10) - 1];
    } else {
      div.textContent = val;
    }
    container.appendChild(div);
  });
}

export function inpDateSelect(inpEl, isActive = false) {
  if (!inpEl) return;
  
  const selectedOption = inpEl.querySelector('.inp-selected-date');
  inpEl.querySelectorAll('.inp-date').forEach(el => {
    el.addEventListener('click', (e) => {
      inpEl.querySelectorAll('.inp-date').forEach(el => el.classList.remove('selected'));
      el.classList.add('selected');
      
      if (el.dataset.type === 'year') {
        inpDateSelectStep(e.target, 'year');
      } else if (el.dataset.type === 'month') {
        inpDateSelectStep(e.target, 'month');
      } else {
        inpDateSelectStep(e.target, 'day');
      }
    });
  });
}

function inpDateSelectStep(dateEl, type) {
  dateEl.querySelector(`.inp-date-type[data-type='${type}']`)?.classList.add('active');
  
  document.querySelectorAll(`.inp-date-type[data-type='${type}'] .inp-date-value`)?.forEach(el => {
    el.addEventListener('click', function(e) {
      
      document.querySelectorAll(`.inp-date-type[data-type='${type}'] .inp-date-value`)
        ?.forEach(el => el.classList.remove('selected'));
      el.classList.add('selected');
      el.closest(`.inp-date-type[data-type='${type}']`)?.classList.remove('active');
      
      // GET selected
      const inpDateSelect = e.target.closest('.inp-date-select');
      const selectedEl = inpDateSelect.querySelector('.inp-selected-date');
      selectedEl.dataset[type] = e.target.dataset.value.trim();
      
      if (type === 'month') {
        const year = selectedEl.dataset.year;
        const month = selectedEl.dataset.month;
        
        if (year && month) {
          const dayContainer = inpDateSelect.querySelector(`.inp-date-type[data-type='day']`);
          populateDateType(dayContainer, generateDays(month, year));
          inpDateSelectStep(dateEl, 'day');
        }
      }
      
      updateSelectedDate(selectedEl);
    });
  });
}

function updateSelectedDate(selected) {
  if (!selected) return;
  
  const year = selected.dataset.year || '';
  const month = selected.dataset.month || '';
  const day = selected.dataset.day || '';
  
  const textParts = [year, month, day].filter(Boolean);
  selected.textContent = textParts.join('/');
  selected.dataset.selected = `${year}${month}${day}`;
}

const yearContainer = document.querySelector(`.inp-date-type[data-type='year']`);
const monthContainer = document.querySelector(`.inp-date-type[data-type='month']`);
const dayContainer = document.querySelector(`.inp-date-type[data-type='day']`);

populateDateType(yearContainer, generateYears(), 'year');
populateDateType(monthContainer, generateMonths(), 'month');
populateDateType(dayContainer, [], 'day'); // Populated when month is selected

/* Bind initial year/month/day steps
const dateEl = document.querySelector('.inp-date-select');
inpDateSelectStep(dateEl, 'year');
inpDateSelectStep(dateEl, 'month');
inpDateSelectStep(dateEl, 'day');*/