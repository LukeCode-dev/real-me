import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/realme',
  jwtSecret: process.env.JWT_SECRET || 'realme-dev-secret-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  stripeSecret: process.env.STRIPE_SECRET_KEY || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};
