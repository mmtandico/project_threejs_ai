import { createClient } from '@supabase/supabase-js';

// Supabase configuration for client-side
// These can be set as environment variables (VITE_ prefix for Vite) or hardcoded
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jepducibepowwddpahjb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcGR1Y2liZXBvd3dkZHBhaGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjI5MzAsImV4cCI6MjA4NzkzODkzMH0.-shKfNQiTLOd7fzfYzcjl4mRg_gTIv5qFmOHAgePgCY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Using default values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get public URL for a file in Supabase Storage
 * @param {string} filePath - Path to the file in the bucket (e.g., 'models/shirt_baked.glb')
 * @param {string} bucketName - Name of the storage bucket (default: '3d-models')
 * @returns {string} Public URL to the file
 */
export const getStorageUrl = (filePath, bucketName = '3d-models') => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data.publicUrl;
};
