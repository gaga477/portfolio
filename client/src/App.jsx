import { useState, useEffect } from "react";

const fallbackProjects = [
  {
    id: 1,
    title: "Agro E-commerce Website",
    description: "Online platform for buying and selling agricultural products. Features product listings, shopping cart, order management, and farmer-to-buyer direct sales.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=340&fit=crop",
    gallery: [
      { url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=240&fit=crop", caption: "Fresh Farm Produce" },
      { url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=240&fit=crop", caption: "Farmer Marketplace" },
      { url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=240&fit=crop", caption: "Order Management" },
      { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=240&fit=crop", caption: "Agricultural Products" }
    ],
    github: "https://github.com/gaga477",
    live: "https://example.com"
  },
  {
    id: 2,
    title: "Skincare Store",
    description: "A modern skincare e-commerce platform with product filtering, user authentication, and a clean responsive UI.",
    tags: ["React", "Node.js", "MongoDB", "CSS"],
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=340&fit=crop",
    gallery: [],
    github: "https://github.com/gaga477",
    live: "https://example.com"
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "A responsive personal portfolio website showcasing projects and skills. Built with React and Node.js with a contact form and MongoDB backend.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop",
    gallery: [],
    github: "https://github.com/gaga477/portfolio",
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
        {p.gallery.length > 0 && (
          <div className="gallery-grid">
            {p.gallery.map((g, i) => (
              <div key={i} className="gallery-grid-item" onClick={() => onPhotoClick(g)}>
                <img src={g.url} alt={g.caption} />
                <span>{g.caption}</span>
              </div>
            ))}
          </div>
        )}
        <div className="tags">
          {p.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
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

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => { if (data.length) setProjects(data); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    const res = await fetch("/api/contact", {
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
                    {p.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
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

      <section id="contact">
        <h2>Contact</h2>
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
      </section>

      <footer>
        <p>© {new Date().getFullYear()} Ogaga Ejairu. Built with React & Node.js</p>
      </footer>
    </>
  );
}
