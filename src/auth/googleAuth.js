// File: src/auth/googleAuth.js

// Ganti dengan Client ID Anda dari Google Cloud Console
// Get your valid Client ID from: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "93307469574-nhj3o7gbqfntdovkhrhje7sq2oc74d0a.apps.googleusercontent.com";

export const initGoogleAuth = (onSuccessCallback, elementId) => {
  if (!window.google) {
    console.error("Script Google Identity Services belum dimuat.");
    return;
  }

  // 1. Inisialisasi
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse(onSuccessCallback),
  });

  // 2. Langsung render tombolnya kalau elementId dikasih
  if (elementId) {
    window.google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: "outline",
      size: "large",
    });
  }
};

// Handler saat user berhasil login
const handleCredentialResponse = (onSuccessCallback) => (response) => {
  console.log("[Auth] Encoded JWT ID token: " + response.credential);

  // Decode JWT secara manual (sederhana) untuk ambil payload
  try {
    const payload = JSON.parse(atob(response.credential.split(".")[1]));
    console.log("[Auth] User Login:", payload.name, payload.email);

    if (onSuccessCallback) {
      onSuccessCallback(payload);
    }
  } catch (e) {
    console.error("Gagal decode token", e);
  }
};

export const renderGoogleButton = (elementId) => {
  if (window.google) {
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      { theme: "outline", size: "large" }, // Konfigurasi UI tombol
    );
  }
};

export const handleLogout = () => {
  if (window.google) {
    window.google.accounts.id.disableAutoSelect();
    console.log("[Auth] User Logout Berhasil.");
  }
};
