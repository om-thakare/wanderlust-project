const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");

const { isLoggedIn } = require("../middleware");
const reviewController = require("../controllers/reviews");

// =====================
// VALIDATE REVIEW
// =====================
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg); // ✅ NO redirect here
  }

  next();
};

// =====================
// CREATE REVIEW
// =====================
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// =====================
// DELETE REVIEW
// =====================
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
