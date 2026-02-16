const Listing = require("../models/listing");
const axios = require("axios");

// ==============================
// INDEX - search & category
// ==============================
module.exports.index = async (req, res) => {
  const { search, category } = req.query;
  let filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  const allListings = await Listing.find(filter);

  return res.render("listings/index", {
    allListings,
    searchQuery: search || "",
    selectedCategory: category || "",
  });
};

// ==============================
// NEW FORM
// ==============================
module.exports.renderNewForm = (req, res) => {
  return res.render("listings/new");
};

// ==============================
// CREATE LISTING
// ==============================
module.exports.createListing = async (req, res) => {
  if (!req.body.listing) {
    req.flash("error", "Invalid listing data");
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // ---------- GEO CODING ----------
  const location = req.body.listing.location;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: location, format: "json", limit: 1 },
        headers: { "User-Agent": "wanderlust-app" },
      }
    );

    if (response.data.length) {
      const data = response.data[0];
      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
      };
    }
  } catch (geoError) {
    console.log("Geocoding failed:", geoError.message);
  }

  // ---------- IMAGE ----------
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();

  req.flash("success", "New listing created!");
  return res.redirect(`/listings/${newListing._id}`);
};

// ==============================
// SHOW LISTING
// ==============================
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  return res.render("listings/show", {
    listing,
    currUser: req.user,
  });
};

// ==============================
// EDIT FORM
// ==============================
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  return res.render("listings/edit", { listing });
};

// ==============================
// UPDATE LISTING
// ==============================
module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    req.flash("error", "Invalid listing data");
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  Object.assign(listing, req.body.listing);

  // ---------- IMAGE ----------
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing updated successfully!");
  return res.redirect(`/listings/${listing._id}`);
};

// ==============================
// DELETE LISTING
// ==============================
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);

  req.flash("success", "Listing deleted successfully!");
  return res.redirect("/listings");
};
