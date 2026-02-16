const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");


// ======================
// LOGIN CHECK
// ======================
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {

    // ✅ Only save redirect URL for GET requests
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }

    req.flash("error", "You must be logged in first!");
    return res.redirect("/login"); // ✅ return prevents double response
  }

  next();
};


// ======================
// SAVE REDIRECT URL
// ======================
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};


// ======================
// OWNER CHECK
// ======================
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // ✅ Extra safety if user missing
  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


// ======================
// LISTING VALIDATION
// ======================
module.exports.validateListing = (req, res, next) => {

  // ✅ Prevent crash if body missing
  if (!req.body || !req.body.listing) {
    throw new ExpressError(400, "Invalid listing data");
  }

  const { error } = listingSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg); // ✅ throw instead of redirect
  }

  next();
};
