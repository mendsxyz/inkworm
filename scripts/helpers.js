// scripts/helpers.js
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