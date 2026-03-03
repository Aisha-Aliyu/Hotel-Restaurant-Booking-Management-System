// ── LuxeStay App Bootstrap ──────────────────────────────────────────────
// This file handles login page logic only.
// Each page has its own inline script.

document.addEventListener("DOMContentLoaded", () => {
  // If already logged in, redirect to dashboard
  if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    const user = restoreSession();
    if (user) window.location.href = "dashboard.html";
  }
});
