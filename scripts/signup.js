//scripts/signup
import { setLoading } from './helpers.js';

const signupForm = document.querySelector('.signup-form');
const signupBtn = document.querySelector('.signup-btn');

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoading(signupBtn, true);

  const email = signupForm.querySelector("#set-email").value.trim();
  const password = signupForm.querySelector("#set-password").value;

  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbxMFdY_PIWkpjhCk-U35O_hxBlfXNR8oSCpnxxm32s3TgBuPftU4IXhWdkAxweYq1Ee-g/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([email, password]),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    alert("Response: " + data);
  } catch (err) {
    alert("Fetch error: " + err);
  } finally {
    setLoading(signupBtn, false);
  }
});