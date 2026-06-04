import { useState, useEffect } from "react";
import ReviewsSection from "./ReviewsSection";

const fallbackProjects = [
  {
    id: 1,
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
    id: 2,
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
    id: 5,
    title: "Zunny Mini Mart",
    description:
      "A modern full-stack mini mart and grocery e-commerce platform with product management, shopping cart, secure checkout, customer authentication, inventory tracking, and responsive mobile-first design.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Paystack API",
      "JWT Auth"
    ],
    image:
      "/zunny.png",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400&h=240&fit=crop",
        caption: "Storefront product browsing"
      },
      {
        url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=240&fit=crop",
        caption: "Mobile shopping experience"
      },
      {
        url: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=400&h=240&fit=crop",
        caption: "Cart and checkout flow"
      },
      {
        url: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=240&fit=crop",
        caption: "Inventory tracking dashboard"
      }
    ],
    github: "https://github.com/gaga477",
    live: "https://example.com"
  },

  {
    id: 3,
    title: "Skincare Store",
    description:
      "A modern e-commerce platform for selling skincare products with a focus on natural ingredients and sustainable practices.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Paystack API",
      "JWT Auth"
    ],
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=340&fit=crop",
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
    github: "https://github.com/gaga477",
    live: "https://example.com"
  }
];

function ProjectCard({ p, onPhotoClick }) {
  return (
    <div className="project-card">
      <img className="project-card-cover" src={p.image} alt={p.title} />
      <div className="project-card-body">
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        {(p.gallery?.length > 0) && (
          <div className="gallery-grid">
            {(p.gallery || []).map((g, i) => (
              <div key={i} className="gallery-grid-item" onClick={() => onPhotoClick(g)}>
                <img src={g.url} alt={g.caption} />
                <span>{g.caption}</span>
              </div>
            ))}
          </div>
        )}
        <div className="tags">
          {(p.tags || []).map(t => <span key={t} className="skill-tag">{t}</span>)}
        </div>
        <div className="project-links">
          <a href={p.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={p.live} target="_blank" rel="noreferrer">Live</a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    fetch(`${apiBase}/api/projects`)
      .then(r => r.json())
      .then(data => { 
        if (data && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {
        // If API fails, use fallback projects
        console.log("Using fallback projects");
      });
  }, [apiBase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    const res = await fetch(`${apiBase}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } else {
      setError(true);
    }
  };

  return (
    <>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close">✕</button>
          <img src={lightbox.url} alt={lightbox.caption} onClick={e => e.stopPropagation()} />
          <p>{lightbox.caption}</p>
        </div>
      )}

      <nav>
        <span className="logo">OE.</span>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <div className="hero">
        <div className="hero-text">
          <h1>Hi, I'm <span>Ogaga Ejairu</span></h1>
          <p>Full Stack Developer building modern web applications with React & Node.js</p>
          <div className="hero-btns">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-outline">Contact Me</a>
          </div>
          <div className="hero-contact">
            <a href="mailto:ejairuogaga@gmail.com">📧 ejairuogaga@gmail.com</a>
            <a href="tel:+2347048666541">📞 +234 704 866 6541</a>
          </div>
        </div>
        <div className="hero-featured">
          <p className="hero-projects-label">Featured Projects</p>
          <div className="hero-cards">
            {projects.map(p => (
              <div key={p.id} className="hero-card">
                <img className="hero-card-cover" src={p.image} alt={p.title} />
                <div className="hero-card-body">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="tags">
                    {(p.tags || []).map(t => <span key={t} className="skill-tag">{t}</span>)}
                  </div>
                  <div className="project-links">
                    <a href={p.github} target="_blank" rel="noreferrer">GitHub</a>
                    <a href={p.live} target="_blank" rel="noreferrer">Live</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="about">
        <h2>About Me</h2>
        <p className="about-text">
          I'm a full stack developer passionate about building clean, performant web applications.
          I work across the entire stack — from designing REST APIs with Node.js and MongoDB,
          to crafting responsive UIs with React.
        </p>
        <div className="skills">
          {["React", "Node.js", "Express", "MongoDB", "JavaScript", "REST APIs", "Git", "CSS"].map(s => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects.map(p => (
            <ProjectCard key={p.id} p={p} onPhotoClick={setLightbox} />
          ))}
        </div>
      </section>

      <ReviewsSection />

      <section id="contact">
        <h2>Contact</h2>
        <div className="contact-container">
          <div className="contact-content">
            <div className="contact-info">
              <a href="mailto:ejairuogaga@gmail.com">📧 ejairuogaga@gmail.com</a>
              <a href="tel:+2347048666541">📞 +234 704 866 6541</a>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input placeholder="Your Name" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Your Email" type="email" value={form.email} required onChange={e => setForm({ ...form, email: e.target.value })} />
              <textarea placeholder="Your Message" value={form.message} required onChange={e => setForm({ ...form, message: e.target.value })} />
              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>Send Message</button>
              {sent && <p className="success-msg">✓ Message sent successfully!</p>}
              {error && <p style={{ color: "red" }}>✗ Failed to send. Please try again.</p>}
            </form>
          </div>
          <div className="contact-image">
            <img src="/tech1.png" alt="Technology" />
          </div>
        </div>
      </section> 

      <footer>
        <p>© {new Date().getFullYear()} Ogaga Ejairu. Built with React & Node.js</p>
      </footer>
    </>
  );
}
