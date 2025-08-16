//scripts/email-verification
import { startCountdown, notify, setLoading } from './helpers.js';

const path = 'https://inkworm.vercel.app/pages/';
const vcodeForm = document.querySelector('.verify-email-form');
const vcodeBtn = document.querySelector('.verify-email-btn');
const resendVcodeCountdown = document.querySelector('.resend-vcode-countdown');
const resendVcodeBtn = document.querySelector('.resend-vcode-btn');

function enableResendVcodeBtn() { 
  resendVcodeBtn.disabled = false;
  resendVcodeCountdown.style.display = 'none';
};

startCountdown(180, resendVcodeCountdown, enableResendVcodeBtn);

vcodeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoading(vcodeBtn, true);
  
  const vcode = vcodeForm.querySelector("#verification-code").value.trim();
  
  // REGEX_HERE
  
  try {
    const checkRes = await fetch(
      `https://script.google.com/macros/s/AKfycbxMFdY_PIWkpjhCk-U35O_hxBlfXNR8oSCpnxxm32s3TgBuPftU4IXhWdkAxweYq1Ee-g/exec?email=${encodeURIComponent(email)}`,
      {
        method: "GET"
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
        "Unable to verify",
        "Unfortunately an error has occurred. Please refresh the page or request another code and try again.",
        true, { close: "Got it", cta: null },
        () => {},
        () => {
          document.querySelector('.notification')?.remove();
        }
      );
      return;
    }
    
    if (vcode.includes(checkData.user.email_vcode)) {
      notify(
        "Toast", "Auto-dismiss",
        `<span class="icon filled">check_circle</span>`,
        `Email address verified successfully!`,
        null, null, null, false, null, null, 10000
      );
      
      redirect('200', `${path}/profile.html`, 1000);
    } else {
      notify(
        "Toast", "Auto-dismiss",
        `<span class="icon filled">error</span>`,
        `Invalid verification code!`,
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
    setLoading(vcodeBtn, false);
  }
});