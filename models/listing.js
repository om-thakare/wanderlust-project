const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      url: String,
      filename: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    category: {
  type: String,
  required: true,
  enum: ["Trending","Rooms","Iconic cities","Mountains","Castles","Amazing Pools","Farm","Camping","Arctic","Hiking","Beach"]
},



    // ✅ GEOJSON FIELD (MUST BE INSIDE MAIN OBJECT)
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Required for geospatial queries
listingSchema.index({ geometry: "2dsphere" });

// Delete associated reviews when listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing && listing.reviews.length > 0) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
