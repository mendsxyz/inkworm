//scripts/login
import { checkLocallySaved, notify, redirect, setLoading } from './helpers.js';

const path = 'https://inkworm.vercel.app/pages/';
const loginForm = document.querySelector('.login-form');
const loginBtn = document.querySelector('.login-btn');

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoading(loginBtn, true);
  
  const email = loginForm.querySelector("#login-email").value.trim();
  const password = loginForm.querySelector("#login-password").value.trim();
  
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
      notify(
        "Popup", "Dismissible", null, null,
        `<span class="icon filled">error</span>`,
        "Email doesn't exist",
        "The email you provided is not in our records. Please try signing up instead",
        true, { close: "Got it", cta: null },
        () => {},
        () => {
          document.querySelector('.notification')?.remove();
        }
      );
      return;
    } else if (checkData.password == password) {
      if (!checkLocallySaved(email)) {
        notify(
          "Popup", "Dismissible", null, null,
          `<span class="icon filled">error</span>`,
          "Data not found",
          "For a better experience, please enable cookies and site data in your browser settings and then try signing up",
          true, { close: "Got it", cta: null },
          () => {},
          () => {
            document.querySelector('.notification')?.remove();
          }
        );
        return;
      }
      
      notify(
        "Toast", "Auto-dismiss",
        `<span class="icon filled">check_circle</span>`,
        `Logged in successfully!`,
        null, null, null, false, null, null, 10000
      );
      
      redirect('200', `${path}/profile.html`, 1000);
    } else {
      notify(
        "Toast", "Auto-dismiss",
        `<span class="icon filled">error</span>`,
        `Wrong password`,
        null, null, null, false, null, null, 10000
      );
    }
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
    setLoading(loginBtn, false);
  }
});