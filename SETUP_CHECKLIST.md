# Bookfolio Production Setup Checklist

## Current Issues to Fix

### Issue 1: OAuth redirects to landing page instead of dashboard
**Root Cause**: Middleware or callback handler not working properly

### Issue 2: Books don't appear after adding
**Root Cause**: Missing `custom_order` column OR RLS policies blocking access

## Step-by-Step Fix Guide

### 1. Supabase Database Schema Check

Run this in **Supabase Dashboard → SQL Editor**:

```sql
-- Check books table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'books'
ORDER BY ordinal_position;

-- Check if custom_order column exists
SELECT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_name = 'books'
  AND column_name = 'custom_order'
);

-- Check RLS status on books table
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'books';

-- Check existing RLS policies on books
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'books';
```

**Expected books table columns:**
- id (uuid)
- user_id (uuid)
- title (text)
- author (text)
- cover (text)
- genre (text)
- rating (integer)
- status (text)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)

**Note**: `custom_order` column is OPTIONAL - code works without it

### 2. RLS Policies Configuration

**CRITICAL**: RLS should be **DISABLED** for now, OR you need these policies:

```sql
-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow users to INSERT their own books
CREATE POLICY "Users can insert own books" ON books
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to SELECT their own books
CREATE POLICY "Users can select own books" ON books
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to UPDATE their own books
CREATE POLICY "Users can update own books" ON books
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to DELETE their own books
CREATE POLICY "Users can delete own books" ON books
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Supabase Auth Configuration

Go to **Supabase Dashboard → Authentication → URL Configuration**:

**Site URL**: `https://bookfolio.me`

**Redirect URLs** (add ALL of these):
```
https://bookfolio.me/**
https://www.bookfolio.me/**
https://bookfolio.me/auth/callback
https://www.bookfolio.me/auth/callback
http://localhost:3000/**
http://localhost:3000/auth/callback
```

**Email Templates → Confirm signup**:
- Redirect URL: `https://bookfolio.me/auth/callback`

### 4. Google OAuth Configuration

Go to [Google Cloud Console](https://console.cloud.google.com):

**OAuth Consent Screen**:
- App name: `Bookfolio`
- Application home page: `https://bookfolio.me`
- Authorized domains: `bookfolio.me`

**Credentials → OAuth 2.0 Client ID**:

**Authorized JavaScript origins**:
```
https://bookfolio.me
https://www.bookfolio.me
https://ntjwstcmdpblylkwbgjy.supabase.co
```

**Authorized redirect URIs**:
```
https://ntjwstcmdpblylkwbgjy.supabase.co/auth/v1/callback
```

**IMPORTANT**: Do NOT add bookfolio.me/auth/callback to Google - only the Supabase URL!

### 5. Vercel Environment Variables

Go to **Vercel Dashboard → bookfolio → Settings → Environment Variables**

**Required variables** (all three environments: Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL=https://ntjwstcmdpblylkwbgjy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50andzdGNtZHBibHlsa3diZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDE3MDksImV4cCI6MjA3NTM3NzcwOX0.X_nU7X_GVuf0CkMYkIjLLrK3jEiHj66THSjt53npSns
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50andzdGNtZHBibHlsa3diZ2p5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTgwMTcwOSwiZXhwIjoyMDc1Mzc3NzA5fQ.YoD71NAtLt4Nklgt1lBIz_ZFxUybwOG4TDwst-ei75U
```

### 6. Testing Checklist

After configuring everything above, test in this order:

**Test 1: Email Signup**
1. Go to bookfolio.me/signup (incognito mode)
2. Enter username, email, password
3. Click "Sign up with Email"
4. Expected: Success message "Check your email"
5. Check email and click verification link
6. Expected: Redirect to dashboard

**Test 2: Email Login**
1. Go to bookfolio.me/login
2. Enter email and password
3. Click "Log In"
4. Expected: Redirect to dashboard

**Test 3: Google OAuth Signup**
1. Go to bookfolio.me/signup (incognito mode)
2. Enter a username
3. Click "Continue with Google"
4. Expected: Google consent screen shows "Bookfolio" (not Supabase URL)
5. After Google auth, Expected: Redirect to dashboard (NOT landing page)

**Test 4: Google OAuth Login**
1. Go to bookfolio.me/login
2. Click "Continue with Google"
3. Expected: Redirect to dashboard (NOT landing page)

**Test 5: Add Book**
1. Login to dashboard
2. Click "+ Add Book"
3. Search for a book
4. Select a book and fill details
5. Click "Add Book"
6. Expected: Book appears immediately on dashboard
7. Check browser console: NO errors about custom_order

**Test 6: Profile Editing**
1. Click "Edit Profile"
2. Change bio or add social links
3. Click "Save Changes"
4. Expected: Profile updates successfully

## Common Issues & Solutions

### Issue: "Invalid API key"
**Solution**: Environment variables not loaded. Delete and re-add all 3 env vars in Vercel.

### Issue: OAuth redirects to landing page
**Solution**:
1. Check Supabase redirect URLs include bookfolio.me/auth/callback
2. Check middleware.ts doesn't redirect authenticated users from /
3. Check auth/callback/route.ts logs for errors

### Issue: Books don't appear after adding
**Solutions**:
1. If RLS enabled: Add all 4 RLS policies above
2. Check browser console for errors
3. Check Vercel runtime logs for [CREATE BOOK] errors

### Issue: "custom_order column not found"
**Solution**: This is handled in code - column is optional. Error should not appear after latest deployment.

## Debug Commands

Test APIs directly:
```bash
# Test username check
curl https://www.bookfolio.me/api/auth/check-username?username=testuser

# Should return: {"available":true,"username":"testuser"}
```

Check Vercel logs:
1. Vercel Dashboard → Deployments → Latest → Runtime Logs
2. Look for [CREATE BOOK], [AUTH CALLBACK], [SIGNUP] messages
