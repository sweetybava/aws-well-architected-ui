async function askQuestion() {
  const question = document.getElementById("question").value.trim();
  const responseBox = document.getElementById("response");

  if (!question) {
    responseBox.textContent = "Please enter a question.";
    return;
  }

  responseBox.textContent = "Loading...";

  try {
    const res = await fetch("https://i2dfr23b3zl5dcbqdqijqodqey0fjnzj.lambda-url.ap-southeast-1.on.aws/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({question})
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (data.success) {
      responseBox.textContent = JSON.stringify(data.data, null, 2);
    } else {
      responseBox.textContent = "Error from Lambda: " + (data.error || "Unknown error");
    }
  } catch (err) {
    responseBox.textContent = "Fetch error: " + err.message;
  }
}
