// Admin dashboard logic.

let currentJobs = [];

function statusClass(status) {
  if (status === "SHORTLISTED") return "status-shortlisted";
  if (status === "REJECTED") return "status-rejected";
  return "status-applied";
}

function statusOptions(selected) {
  const statuses = ["APPLIED", "SHORTLISTED", "REJECTED"];
  return statuses
    .map((s) => `<option value="${s}" ${selected === s ? "selected" : ""}>${s}</option>`)
    .join("");
}

async function loadJobs() {
  const body = document.getElementById("jobsTableBody");
  if (!body) return;

  body.innerHTML = "<tr><td colspan='6'>Loading jobs...</td></tr>";

  try {
    const jobs = await getAdminJobs();
    currentJobs = Array.isArray(jobs) ? jobs : [];

    if (currentJobs.length === 0) {
      body.innerHTML = "<tr><td colspan='6'>No jobs found.</td></tr>";
      return;
    }

    body.innerHTML = currentJobs
      .map(
        (job) => `
      <tr>
        <td>${job.id}</td>
        <td>${job.title}</td>
        <td>${job.location ?? "-"}</td>
        <td>${job.jobType ?? "-"}</td>
        <td>${job.isActive ? "Active" : "Inactive"}</td>
        <td>
          <div class="actions">
            <button class="small-btn" data-action="toggle" data-id="${job.id}">${job.isActive ? "Deactivate" : "Activate"}</button>
            <button class="small-btn secondary" data-action="apps" data-id="${job.id}">View Applications</button>
            <button class="small-btn danger" data-action="delete" data-id="${job.id}">Delete</button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  } catch (error) {
    showMessage("message", "error", error.message);
  }
}

async function loadApplications(jobId) {
  const body = document.getElementById("applicationsTableBody");
  const hint = document.getElementById("applicationsHint");
  if (!body) return;

  body.innerHTML = "<tr><td colspan='8'>Loading applications...</td></tr>";

  try {
    const apps = await getApplicationsByJob(jobId);
    hint.textContent = `Showing applications for Job ID: ${jobId}`;

    if (!Array.isArray(apps) || apps.length === 0) {
      body.innerHTML = "<tr><td colspan='8'>No applications found.</td></tr>";
      return;
    }

    body.innerHTML = apps
      .map(
        (app) => `
      <tr>
        <td>${app.id}</td>
        <td>${app.jobId}</td>
        <td>${app.fullName}</td>
        <td>${app.email}</td>
        <td>${app.phone}</td>
        <td><a href="${API_BASE_URL}/${app.resumePath}" target="_blank">Resume</a></td>
        <td><span class="status-pill ${statusClass(app.status)}">${app.status}</span></td>
        <td>
          <div class="actions">
            <select data-role="status" data-id="${app.id}">
              ${statusOptions(app.status)}
            </select>
            <button class="small-btn" data-action="save-status" data-id="${app.id}">Save</button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  } catch (error) {
    showMessage("message", "error", error.message);
  }
}

async function handleCreateJob(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  const payload = {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    location: form.location.value.trim(),
    jobType: form.jobType.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";

  try {
    await createAdminJob(payload);
    showMessage("message", "success", "Job created successfully.");
    form.reset();
    await loadJobs();
  } catch (error) {
    showMessage("message", "error", error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

async function handleJobsTableClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === "toggle") {
    const job = currentJobs.find((j) => j.id === id);
    if (!job) return;

    try {
      await toggleJobStatus(job);
      showMessage("message", "success", "Job status updated.");
      await loadJobs();
    } catch (error) {
      showMessage("message", "error", error.message);
    }
  }

  if (action === "apps") {
    await loadApplications(id);
  }

  if (action === "delete") {
    const confirmed = window.confirm("Delete this job permanently?");
    if (!confirmed) return;

    try {
      await deleteAdminJob(id);
      showMessage("message", "success", "Job deleted successfully.");
      await loadJobs();
      document.getElementById("applicationsTableBody").innerHTML = "";
      document.getElementById("applicationsHint").textContent = "Click \"View Applications\" for a job.";
    } catch (error) {
      showMessage("message", "error", error.message);
    }
  }
}

async function handleApplicationsTableClick(event) {
  const button = event.target.closest("button");
  if (!button || button.dataset.action !== "save-status") return;

  const appId = Number(button.dataset.id);
  const select = document.querySelector(`select[data-role='status'][data-id='${appId}']`);
  if (!select) return;

  try {
    await updateApplicationStatus(appId, select.value);
    showMessage("message", "success", `Application ${appId} updated.`);
  } catch (error) {
    showMessage("message", "error", error.message);
  }
}

function setupAdminDashboard() {
  const createJobForm = document.getElementById("createJobForm");
  const jobsTableBody = document.getElementById("jobsTableBody");
  const applicationsTableBody = document.getElementById("applicationsTableBody");

  if (!createJobForm || !jobsTableBody || !applicationsTableBody) return;

  requireAuth();
  createJobForm.addEventListener("submit", handleCreateJob);
  jobsTableBody.addEventListener("click", handleJobsTableClick);
  applicationsTableBody.addEventListener("click", handleApplicationsTableClick);

  loadJobs();
}

setupAdminDashboard();
