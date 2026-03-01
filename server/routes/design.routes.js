import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// GET /api/v1/designs - list all saved designs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform snake_case to camelCase for API response
    const designs = data.map(design => ({
      id: design.id,
      name: design.name,
      description: design.description,
      prompt: design.prompt,
      color: design.color,
      isLogoTexture: design.is_logo_texture,
      isFullTexture: design.is_full_texture,
      logoUrl: design.logo_url,
      textureUrl: design.texture_url,
      sizeLabel: design.size_label,
      shirtDetails: design.shirt_details,
      layers: design.layers,
      previewImage: design.preview_image,
      userId: design.user_id,
      createdAt: design.created_at,
      updatedAt: design.updated_at,
    }));

    res.status(200).json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch designs', error: error.message });
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

    // Transform camelCase to snake_case for database
    const { data, error } = await supabase
      .from('designs')
      .insert([
        {
          name,
          description,
          prompt,
          color,
          is_logo_texture: isLogoTexture,
          is_full_texture: isFullTexture,
          logo_url: logoUrl,
          texture_url: textureUrl,
          size_label: sizeLabel,
          shirt_details: shirtDetails,
          layers: layers || [],
          preview_image: previewImage,
          user_id: userId,
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform snake_case to camelCase for API response
    const design = {
      id: data.id,
      name: data.name,
      description: data.description,
      prompt: data.prompt,
      color: data.color,
      isLogoTexture: data.is_logo_texture,
      isFullTexture: data.is_full_texture,
      logoUrl: data.logo_url,
      textureUrl: data.texture_url,
      sizeLabel: data.size_label,
      shirtDetails: data.shirt_details,
      layers: data.layers,
      previewImage: data.preview_image,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

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
