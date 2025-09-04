function toggleSpinner(show) {
  const spinner = document.getElementById("spinner");
  spinner.classList.toggle("hidden", !show);
}

async function askQuestion() {
  const question = document.getElementById("question").value.trim();
  const responseBox = document.getElementById("response");
  responseBox.textContent = "";
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
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
      responseBox.innerHTML = `<strong>Q:</strong> ${question}<br/><br/><strong>A:</strong><br/>${JSON.stringify(data.data, null, 2)}`;
    } else {
      responseBox.textContent = "Lambda error: " + (data.error || "Unknown error");
    }

  } catch (err) {
    toggleSpinner(false);
    responseBox.textContent = "Fetch error: " + err.message;
  }
}
