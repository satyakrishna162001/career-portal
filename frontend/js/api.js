// Shared API helper functions for public and admin pages.
const API_BASE_URL = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function extractErrorMessage(data, status) {
  if (!data) return `Request failed: ${status}`;

  if (typeof data === "string") {
    return data || `Request failed: ${status}`;
  }

  if (Array.isArray(data.detail)) {
    // FastAPI validation errors often come in array format.
    const first = data.detail[0];
    if (first?.msg) return first.msg;
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  return `Request failed: ${status}`;
}

async function request(path, options = {}, requiresAuth = false) {
  const headers = options.headers ? { ...options.headers } : {};

  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      throw new Error("Missing authentication token");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Unable to connect to server. Check backend and network.");
  }

  if (response.status === 401) {
    clearToken();
    if (window.location.pathname.endsWith("admin-dashboard.html")) {
      window.location.href = "admin-login.html";
    }
  }

  let data = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, response.status));
  }

  return data;
}

function showMessage(elementId, type, text) {
  const el = document.getElementById(elementId);
  if (!el) return;

  if (!type || !text) {
    el.className = "message";
    el.textContent = "";
    return;
  }

  el.className = `message ${type}`;
  el.textContent = text;
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loginAdmin(email, password) {
  try {
    return await request("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return await request("/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }
}

async function getPublicJobs() {
  return request("/jobs");
}

async function getPublicJobById(jobId) {
  return request(`/jobs/${jobId}`);
}

async function applyToJob(jobId, formData) {
  return request(`/jobs/${jobId}/apply`, { method: "POST", body: formData });
}

async function getAdminJobs() {
  try {
    return await request("/admin/jobs", {}, true);
  } catch {
    return await request("/jobs", {}, true);
  }
}

async function createAdminJob(payload) {
  return request(
    "/admin/jobs",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    true
  );
}

async function deleteAdminJob(jobId) {
  return request(`/admin/jobs/${jobId}`, { method: "DELETE" }, true);
}

async function toggleJobStatus(job) {
  try {
    return await request(`/admin/jobs/${job.id}/toggle`, { method: "PATCH" }, true);
  } catch {
    const action = job.isActive ? "deactivate" : "activate";
    return await request(`/admin/jobs/${job.id}/${action}`, { method: "PATCH" }, true);
  }
}

async function getApplicationsByJob(jobId) {
  try {
    return await request(`/admin/jobs/${jobId}/applications`, {}, true);
  } catch {
    return await request(`/admin/applications?jobId=${jobId}`, {}, true);
  }
}

async function updateApplicationStatus(applicationId, status) {
  return request(
    `/admin/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    true
  );
}
