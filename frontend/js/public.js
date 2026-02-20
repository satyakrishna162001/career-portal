// Public pages logic: index.html and job.html

function formatJobCard(job) {
  return `
    <article class="job-item">
      <h3>${job.title}</h3>
      <p class="job-meta"><strong>Location:</strong> ${job.location}</p>
      <p class="job-meta"><strong>Job Type:</strong> ${job.jobType}</p>
      <a class="link-btn" href="job.html?id=${job.id}">View Details</a>
    </article>
  `;
}

async function renderJobsPage() {
  const listEl = document.getElementById("jobsList");
  if (!listEl) return;

  listEl.innerHTML = "<div class='loading-state'>Loading jobs...</div>";

  try {
    const jobs = await getPublicJobs();

    if (!Array.isArray(jobs) || jobs.length === 0) {
      listEl.innerHTML = "<div class='empty-state'>No active jobs available right now.</div>";
      return;
    }

    listEl.innerHTML = jobs.map(formatJobCard).join("");
  } catch (error) {
    listEl.innerHTML = "";
    showMessage("message", "error", error.message);
  }
}

async function renderJobDetailPage() {
  const detailEl = document.getElementById("jobDetail");
  if (!detailEl) return;

  const jobId = getQueryParam("id");
  if (!jobId) {
    showMessage("message", "error", "Missing job ID in URL.");
    return;
  }

  detailEl.innerHTML = "<div class='loading-state'>Loading job details...</div>";

  try {
    const job = await getPublicJobById(jobId);

    detailEl.innerHTML = `
      <h2>${job.title}</h2>
      <p><strong>Description:</strong><br>${job.description}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Job Type:</strong> ${job.jobType}</p>
    `;

    const form = document.getElementById("applyForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showMessage("message", "", "");

      const submitBtn = form.querySelector("button[type='submit']");
      const originalBtnText = submitBtn.textContent;

      const formData = new FormData(form);
      const resumeFile = formData.get("resume");
      if (!resumeFile || !resumeFile.name) {
        showMessage("message", "error", "Please upload a resume file.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      try {
        await applyToJob(jobId, formData);
        showMessage("message", "success", "Application submitted successfully.");
        form.reset();
      } catch (error) {
        showMessage("message", "error", error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  } catch (error) {
    detailEl.innerHTML = "";
    showMessage("message", "error", error.message);
  }
}

renderJobsPage();
renderJobDetailPage();
