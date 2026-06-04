function openLightbox(url, caption) {
  document.getElementById("lightbox-img").src = url;
  document.getElementById("lightbox-caption").textContent = caption;
  document.getElementById("lightbox").classList.add("active");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
}

document.getElementById("contact-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const msg = document.getElementById("form-msg");
  const btn = this.querySelector("button");

  const body = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      msg.style.color = "#22c55e";
      msg.textContent = "✓ Message sent successfully!";
      this.reset();
    } else {
      throw new Error("Failed");
    }
  } catch {
    msg.style.color = "#ef4444";
    msg.textContent = "✗ Failed to send. Please try again.";
  }

  btn.disabled = false;
  btn.textContent = "Send Message";
});
