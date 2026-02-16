const Review = require("../models/review");
const Listing = require("../models/listing");

// =====================
// CREATE REVIEW
// =====================
module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!req.body.review) {
    req.flash("error", "Invalid review data");
    return res.redirect(`/listings/${id}`);
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;

  await review.save();
  listing.reviews.push(review._id);
  await listing.save();

  req.flash("success", "New Review Created!");
  return res.redirect(`/listings/${id}`); // ✅ return added
};

// =====================
// DELETE REVIEW
// =====================
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  return res.redirect(`/listings/${id}`); // ✅ return added
};
