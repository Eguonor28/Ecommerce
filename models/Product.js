import mongoose from "mongoose";

//A model is a blueprint or format we want our information to go into the data base
//Mogoose it used for data modeling, to define the structure and validate it before passing it to the data base

//define the product schema (structure of products data in the database)
// name, description price1, price discount, category, date, userid,
const productSchema = new mongoose.Schema({
  //reference the user that created the product
  userId: {
    type: String,
    required: true,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Number,
    required: true,
  },
  //array of image urls
  image: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
});

// Check if model already exists to prevent recompilation
// if it exists, use the existing model; if not, create new one
const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

//Export the Product model for use in other files
export default Product;
