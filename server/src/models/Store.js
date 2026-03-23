import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  description: { type: String },
  logo: { type: String },
  coverImage: { type: String },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
  },
  theme: {
    primaryColor: { type: String, default: '#00d4ff' },
    style: { type: String, enum: ['modern', 'luxury', 'street', 'minimal'], default: 'modern' },
  },
  categories: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Store', storeSchema);
