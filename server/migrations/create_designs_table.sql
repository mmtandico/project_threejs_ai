-- Migration: Create designs table for Supabase PostgreSQL
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Basic info
  name TEXT,
  description TEXT,

  -- AI prompt used to generate textures / logos
  prompt TEXT,

  -- Shirt customization state
  color TEXT, -- hex like #ffffff
  is_logo_texture BOOLEAN DEFAULT false,
  is_full_texture BOOLEAN DEFAULT false,

  -- Asset locations (URLs - can be Supabase Storage URLs or external URLs)
  logo_url TEXT,
  texture_url TEXT,

  -- Size and measurements
  size_label TEXT,
  shirt_details JSONB, -- Stores: shoulderWidth, neckCircumference, chestCircumference, waistCircumference, hipToShoulder, shirtLength, sleeveLength

  -- Multi-layer system for designs (stored as JSONB array)
  layers JSONB DEFAULT '[]'::jsonb,

  -- Preview image (base64 data URL or URL)
  preview_image TEXT,

  -- Optional user identification (if you add auth later)
  user_id TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs(created_at DESC);

-- Create index on user_id if you plan to filter by user
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists (to allow re-running this migration)
DROP TRIGGER IF EXISTS update_designs_updated_at ON designs;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
