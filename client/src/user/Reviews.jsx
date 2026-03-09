import ReviewSection from "../features/reviews/ReviewSection";

export function Reviews() {
  return (
    <div className="reviews-page">
      <div className="reviews-page__hero">
        <h1 className="reviews-page__hero-title">What Our Clients Say</h1>
        <p className="reviews-page__hero-sub">
          Thousands of happy clients trust us to find their dream property
        </p>
      </div>
      <div className="reviews-page__content">
        <ReviewSection />
      </div>
    </div>
  );
}
