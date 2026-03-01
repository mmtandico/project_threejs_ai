# Migration Guide: MongoDB to Supabase PostgreSQL

This guide documents the migration from MongoDB to Supabase PostgreSQL.

## Changes Made

### 1. Dependencies
- **Removed**: `mongoose` (MongoDB ODM)
- **Added**: `@supabase/supabase-js` (Supabase client library)

### 2. Database Configuration
- **Old**: MongoDB connection string in `server/index.js`
- **New**: Supabase client configuration in `server/config/supabase.js`

### 3. Database Schema
- **Old**: Mongoose schema in `server/models/Design.js`
- **New**: PostgreSQL table created via SQL migration in `server/migrations/create_designs_table.sql`

### 4. API Routes
- **Updated**: `server/routes/design.routes.js` now uses Supabase queries instead of Mongoose
- Field names converted from camelCase to snake_case for database storage
- API responses maintain camelCase for backward compatibility

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Set Up Supabase
1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from the Supabase dashboard
3. Add these to your `.env` file:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Run Database Migration
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `server/migrations/create_designs_table.sql`
4. Run the SQL to create the `designs` table

### 4. Update Environment Variables
Remove old MongoDB variables (if present):
- `MONGODB_URI`
- `MONGODB_DB_NAME`

Add new Supabase variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Schema Mapping

| MongoDB (Mongoose) | PostgreSQL (Supabase) |
|-------------------|----------------------|
| `_id` (ObjectId) | `id` (UUID) |
| `createdAt` | `created_at` (TIMESTAMP) |
| `updatedAt` | `updated_at` (TIMESTAMP) |
| `isLogoTexture` | `is_logo_texture` (BOOLEAN) |
| `isFullTexture` | `is_full_texture` (BOOLEAN) |
| `logoUrl` | `logo_url` (TEXT) |
| `textureUrl` | `texture_url` (TEXT) |
| `sizeLabel` | `size_label` (TEXT) |
| `shirtDetails` (Object) | `shirt_details` (JSONB) |
| `layers` (Array) | `layers` (JSONB) |
| `previewImage` | `preview_image` (TEXT) |
| `userId` | `user_id` (TEXT) |

## API Compatibility

The API endpoints remain the same:
- `GET /api/v1/designs` - List all designs
- `POST /api/v1/designs` - Create a new design

The API responses maintain camelCase field names for backward compatibility with the frontend.

## Notes

- The migration SQL includes automatic timestamp updates via triggers
- Indexes are created on `created_at` and `user_id` for performance
- The client code has been updated to support both `id` (new) and `_id` (legacy) for backward compatibility during migration
