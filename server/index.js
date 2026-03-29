const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5000", "null", process.env.CLIENT_URL].filter(Boolean),
  methods: ["GET", "POST"],
  credentials: true
}));

// Serve static frontend
app.use(express.static(require("path").join(__dirname, "../client/public")));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err.message));

const Project = mongoose.model("Project", {
  title: String,
  description: String
});

const Contact = mongoose.model("Contact", {
  name: String,
  email: String,
  message: String
});

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((err) => {
  if (err) console.error("Email transporter error:", err.message);
  else console.log("Email transporter ready");
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "ejairuogaga@gmail.com",
      subject: `New Portfolio Message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`
    });
    res.json({ message: "Sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send" });
  }
});

app.get("/api/seed", async (req, res) => {
  await Project.create([
    { title: "Agro E-commerce", description: "Online farm product store" },
    { title: "Auth System", description: "JWT login system" }
  ]);
  res.send("Seeded");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
