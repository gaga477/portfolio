const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const serverPkg = require("./package.json");

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5000",
      "https://portfolio-qf8o.onrender.com",
      process.env.CLIENT_URL
    ].filter(Boolean);
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
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
  description: String,
  tags: [String],
  gallery: [{
    url: String,
    caption: String
  }],
  image: String,
  github: String,
  live: String
});

const Contact = mongoose.model("Contact", {
  name: String,
  email: String,
  message: String
});

const Review = mongoose.model("Review", {
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

app.get("/api/reviews", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

app.post("/api/reviews", async (req, res) => {
  const { name, rating, comment } = req.body;
  if (!name || !rating || !comment) return res.status(400).json({ message: "All fields required" });
  try {
    const review = await Review.create({ name, rating, comment });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: "All fields required" });

  // Always save to DB first so the message is never lost
  try {
    await new Contact({ name, email, message }).save();
  } catch (dbErr) {
    console.error("DB save error:", dbErr.message);
  }

  // Send email via Resend (HTTPS — works on all hosts including Render free tier)
  try {
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [process.env.EMAIL_USER],
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#00d4ff;border-bottom:2px solid #00d4ff;padding-bottom:8px">
            New Portfolio Message
          </h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="background:#f5f5f5;padding:16px;border-radius:6px;white-space:pre-wrap">${message}</p>
          <p style="color:#999;font-size:12px;margin-top:24px">
            Sent from your portfolio contact form. Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ message: "Email delivery failed, but your message was saved." });
    }

    res.json({ message: "Sent" });
  } catch (err) {
    console.error("Contact error:", err.message);
    res.status(500).json({ message: "Email delivery failed, but your message was saved." });
  }
});

app.get("/health", (req, res) => {
  const dbReadyState = mongoose.connection.readyState;
  const dbStatus = dbReadyState === 1 ? "connected" : dbReadyState === 2 ? "connecting" : dbReadyState === 3 ? "disconnecting" : "disconnected";

  res.json({
    status: "ok",
    version: serverPkg.version,
    uptimeSeconds: Math.floor(process.uptime()),
    dbStatus
  });
});

app.get("/api/seed", async (req, res) => {
  await Project.deleteMany({});
  await Project.create([
    {
      title: "Agro E-commerce Website",
      description: "A responsive agriculture e-commerce platform showcasing farm produce and vendor services.",
      tags: ["React", "Node.js", "Express", "MongoDB", "E-commerce"],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1493244040629-496f6d136cc3?w=400&h=240&fit=crop",
          caption: "Fresh farm produce"
        },
        {
          url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=240&fit=crop",
          caption: "Online marketplace for farmers"
        }
      ],
      image: "/helen.png",
      github: "https://github.com/gaga477",
      live: "https://example.com"
    },
    {
      title: "Green Earth Initiative",
      description: "An environmental impact portal for sustainability programs, volunteering, and green campaigns.",
      tags: ["React", "Node.js", "Express", "MongoDB", "Sustainability"],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=240&fit=crop",
          caption: "Community tree planting"
        },
        {
          url: "https://images.unsplash.com/photo-1486438031753-781b31d0c67e?w=400&h=240&fit=crop",
          caption: "Eco-friendly initiatives"
        }
      ],
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=340&fit=crop",
      github: "https://github.com/gaga477",
      live: "https://example.com"
    },
    {
      title: "Zunny Mini Mart",
      description: "A modern full-stack mini mart and grocery e-commerce platform with product management, shopping cart, secure checkout, customer authentication, inventory tracking, and responsive mobile-first design.",
      tags: ["React", "Node.js", "Express", "MongoDB", "Paystack API", "JWT Auth"],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400&h=240&fit=crop",
          caption: "Storefront product browsing"
        },
        {
          url: "https://images.unsplash.com/photo-1523575335684-37898b6baf30?w=400&h=240&fit=crop",
          caption: "Mobile shopping experience"
        },
        {
          url: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=400&h=240&fit=crop",
          caption: "Cart and checkout flow"
        },
        {
          url: "https://images.unsplash.com/photo-1551076805-e1869033e46d?w=400&h=240&fit=crop",
          caption: "Inventory tracking dashboard"
        }
      ],
      image: "/zunny.png",
      github: "https://github.com/gaga477",
      live: "https://example.com"
    },
    {
      title: "Skincare Store",
      description: "A modern e-commerce platform for selling skincare products with a focus on natural ingredients and sustainable practices.",
      tags: ["React", "Node.js", "Express", "MongoDB", "Paystack API", "JWT Auth"],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400&h=240&fit=crop",
          caption: "Beauty product showcase"
        },
        {
          url: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&h=240&fit=crop",
          caption: "Clean, minimal product pages"
        },
        {
          url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=240&fit=crop",
          caption: "Secure checkout process"
        },
        {
          url: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=240&fit=crop",
          caption: "Inventory and order tracking"
        }
      ],
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=340&fit=crop",
      github: "https://github.com/gaga477",
      live: "https://example.com"
    }
  ]);
  res.send("Seeded");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

const PORT = process.env.PORT || process.env.APP_PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));