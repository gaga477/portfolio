import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const initialReviews = [
  {
    name: "John Smith",
    rating: 5,
    comment: "Excellent developer. Delivered my hotel website on time.",
  },
  {
    name: "Sarah Johnson",
    rating: 4,
    comment: "Professional and easy to work with.",
  },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("reviews");
      return saved ? JSON.parse(saved) : initialReviews;
    } catch (err) {
      return initialReviews;
    }
  });

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("reviews", JSON.stringify(reviews));
    } catch (err) {
      // ignore write errors
    }
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      name: name || "Anonymous",
      rating,
      comment,
    };

    setReviews([newReview, ...reviews]);

    setName("");
    setRating(5);
    setComment("");
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
    (reviews.length || 1);

  return (
    <section className="max-w-5xl mx-auto py-20 px-6">
      <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold">⭐ {averageRating.toFixed(1)} / 5</h3>
        <p>{reviews.length} Reviews</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl mb-10">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 rounded mb-4 text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          className="w-full p-3 rounded mb-4 text-black"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {num} Star
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your review..."
          className="w-full p-3 rounded mb-4 text-black"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button type="submit" className="bg-green-600 px-6 py-3 rounded-xl">
          Submit Review
        </button>
      </form>

      <div className="grid gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-slate-800 p-6 rounded-2xl shadow">
            <h4 className="font-semibold">{review.name}</h4>

            <div className="flex my-2">
              {[...Array(review.rating || 0)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            <p className="text-slate-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
