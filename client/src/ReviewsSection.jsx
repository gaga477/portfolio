import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "";
const STARS = [5, 4, 3, 2, 1];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch reviews");
        return r.json();
      })
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setForm({ name: "", rating: 5, comment: "" });
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section id="reviews">
      <h2>Client Reviews</h2>

      <div className="reviews-meta">
        <span className="reviews-avg">⭐ {avg} / 5</span>
        <span className="reviews-count">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="reviews-layout">
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Leave a Review</h3>
          <input
            placeholder="Your Name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <select
            value={form.rating}
            onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
          >
            {STARS.map(n => <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>)}
          </select>
          <textarea
            placeholder="Share your experience..."
            required
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
          />
          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={status === "loading"}>
            {status === "loading" ? "Submitting…" : "Submit Review"}
          </button>
          {status === "success" && <p className="success-msg">✓ Review submitted!</p>}
          {status === "error" && <p style={{ color: "red" }}>✗ Failed to submit. Check your connection and try again.</p>}
        </form>

        <div className="reviews-list">
          {loading && <p style={{ color: "#555" }}>Loading reviews…</p>}
          {!loading && reviews.length === 0 && <p style={{ color: "#555" }}>No reviews yet. Be the first!</p>}
          {reviews.map((r, i) => (
            <div key={r._id || i} className="review-card">
              <div className="review-card-header">
                <div className="review-avatar">{r.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="review-name">{r.name}</p>
                  <div className="review-stars">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                </div>
                {r.createdAt && (
                  <span className="review-date">{formatDate(r.createdAt)}</span>
                )}
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
