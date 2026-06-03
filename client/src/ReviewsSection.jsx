import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then(r => r.json())
      .then(setReviews)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch(`${API}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating, comment })
    });
    if (res.ok) {
      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setName(""); setRating(5); setComment("");
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section className="max-w-5xl mx-auto py-20 px-6">
      <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold">⭐ {avg} / 5</h3>
        <p>{reviews.length} Reviews</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl mb-10">
        <input
          type="text" placeholder="Your Name" required
          className="w-full p-3 rounded mb-4 text-black"
          value={name} onChange={e => setName(e.target.value)}
        />
        <select
          className="w-full p-3 rounded mb-4 text-black"
          value={rating} onChange={e => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star</option>)}
        </select>
        <textarea
          placeholder="Write your review..." required rows="4"
          className="w-full p-3 rounded mb-4 text-black"
          value={comment} onChange={e => setComment(e.target.value)}
        />
        <button type="submit" className="bg-green-600 px-6 py-3 rounded-xl">Submit Review</button>
        {status === "success" && <p className="mt-3 text-green-400">✓ Review submitted!</p>}
        {status === "error" && <p className="mt-3 text-red-400">✗ Failed to submit. Try again.</p>}
      </form>

      <div className="grid gap-6">
        {reviews.map((r, i) => (
          <div key={r._id || i} className="bg-slate-800 p-6 rounded-2xl shadow">
            <h4 className="font-semibold">{r.name}</h4>
            <div className="flex my-2">
              {[...Array(r.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <p className="text-slate-300">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
