const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB ✅");

  // Delete old data
  await Listing.deleteMany({});

  // Add owner to each listing
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "698ca79a4fe25bfc24023102", // replace with valid User _id
  }));

  // Insert new data
  await Listing.insertMany(listingsWithOwner);

  console.log("Data was initialized successfully 🚀");
  mongoose.connection.close();
}

main().catch((err) => {
  console.error("Seeder error ❌");
  console.error(err);
});
