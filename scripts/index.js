//scripts/index
import { toggleTheme, setLoading, setActive } from './helpers js';

document.getElementById('theme-btn')?.addEventListener('click', () => {
  toggleTheme(); // defaults to 'light'
});

document.querySelectorAll('.group-el').forEach(el => {
  el.addEventListener('click', () => setActive(el, true));
});