// ── LuxeStay Shared Utilities ───────────────────────────────────────────

// ── Auth guard ──────────────────────────────────────────────────────────
function authGuard() {
  const user = restoreSession();
  if (!user) { window.location.href = "index.html"; return null; }
  return user;
}

// ── Sidebar builder ─────────────────────────────────────────────────────
function buildSidebar(activePage) {
  const user = getCurrentUser();
  if (!user) return;

  const nav = [
    { icon:"🏠", label:"Dashboard",   href:"dashboard.html",   key:"dashboard" },
    { icon:"🏨", label:"Hotel",        href:"hotel.html",       key:"hotel" },
    { icon:"🍽", label:"Restaurant",   href:"restaurant.html",  key:"restaurant" },
    { icon:"📋", label:"My Bookings",  href:"bookings.html",    key:"bookings" },
    { icon:"⚙️", label:"Admin",        href:"admin.html",       key:"admin", adminOnly:true },
  ];

  document.getElementById("sidebar-name").textContent  = user.fullName;
  document.getElementById("sidebar-role").textContent  = user.role.toUpperCase();
  document.getElementById("sidebar-avatar").textContent = user.fullName.charAt(0).toUpperCase();

  const navEl = document.getElementById("sidebar-nav");
  navEl.innerHTML = "";

  nav.forEach(item => {
    if (item.adminOnly && user.role !== "admin") return;
    const a = document.createElement("a");
    a.href      = item.href;
    a.className = `nav-item${activePage === item.key ? " active" : ""}`;
    a.innerHTML = `<span class="nav-icon">${item.icon}</span>${item.label}`;
    navEl.appendChild(a);
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "index.html";
  });
}

// ── Toast ───────────────────────────────────────────────────────────────
function showToast(message, kind = "success", duration = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  const icons = { success:"✓", error:"✕", info:"ℹ", warning:"⚠" };
  toast.className = `toast toast-${kind}`;
  toast.innerHTML = `<span>${icons[kind] || "ℹ"}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ── Confirm modal ───────────────────────────────────────────────────────
function showConfirm(title, message, onConfirm, onCancel) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-title">${title}</div>
      <div class="modal-message">${message}</div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
        <button class="btn btn-gold"  id="modal-confirm">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.querySelector("#modal-confirm").addEventListener("click", () => {
    overlay.remove();
    onConfirm();
  });
  overlay.querySelector("#modal-cancel").addEventListener("click", () => {
    overlay.remove();
    if (onCancel) onCancel();
  });
  overlay.addEventListener("click", e => {
    if (e.target === overlay) { overlay.remove(); if (onCancel) onCancel(); }
  });
}

// ── Status badge ────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = { Confirmed:"success", Cancelled:"error", Pending:"warning" };
  return `<span class="badge badge-${map[status] || "info"}">● ${status}</span>`;
}

// ── Format date ─────────────────────────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-GB", {
    weekday:"short", day:"numeric", month:"short", year:"numeric"
  });
}

function fmtDateTime(isoStr) {
  if (!isoStr) return "—";
  return new Date(isoStr).toLocaleString("en-GB", {
    day:"numeric", month:"short", year:"numeric",
    hour:"2-digit", minute:"2-digit"
  });
}

// ── Today's date string ─────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ── Empty state ─────────────────────────────────────────────────────────
function emptyState(icon, title, sub, btnLabel, btnHref) {
  return `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <div class="empty-title">${title}</div>
      <div class="empty-sub">${sub}</div>
      ${btnLabel ? `<a href="${btnHref}" class="btn btn-gold" style="margin-top:16px">${btnLabel}</a>` : ""}
    </div>`;
}
