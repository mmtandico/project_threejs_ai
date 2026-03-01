# Quick Start Guide

## Step 1: Run Database Migration

You need to create the `designs` table in Supabase. Follow these steps:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Sign in and select your project

2. **Open SQL Editor**
   - Click on **"SQL Editor"** in the left sidebar
   - Click **"New query"** button

3. **Copy the Migration SQL**
   - Open the file: `server/migrations/create_designs_table.sql`
   - Copy **ALL** the contents (Ctrl+A, then Ctrl+C)

4. **Paste and Run**
   - Paste the SQL into the Supabase SQL Editor
   - Click the **"Run"** button (or press Ctrl+Enter)
   - You should see a success message

5. **Verify Table Created**
   - Go to **"Table Editor"** in the left sidebar
   - You should see a `designs` table listed

## Step 2: Start the Server

```bash
cd server
npm install
npm start
```

You should see:
```
✅ Connected to Supabase PostgreSQL
🚀 Server has started on port 8080
```

If you see a warning about the table not being found, go back to Step 1 and make sure you ran the migration SQL.

## Troubleshooting

### "Could not find the table 'public.designs'"
- Make sure you ran the migration SQL in Supabase SQL Editor
- Check that you copied the ENTIRE SQL file (all 61 lines)
- Verify the table exists in Table Editor

### "Missing Supabase environment variables"
- Make sure `server/.env` file exists
- Check that it contains `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Restart the server after creating/updating `.env`

### Connection works but can't save designs
- Verify the table was created successfully
- Check that all columns exist in the `designs` table
- Make sure your Supabase anon key has the correct permissions
