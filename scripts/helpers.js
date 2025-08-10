// scripts/helpers
export function toggleTheme(themeClass = 'light') {
  document.body.classList.toggle(themeClass);
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
  
  console.log("200");
/*
  const root = groupEl.closest('.group');
  if (!root) return;

  root.querySelectorAll('.group-el').forEach(el => {
    el.classList.remove('active');
  });

  if (isActive) {
    groupEl.classList.add('active');
  }*/
}