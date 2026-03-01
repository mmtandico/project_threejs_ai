# Supabase Storage Setup for 3D Models and Assets

Since you've removed Cloudinary, you can use Supabase Storage to store your 3D models (GLB files), textures, and other assets.

## Setting Up Supabase Storage

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Name it `assets` (or `3d-models`, `textures`, etc.)
6. Make it **Public** if you want assets to be accessible without authentication
7. Click **"Create bucket"**

### 2. Upload Files

You can upload files through:
- **Supabase Dashboard**: Storage → Select bucket → Upload files
- **Supabase Client**: Use the JavaScript client (see examples below)

### 3. Update Your Code to Use Supabase Storage

#### Upload a file (server-side example):

```javascript
import { supabase } from './config/supabase.js';

// Upload a file
const uploadFile = async (file, bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};
```

#### Get public URL for a file:

```javascript
// Get public URL (for public buckets)
const { data } = supabase.storage
  .from('assets')
  .getPublicUrl('models/shirt_baked.glb');

const url = data.publicUrl;
```

#### Load 3D model from Supabase Storage:

In your React component:

```javascript
// Instead of: '/shirt_baked.glb'
// Use: supabaseStorageUrl + '/shirt_baked.glb'

const { data } = supabase.storage
  .from('assets')
  .getPublicUrl('models/shirt_baked.glb');

const { nodes, materials } = useGLTF(data.publicUrl);
```

## Recommended Bucket Structure

```
assets/
├── models/
│   ├── shirt_baked.glb
│   ├── MaleAvatar1.fbx
│   └── FemaleAvatar.fbx
├── textures/
│   ├── logos/
│   └── patterns/
└── previews/
```

## Storage Policies (Row Level Security)

For public buckets, you may want to set up policies:

1. Go to **Storage** → Select your bucket → **Policies**
2. Create policies to control read/write access
3. For public read access, create a policy like:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');
```

## Benefits of Supabase Storage

- ✅ Integrated with your Supabase project
- ✅ Free tier: 1GB storage, 2GB bandwidth/month
- ✅ CDN for fast global delivery
- ✅ Automatic image transformations (if needed)
- ✅ Easy to manage from dashboard
- ✅ Works seamlessly with Supabase database

## Migration from Static Assets

If you want to migrate your current static assets (GLB/FBX files) to Supabase Storage:

1. Upload files to Supabase Storage bucket
2. Update your code to load from Supabase URLs instead of local paths
3. Update the `logoUrl` and `textureUrl` fields in your designs to point to Supabase Storage URLs
