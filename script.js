function toggleSpinner(show) {
  const spinner = document.getElementById("spinner");
  if (show) spinner.classList.remove("hidden");
  else spinner.classList.add("hidden");
}

async function askQuestion() {
  const question = document.getElementById("question").value.trim();
  const responseBox = document.getElementById("response");

  if (!question) {
    responseBox.textContent = "Please enter a question.";
    return;
  }

  responseBox.textContent = "";
  toggleSpinner(true);

  try {
    const response = await fetch("https://i2dfr23b3zl5dcbqdqijqodqey0fjnzj.lambda-url.ap-southeast-1.on.aws/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    toggleSpinner(false);

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    if (data.success) {
      responseBox.textContent = JSON.stringify(data.data, null, 2);
    } else {
      responseBox.textContent = "Error from Lambda: " + (data.error || "Unknown error");
    }

  } catch (err) {
    toggleSpinner(false);
    responseBox.textContent = "Fetch error: " + err.message;
  }
}
