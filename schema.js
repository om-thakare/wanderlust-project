const Joi = require("joi");

// ======================
// LISTING VALIDATION
// ======================
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),

    description: Joi.string().trim().required(),

    location: Joi.string().trim().required(),

    country: Joi.string().trim().required(),

    // price comes as string from form → Joi converts automatically
    price: Joi.number().min(0).required(),

    // multer handles file, so keep optional
    image: Joi.any().optional(),

    category: Joi.string().trim().required(),
  }).required(),
}).options({
  allowUnknown: true,   // prevents multer fields crash
  abortEarly: false     // show all validation errors
});


// ======================
// REVIEW VALIDATION
// ======================
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().required(),
  }).required(),
});


module.exports = {
  listingSchema,
  reviewSchema,
};
