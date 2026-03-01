import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { supabase } from './config/supabase.js';

import designRoutes from './routes/design.routes.js';

dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API routes
app.use('/api/v1/designs', designRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from Design API' });
});

// Supabase connection test + server start
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('designs').select('id').limit(1);

    if (error) {
      // Check if error is about table not existing
      const isTableNotFound =
        error.code === 'PGRST116' ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('relation') && error.message?.includes('does not exist');

      if (isTableNotFound) {
        console.warn('⚠️  Table "designs" not found in Supabase.');
        console.warn('📝 Please run the migration SQL:');
        console.warn('   1. Go to https://supabase.com/dashboard');
        console.warn('   2. Select your project');
        console.warn('   3. Go to SQL Editor');
        console.warn('   4. Copy and paste the SQL from: server/migrations/create_designs_table.sql');
        console.warn('   5. Click "Run" to execute the migration');
        console.warn('');
        console.warn('Server will start, but design endpoints will not work until the table is created.');
      } else {
        console.warn('Supabase connection test failed:', error.message);
      }
    } else {
      console.log('✅ Connected to Supabase PostgreSQL');
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server has started on port ${PORT}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();