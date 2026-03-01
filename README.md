# 3D Swag Customization App

A modern web application for creating and customizing 3D apparel designs with real-time visualization. Built with React, Three.js, and Supabase.

## Overview

This application allows users to:
- Customize 3D shirt designs with colors, logos, and textures
- Upload and apply custom images as logos or full textures
- Create multi-layer designs with text, shapes, and images
- Save and manage design libraries
- Preview designs in real-time with 3D rendering
- Export designs as images

## Tech Stack

### Frontend
- **React.js** (^18.2.0) - UI framework
- **Three.js** (^0.150.1) - 3D graphics library
- **React Three Fiber** (^8.12.0) - React renderer for Three.js
- **React Three Drei** (^9.58.5) - Useful helpers for R3F
- **Vite** (^7.3.1) - Build tool and dev server
- **Tailwind CSS** (^3.3.0) - Utility-first CSS framework
- **Framer Motion** (^10.9.4) - Animation library
- **Valtio** (^1.10.3) - State management
- **React Color** (^2.19.3) - Color picker component

### Backend
- **Node.js** - Runtime environment
- **Express.js** (^4.18.2) - Web framework
- **Supabase** (^2.39.0) - Backend-as-a-Service
  - PostgreSQL database for design storage
  - Storage for 3D models and assets

### Development Tools
- **Nodemon** (^3.1.14) - Auto-restart server on changes
- **TypeScript types** - Type definitions for React
- **PostCSS & Autoprefixer** - CSS processing

## Project Structure

```
project_threejs_ai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── canvas/        # 3D rendering components
│   │   ├── components/    # UI components
│   │   ├── config/        # Configuration files
│   │   ├── pages/         # Page components
│   │   └── store/         # State management
│   └── package.json
├── server/                 # Backend Express API
│   ├── config/            # Configuration (Supabase)
│   ├── routes/            # API routes
│   ├── migrations/        # Database migrations
│   └── package.json
└── README.md
```

## Features

- **3D Visualization**: Real-time 3D rendering of customizable shirts
- **Color Customization**: Full color picker with live preview
- **Image Upload**: Upload logos and textures to apply to designs
- **Multi-layer System**: Create complex designs with multiple layers
- **Text & Shapes**: Add text and geometric shapes to designs
- **Design Library**: Save and manage your custom designs
- **Responsive Design**: Works on desktop and mobile devices
- **Export Functionality**: Download designs as images

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for database and storage)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project_threejs_ai
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

## Configuration

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. **Set up the database:**
   - Go to SQL Editor in your Supabase dashboard
   - Run the migration SQL from `server/migrations/create_designs_table.sql`

3. **Set up Storage:**
   - Create a storage bucket named `3d-models`
   - Upload your 3D model files:
     - `shirt_baked.glb`
     - `MaleAvatar1.fbx`
     - `FemaleAvatar.fbx`
   - Make the bucket public for public access

4. **Environment Variables**

   Create `server/.env`:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=8080
   ```

   Create `client/.env` (optional):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Running the Application

1. **Start the server**
   ```bash
   cd server
   npm start
   ```
   Server runs on `http://localhost:8080`

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## API Endpoints

### Designs
- `GET /api/v1/designs` - Get all saved designs
- `POST /api/v1/designs` - Create a new design

## Database Schema

The `designs` table stores:
- Basic info (name, description, prompt)
- Customization state (color, texture flags)
- Asset URLs (logo, texture, preview)
- Size and measurements
- Multi-layer design data (JSONB)
- Timestamps

See `server/migrations/create_designs_table.sql` for full schema.

## Storage

3D models and assets are stored in Supabase Storage:
- Bucket: `3d-models`
- Files: GLB/FBX models, textures, preview images

## Development

### Client
- Development server with hot reload
- Vite for fast builds
- Tailwind CSS for styling

### Server
- Nodemon for auto-restart
- Express API with CORS enabled
- Supabase client for database operations

## Build for Production

### Client
```bash
cd client
npm run build
```
Output: `client/dist`

### Server
Deploy to your preferred hosting service (Render, Railway, etc.)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
