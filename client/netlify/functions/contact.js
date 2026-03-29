const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const { name, email, message } = JSON.parse(event.body || "{}");
  if (!name || !email || !message) return { statusCode: 400, body: JSON.stringify({ message: "All fields required" }) };

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`
    });
    return { statusCode: 200, body: JSON.stringify({ message: "Sent" }) };
  } catch (err) {
    console.error("Email error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
