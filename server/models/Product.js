import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  offerPrice: Number,
  category: String,
  image: [String],
  inStock: {
    type: Boolean,
    default: true
  }
});

const Product = mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
