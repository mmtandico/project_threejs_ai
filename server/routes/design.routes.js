import express from 'express';

import Design from '../models/Design.js';

const router = express.Router();

// GET /api/v1/designs - list all saved designs
router.get('/', async (req, res) => {
  try {
    const designs = await Design.find().sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch designs' });
  }
});

// POST /api/v1/designs - create a new design
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      prompt,
      color,
      isLogoTexture,
      isFullTexture,
      logoUrl,
      textureUrl,
      sizeLabel,
      shirtDetails,
      layers,
      previewImage,
      userId,
    } = req.body;

    const design = await Design.create({
      name,
      description,
      prompt,
      color,
      isLogoTexture,
      isFullTexture,
      logoUrl,
      textureUrl,
      sizeLabel,
      shirtDetails,
      layers,
      previewImage,
      userId,
    });

    res.status(201).json(design);
  } catch (error) {
    console.error('Error saving design:', error);
    res.status(500).json({
      message: 'Failed to save design',
      error: error.message
    });
  }
});

export default router;
