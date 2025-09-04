function toggleSpinner(show) {
  const spinner = document.getElementById("spinner");
  if (show) spinner.classList.remove("hidden");
  else spinner.classList.add("hidden");
}

async function askQuestion() {
  const questionInput = document.getElementById("question");
  const question = questionInput.value.trim();
  const responseBox = document.getElementById("response");

  if (!question) {
    responseBox.innerHTML = "<p class='error'>Please enter a question.</p>";
    return;
  }

  responseBox.innerHTML = "";
  toggleSpinner(true);

  try {
    const res = await fetch("https://i2dfr23b3zl5dcbqdqijqodqey0fjnzj.lambda-url.ap-southeast-1.on.aws/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    toggleSpinner(false);

    const contentType = res.headers.get("Content-Type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Non-JSON response: ${text}`);
    }

    if (res.ok && data.success) {
      // Format as Q&A style
      responseBox.innerHTML = `
        <div class="qa">
          <div class="q">Q: ${question}</div>
          <div class="a">A: ${typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2)}</div>
        </div>
      `;
    } else {
      responseBox.innerHTML = `<p class="error">Lambda error: ${data.error || "Unknown error"}</p>`;
    }

  } catch (err) {
    toggleSpinner(false);
    responseBox.innerHTML = `<p class="error">Fetch error: ${err.message}</p>`;
  }
}
