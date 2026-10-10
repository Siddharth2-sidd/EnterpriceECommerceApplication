
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getProductReviews,getProductRating,createProductReview,updateProductReview,deleteProductReview} from "../../api/productReviewApi";

const ProductReviews = ({ productId }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Adapt this to your AuthContext's actual user structure.
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user.id ?? user.userId ?? null);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [reviewsResult, ratingResult] = await Promise.all([
        getProductReviews(productId),
        getProductRating(productId),
      ]);

      const reviewList = Array.isArray(reviewsResult) ? reviewsResult : reviewsResult?.data ?? reviewsResult?.items ?? [];
      if (!Array.isArray(reviewList)) {
        throw new Error("Unexpected reviews response.");
      }
      setReviews(reviewList);

      // Supports a numeric rating or common object response shapes.
      const avg = typeof ratingResult === "number" ? ratingResult : ratingResult?.averageRating ?? ratingResult?.average ?? ratingResult?.rating ??  null;
      const count = ratingResult?.ratingCount ?? ratingResult?.totalReviews ??  ratingResult?.count ??  null;
      setAverageRating(typeof avg === "number" ? avg : null);
      setRatingCount(typeof count === "number" ? count : null);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Unable to load product reviews.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const resetForm = () => {
    setRating(5);
    setComment("");
    setEditingReviewId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      setError("Please select a rating from 1 to 5.");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter your review.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const reviewData = {
        productId: Number(productId),
        rating: Number(rating),
        comment: comment.trim(),
      };

      if (editingReviewId !== null) {
        await updateProductReview(editingReviewId, {
          rating: reviewData.rating,
          comment: reviewData.comment,
        });

        setSuccess("Review updated successfully.");
      } else {
        await createProductReview(reviewData);
        setSuccess("Review submitted successfully.");
      }

      resetForm();
      await loadReviews();
    } catch (err) {
      console.error("Review submission failed:", err);

      setError(err.response?.data?.message ?? "Unable to save your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review.id ?? review.reviewId);
    setRating(Number(review.rating) || 5);
    setComment(review.comment ?? "");
    setError("");
    setSuccess("");
    document.getElementById("review-form") ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (review) => {
    const reviewId = review.id ?? review.reviewId;
    if (reviewId == null) return;
    if (!window.confirm("Delete this review?")) return;
    try {
      setError("");
      setSuccess("");
      await deleteProductReview(reviewId);
      if (editingReviewId === reviewId) {
        resetForm();
      }
      setSuccess("Review deleted successfully.");
      await loadReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
      setError("Unable to delete this review.");
    }
  };

  const renderStars = (value) => {
    const count = Math.max(0,Math.min(5, Math.round(Number(value) || 0)));
    return (
      <span className="review-stars" aria-label={`${count} out of 5 stars`}>
        {"★".repeat(count)}
        <span className="review-stars-empty">
          {"★".repeat(5 - count)}
        </span>
      </span>
    );
  };

  if (loading) {
    return (
      <section className="product-reviews">
        <h2>Customer Reviews</h2>
        <p>Loading reviews...</p>
      </section>
    );
  }

  return (
    <section className="product-reviews">
      <h2>Customer Reviews</h2>

      {averageRating !== null && (
        <div className="review-summary">
          <strong>{averageRating.toFixed(1)} / 5</strong>
          {renderStars(averageRating)}
          {ratingCount !== null && (
            <span>{ratingCount} ratings</span>
          )}
        </div>
      )}

      {error && (
        <p className="review-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="review-success" role="status">
          {success}
        </p>
      )}

      <form id="review-form" className="review-form" onSubmit={handleSubmit}>
        <h3>{editingReviewId !== null ? "Edit Your Review" : "Write a Review"} </h3>
        <label htmlFor="review-rating">Rating</label>
        <select id="review-rating" value={rating} onChange={(event) => setRating(Number(event.target.value))} required>
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very Good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
        <label htmlFor="review-comment">Your Review</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          maxLength={2000}
          required
        />

        <div className="review-form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : editingReviewId !== null
                ? "Update Review"
                : "Submit Review"}
          </button>

          {editingReviewId !== null && (
            <button
              type="button"
              className="review-cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="review-list">
        <h3>Reviews ({reviews.length})</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product.</p>
        ) : (
          reviews.map((review, index) => {
            const reviewId = review.id ?? review.reviewId;

            const reviewerName =
              review.user?.name ??
              review.userName ??
              review.customerName ??
              "Customer";

            // Match the review owner using your actual DTO fields.
            const reviewerId =
              review.userId ??
              review.user?.id ??
              null;

            const canManage =
              currentUserId != null &&
              reviewerId != null &&
              String(currentUserId) === String(reviewerId);

            return (
              <article
                className="review-card"
                key={reviewId ?? index}
              >
                <div className="review-card-header">
                  <strong>{reviewerName}</strong>
                  {renderStars(review.rating)}
                </div>

                <p>{review.comment}</p>

                {review.createdOn && (
                  <small>
                    {new Date(review.createdOn).toLocaleDateString()}
                  </small>
                )}

                {canManage && (
                  <div className="review-owner-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(review)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="review-delete-button"
                      onClick={() => handleDelete(review)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
