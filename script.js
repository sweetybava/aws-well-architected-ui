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
    const res = await fetch("https://tzvndzw7kjhi6inqrgljllufdy0ybgbs.lambda-url.ap-southeast-1.on.aws/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: question })
    });

    const contentType = res.headers.get("Content-Type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Unexpected response: ${text}`);
    }

    toggleSpinner(false);

    if (!res.ok || !data.success) {
      responseBox.textContent = "Lambda error: " + (data.error || "Unknown error");
      return;
    }

    // Build output
    let html = `<strong>Question:</strong> ${data.Question}<br/><br>`;
    html += `<strong>AWS Account ID:</strong> ${data.AccountId}<br/><br>`;
    html += `<strong>Detected AWS Services:</strong> ${data.DetectedServices.join(", ") || "None"}<br/><br>`;

    if (data.Suggestions && data.Suggestions.length > 0) {
      html += `<strong>Suggestions:</strong><ul>`;
      data.Suggestions.forEach(item => {
        html += `<li><strong>${item.Service}</strong> (${item.Pillar} Pillar): ${item.Suggestion}</li>`;
      });
      html += `</ul>`;
    } else {
      html += `<em>No specific suggestions found for active services.</em>`;
    }

    responseBox.innerHTML = html;

  } catch (err) {
    toggleSpinner(false);
    responseBox.textContent = "Fetch error: " + err.message;
  }
}
