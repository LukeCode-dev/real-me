import mongoose from 'mongoose';

const measurementsSchema = new mongoose.Schema({
  height: { type: Number, min: 100, max: 250 },       // cm
  weight: { type: Number, min: 30, max: 300 },         // kg
  chest: { type: Number, min: 50, max: 200 },          // cm
  waist: { type: Number, min: 40, max: 180 },          // cm
  hips: { type: Number, min: 50, max: 200 },           // cm
  shoulders: { type: Number, min: 30, max: 70 },       // cm
  inseam: { type: Number, min: 50, max: 120 },         // cm
  armLength: { type: Number, min: 40, max: 100 },      // cm
  neckCircumference: { type: Number, min: 25, max: 60 },
  shoeSize: { type: Number, min: 20, max: 55 },        // EU
}, { _id: false });

const avatarSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  measurements: { type: measurementsSchema, required: true },
  appearance: {
    skinTone: { type: String, default: '#d4a574' },
    hairColor: { type: String, default: '#1a1a1a' },
    hairStyle: { type: String, default: 'Medium' },
    eyeColor: { type: String, default: '#634e34' },
    faceShape: { type: String, default: 'Oval' },
    bodyType: { type: String, default: 'Average' },
  },
  photos: [{ type: String }],   // URLs to uploaded scan photos
  model3dUrl: { type: String },  // URL to generated 3D model file
  isComplete: { type: Boolean, default: false },
}, { timestamps: true });

// Calculate recommended clothing size based on measurements
avatarSchema.methods.getRecommendedSize = function (sizeChart) {
  const { chest, waist, hips } = this.measurements;
  // Simple size recommendation logic
  const avgMeasurement = (chest + waist + hips) / 3;

  if (avgMeasurement < 78) return 'XS';
  if (avgMeasurement < 85) return 'S';
  if (avgMeasurement < 93) return 'M';
  if (avgMeasurement < 101) return 'L';
  if (avgMeasurement < 110) return 'XL';
  return 'XXL';
};

export default mongoose.model('Avatar', avatarSchema);
