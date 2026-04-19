import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true,
      index: true
    },

    description: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    },

    stock: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

productSchema.index({ category: 1, price: 1 });

export const productModel = mongoose.model("Product", productSchema);
