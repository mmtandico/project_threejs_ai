import mongoose from 'mongoose';

const DesignSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String },
    description: { type: String },

    // AI prompt used to generate textures / logos
    prompt: { type: String },

    // Shirt customization state
    color: { type: String }, // hex like #ffffff
    isLogoTexture: { type: Boolean, default: false },
    isFullTexture: { type: Boolean, default: false },

    // Asset locations (typically Cloudinary URLs)
    logoUrl: { type: String },
    textureUrl: { type: String },

    // Optional user identification (if you add auth later)
    userId: { type: String },
  },
  { timestamps: true }
);

const Design = mongoose.models.Design || mongoose.model('Design', DesignSchema);

export default Design;
