async function askQuestion() {
  const question = document.getElementById("question").value;
  const responseBox = document.getElementById("response");

  responseBox.textContent = "Loading...";

  try {
    const res = await fetch("https://i2dfr23b3zl5dcbqdqijqodqey0fjnzj.lambda-url.ap-southeast-1.on.aws/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: question })
    });

    const data = await res.json();
    responseBox.textContent = data.body || "No response received";
  } catch (err) {
    responseBox.textContent = "Error: " + err.message;
  }
}
