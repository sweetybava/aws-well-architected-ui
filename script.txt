function toggleSpinner(show) {
  const spinner = document.getElementById("spinner");
  spinner.classList.toggle("hidden", !show);
}

async function askQuestion() {
  const questionInput = document.getElementById("question");
  const responseBox = document.getElementById("response");
  const question = questionInput.value.trim();

  responseBox.innerHTML = "";
  toggleSpinner(true);

  if (!question) {
    toggleSpinner(false);
    responseBox.textContent = "Please enter a question.";
    return;
  }

  try {
    const res = await fetch("https://i2dfr23b3zl5dcbqdqijqodqey0fjnzj.lambda-url.ap-southeast-1.on.aws/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const contentType = res.headers.get("Content-Type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Non-JSON response: ${text}`);
    }

    toggleSpinner(false);

    if (res.ok && data.success) {
      if (data.matched) {
        // Format as Q&A layout
        const bestPracticesHTML = data.BestPractices.map(practice => `<li>${practice}</li>`).join("");
        responseBox.innerHTML = `
          <div class="qa-container">
            <p><strong>Q:</strong> ${question}</p>
            <p><strong>Pillar:</strong> ${data.Pillar}</p>
            <p><strong>Best Practices:</strong></p>
            <ul>${bestPracticesHTML}</ul>
          </div>
        `;
      } else {
        responseBox.innerHTML = `
          <div class="qa-container">
            <p><strong>Q:</strong> ${question}</p>
            <p><strong>Message:</strong> ${data.Message}</p>
            <p><strong>Available Pillars:</strong> ${data.AvailablePillars.join(", ")}</p>
          </div>
        `;
      }
    } else {
      responseBox.textContent = "Lambda error: " + (data.error || "Unknown error");
    }

  } catch (err) {
    toggleSpinner(false);
    responseBox.textContent = "Fetch error: " + err.message;
  }
}
