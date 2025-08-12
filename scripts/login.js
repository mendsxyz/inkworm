//scripts/login
import { setLoading } from './helpers.js';

const loginForm = document.querySelector('.login-form');
const loginBtn = document.querySelector('.login-btn');

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoading(loginBtn, true);

  const email = loginForm.querySelector("#login-email").value.trim();
  const password = loginForm.querySelector("#login-password").value;

  try {
    const checkRes = await fetch(
      `https://script.google.com/macros/s/AKfycbxMFdY_PIWkpjhCk-U35O_hxBlfXNR8oSCpnxxm32s3TgBuPftU4IXhWdkAxweYq1Ee-g/exec?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
      }
    );

    if (!checkRes.ok) {
      throw new Error(`HTTP error! Status: ${checkRes.status}`);
    }

    const checkData = await checkRes.json();
    
    if (!checkData.exists) {
      alert("This email doesn't exist. Please sign up instead.");
      return;
    } else if (checkData.password === password) {
      alert("Login successful!");
    } else {
      alert("Incorrect password. Please try again.");
    }
  } catch (err) {
    alert("An error occurred: " + err);
  } finally {
    setLoading(loginBtn, false);
  }
});