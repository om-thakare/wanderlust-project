const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,        // ✅ must have comment
    trim: true,
  },

  rating: {
    type: Number,
    required: true,        // ✅ must have rating
    min: 1,
    max: 5,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,        // ✅ review must belong to user
  }
});

module.exports = mongoose.model("Review", reviewSchema);
