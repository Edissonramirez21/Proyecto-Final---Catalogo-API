//product schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      default: ['all'],
      ref: "Category",
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
//Virtuals

// Middleware para operaciones de actualización
// Simplificar el middleware para manejar solo la creación y no la actualización
ProductSchema.pre('save', function(next) {
  if (!this.category.includes('all')) {
    this.category.push('all');
  }
  next();
});

//qty left
ProductSchema.virtual("qtyLeft").get(function () {
  const product = this;
  return product.totalQty - product.totalSold;
});
//Total rating
ProductSchema.virtual("totalReviews").get(function () {
  const product = this;
  return product?.reviews?.length;
});
//average Rating
ProductSchema.virtual("averageRating").get(function () {
  let ratingsTotal = 0;
  const product = this;
  product?.reviews?.forEach((review) => {
    ratingsTotal += review?.rating;
  });
  //calc average rating
  const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(
    1
  );
  return averageRating;
});
const Product = mongoose.model("Product", ProductSchema);

export default Product;
