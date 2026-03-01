# Supabase Setup Instructions

## Your Supabase Credentials

- **Project URL**: `https://jepducibepowwddpahjb.supabase.co`
- **API Key**: `sb_publishable_k3M5wIx_tSQwiyWljvFRjw_OaakMVMF`

## Setup Steps

### 1. Create `.env` file in the `server` directory

Create a file named `.env` in the `server` folder with the following content:

```env
# Supabase Configuration
SUPABASE_URL=https://jepducibepowwddpahjb.supabase.co
SUPABASE_ANON_KEY=sb_publishable_k3M5wIx_tSQwiyWljvFRjw_OaakMVMF

# Server Configuration
PORT=8080
```

### 2. Verify Your Supabase Anon Key

**Important**: The key format you provided (`sb_publishable_...`) is unusual. Supabase anon keys are typically JWT tokens that start with `eyJ`.

To get your correct anon key:
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Under **Project API keys**, find the **anon/public** key
5. It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

If the key you provided doesn't work, replace `SUPABASE_ANON_KEY` in your `.env` file with the anon key from the dashboard.

### 3. Run the Database Migration

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the entire contents of `server/migrations/create_designs_table.sql`
5. Click **Run** (or press Ctrl+Enter)
6. You should see a success message confirming the table was created

### 4. Test the Connection

Start your server:
```bash
cd server
npm install
npm start
```

You should see:
```
Connected to Supabase PostgreSQL
Server has started on port 8080
```

If you see an error about the key format, make sure you're using the correct anon key from the Supabase dashboard.

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure your `.env` file is in the `server` directory
- Check that the variable names are exactly `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### Error: "Invalid API key"
- Verify you're using the **anon/public** key, not the service_role key
- Make sure there are no extra spaces or quotes around the key in your `.env` file

### Error: "relation 'designs' does not exist"
- Make sure you've run the SQL migration in the Supabase SQL Editor
- Check that the table was created successfully
