const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controllers/listings");

const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });


// =====================
// VALIDATE LISTING
// =====================
const validateListing = (req, res, next) => {

  if (!req.body.listing) {
    return next(new ExpressError(400, "Invalid listing data"));
  }

  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }

  next();
};


// =====================
// INDEX & CREATE
// =====================
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),   // ✅ FIXED HERE
    validateListing,
    wrapAsync(listingController.createListing)
  );


// =====================
// NEW FORM
// =====================
router.get(
  "/new",
  isLoggedIn,
  listingController.renderNewForm
);


// =====================
// SHOW, UPDATE, DELETE
// =====================
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),   // ✅ FIXED HERE
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );


// =====================
// EDIT FORM
// =====================
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
