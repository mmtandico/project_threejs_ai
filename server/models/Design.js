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

    // Size and measurements
    sizeLabel: { type: String },
    shirtDetails: {
      shoulderWidth: { type: String },
      neckCircumference: { type: String },
      chestCircumference: { type: String },
      waistCircumference: { type: String },
      hipToShoulder: { type: String },
      shirtLength: { type: String },
      sleeveLength: { type: String },
    },

    // Multi-layer system for designs
    layers: [{
      id: { type: String },
      name: { type: String },
      image: { type: String },
      visible: { type: Boolean, default: true },
      size: { type: Number },
      offsetX: { type: Number },
      offsetY: { type: Number },
      rotation: { type: Number },
      type: { type: String }, // 'logo' | 'full' | 'text' | 'shape'
      text: { type: String },
      textColor: { type: String },
      fontWeight: { type: String },
      fontStyle: { type: String },
      fontFamily: { type: String },
      outlineEnabled: { type: Boolean, default: false },
      placement: { type: String }, // 'front' | 'back' | 'leftShoulder' | 'rightShoulder'
      // Shape properties
      shapeType: { type: String }, // 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond' | 'hexagon'
      shapeColor: { type: String },
      shapeBorderColor: { type: String },
      shapeBorderWidth: { type: Number },
    }],

    // Preview image (base64 data URL or URL)
    previewImage: { type: String },

    // Optional user identification (if you add auth later)
    userId: { type: String },
  },
  { timestamps: true }
);

const Design = mongoose.models.Design || mongoose.model('Design', DesignSchema);

export default Design;
