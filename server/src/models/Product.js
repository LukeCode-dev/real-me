import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  category: {
    type: String,
    required: true,
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'],
  },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  sizes: [{ type: String }],
  colors: [{
    name: { type: String, required: true },
    hex: { type: String, required: true },
  }],
  images: [{ type: String }],
  model3dUrl: { type: String },
  description: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  sizeChart: {
    type: Map,
    of: {
      chest: { min: Number, max: Number },
      waist: { min: Number, max: Number },
      hips: { min: Number, max: Number },
      length: Number,
    },
  },
  tags: [{ type: String }],
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });

export default mongoose.model('Product', productSchema);
