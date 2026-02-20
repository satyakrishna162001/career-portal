// Authentication helpers for admin pages.

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "admin-login.html";
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value.trim();

  try {
    const result = await loginAdmin(email, password);
    setToken(result.access_token);
    showMessage("message", "success", "Login successful. Redirecting...");
    setTimeout(() => {
      window.location.href = "admin-dashboard.html";
    }, 500);
  } catch (error) {
    showMessage("message", "error", error.message);
  }
}

function setupLoginPage() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;
  loginForm.addEventListener("submit", handleLoginSubmit);
}

function setupLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    clearToken();
    window.location.href = "admin-login.html";
  });
}

setupLoginPage();
setupLogoutButton();
