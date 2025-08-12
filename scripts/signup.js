//scripts/signup
import { notify, saveLocally, redirect, setLoading } from './helpers.js';

const path = "https://inkworm.vercel.app/pages/";
const signupForm = document.querySelector('.signup-form');
const signupBtn = document.querySelector('.signup-btn');

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoading(signupBtn, true);
  
  const email = signupForm.querySelector("#set-email").value.trim();
  const password = signupForm.querySelector("#set-password").value.trim();
  const name = signupForm.querySelector("#set-name").value.trim();
  const uid = "uid-" + Math.floor(Math.random() * 100000000);
  
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
      notify(
        "Popup", "Dismissible", null, null,
        `<span class="icon filled">warning</span>`,
        "Email already exists!",
        "The email you provided is already in use by an existing account. Please login to your account instead.",
        true, { close: "Got it", cta: null },
        () => {},
        () => {
          document.querySelector('.notification')?.remove();
        }
      );
      return;
    }
    
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("uid", uid);
    formData.append("plan", "free");
    
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
    if (!saveLocally(email, uid)) {
      notify(
        "Popup", "Dismissible", null, null,
        `<span class="icon filled">error</span>`,
        "localStorge is disabled",
        "For a better app experience, please enable cookies and site data in your browser settings before attempting to sign up",
        true, { close: "Got it", cta: null },
        () => {},
        () => {
          document.querySelector('.notification')?.remove();
        }
      );
      return;
    }
    
    saveLocally(email, uid);
    
    notify(
      "Toast", "Auto-dismiss",
      `<span class="icon filled">check_circle</span>`,
      `Signed up successfully!`,
      null, null, null, false, null, null, 10000
    );
    
    redirect('200', `${path}/profile.html`, 1000);
  } catch (err) {
    notify(
      "Popup", "Dismissible", null, null,
      `<span class="icon filled">error</span>`,
      `${err}`,
      "Sorry for the inconvenience. We're working to get it fixed and you can always try again later",
      true, { close: "Got it", cta: null },
      () => {},
      () => {
        document.querySelector('.notification')?.remove();
      }
    );
  } finally {
    setLoading(signupBtn, false);
  }
});