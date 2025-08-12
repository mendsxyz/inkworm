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

    if (checkData.exists) {
      alert("This email already exists. Please use a different one.");
      return;
    }
    
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbxMFdY_PIWkpjhCk-U35O_hxBlfXNR8oSCpnxxm32s3TgBuPftU4IXhWdkAxweYq1Ee-g/exec",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    alert("Response: " + JSON.stringify(data));
  } catch (err) {
    alert("An error occurred: " + err);
  } finally {
    setLoading(signupBtn, false);
  }
});