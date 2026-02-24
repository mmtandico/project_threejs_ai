import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import dalleRoutes from './routes/dalle.routes.js';
import designRoutes from './routes/design.routes.js';

dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API routes
app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/v1/designs', designRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from DALL.E' });
});

// MongoDB connection + server start
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. MongoDB will not be connected.');
}

const startServer = async () => {
  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || undefined,
      });
      console.log('Connected to MongoDB Atlas');
    }

    app.listen(PORT, () =>
      console.log(`Server has started on port ${PORT}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();