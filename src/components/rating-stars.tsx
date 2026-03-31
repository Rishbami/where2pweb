export function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.round(rating);

  return (
    <div className="flex items-center gap-1 text-amber-500" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < fullStars ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </div>
  );
}
