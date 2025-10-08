# Bookfolio Deployment Guide - Phase 7

## Pre-Deployment Checklist ✅

- ✅ Build passes successfully (`npm run build`)
- ✅ All authentication flows working (email/password, Google OAuth)
- ✅ Mobile responsive design verified
- ✅ Dark/light mode working across all pages
- ✅ Database schema and RLS policies configured
- ✅ No critical errors in console

## Deployment Steps

### 1. GitHub Repository Setup

1. **Create a new GitHub repository:**
   ```bash
   # Initialize git if not already done
   cd "/Users/nikhilbhima/Documents/bookfolio.me webapp/bookfolio"
   git init

   # Add all files
   git add .

   # Create initial commit
   git commit -m "Initial commit: Bookfolio webapp"
   ```

2. **Create repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `bookfolio`
   - Keep it private (or public if you prefer)
   - Don't initialize with README (we already have code)
   - Click "Create repository"

3. **Push to GitHub:**
   ```bash
   # Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/bookfolio.git

   # Push code
   git branch -M main
   git push -u origin main
   ```

### 2. Vercel Deployment

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Sign in with your GitHub account

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Select your `bookfolio` repository
   - Click "Import"

3. **Configure Build Settings:**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (or `bookfolio` if that's the folder name)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   Click "Environment Variables" and add these:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ntjwstcmdpblylkwbgjy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50andzdGNtZHBibHlsa3diZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODg4MzQsImV4cCI6MjA1OTY2NDgzNH0.H9XJmHPHcCDbIsgM8xikPnMXYeHp8OJ5oE_99Fk1BAE
   ```

   ⚠️ **Important:** Make sure to add these to all environments (Production, Preview, and Development)

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - You'll get a URL like: `https://bookfolio-xxx.vercel.app`

### 3. Supabase Configuration

1. **Update Supabase Site URL:**
   - Go to your Supabase dashboard: https://supabase.com/dashboard
   - Navigate to: Project Settings → Authentication → Site URL
   - Update to your Vercel URL: `https://bookfolio-xxx.vercel.app`

2. **Add Redirect URLs:**
   - In Supabase dashboard: Authentication → URL Configuration
   - Add these to "Redirect URLs":
     ```
     https://bookfolio-xxx.vercel.app/auth/callback
     https://bookfolio-xxx.vercel.app/reset-password
     ```

3. **Configure Google OAuth (if using):**
   - Go to Google Cloud Console: https://console.cloud.google.com
   - Select your project
   - Navigate to: APIs & Services → Credentials
   - Edit your OAuth 2.0 Client
   - Add to "Authorized JavaScript origins":
     ```
     https://bookfolio-xxx.vercel.app
     ```
   - Add to "Authorized redirect URIs":
     ```
     https://ntjwstcmdpblylkwbgjy.supabase.co/auth/v1/callback
     ```

### 4. Custom Domain Setup (bookfolio.me)

1. **Add domain in Vercel:**
   - In your Vercel project, go to Settings → Domains
   - Click "Add"
   - Enter: `bookfolio.me` and `www.bookfolio.me`

2. **Update DNS settings:**
   - Go to your domain registrar (where you bought bookfolio.me)
   - Add these DNS records:

   **For bookfolio.me:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www.bookfolio.me:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS propagation** (can take 5 minutes to 48 hours)

4. **Update Supabase URLs again:**
   - Once DNS propagates, update Supabase:
   - Site URL: `https://bookfolio.me`
   - Redirect URLs:
     ```
     https://bookfolio.me/auth/callback
     https://bookfolio.me/reset-password
     https://www.bookfolio.me/auth/callback
     https://www.bookfolio.me/reset-password
     ```

5. **Update Google OAuth redirect URIs:**
   - Add to "Authorized JavaScript origins":
     ```
     https://bookfolio.me
     https://www.bookfolio.me
     ```

### 5. Post-Deployment Tasks

1. **Test the deployment:**
   - ✅ Sign up with email/password
   - ✅ Sign up with Google OAuth
   - ✅ Login/Logout
   - ✅ Add books
   - ✅ Edit profile
   - ✅ Test public profile URL (bookfolio.me/yourusername)
   - ✅ Test dark/light mode
   - ✅ Test on mobile device

2. **Monitor for errors:**
   - Check Vercel logs for any runtime errors
   - Check Supabase logs for database/auth issues

3. **Set up analytics (optional):**
   - Vercel Analytics: Settings → Analytics → Enable
   - Google Analytics: Add tracking code if needed

### 6. Updating Your App

Whenever you make changes:

```bash
# Commit your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically:
- Detect the push
- Build your project
- Deploy to production (if push is to main branch)
- Deploy preview for other branches

### 7. Environment-Specific Notes

**Production Environment:**
- Uses your custom domain: bookfolio.me
- Connected to production Supabase database
- SSL certificate auto-managed by Vercel

**Preview Deployments:**
- Each PR gets its own preview URL
- Shares same environment variables
- Perfect for testing before merging

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### OAuth Not Working
- Double-check redirect URLs in Supabase and Google Console
- Ensure URLs match exactly (no trailing slashes)
- Clear browser cookies and try again

### Database Connection Issues
- Verify Supabase URL and anon key in Vercel
- Check RLS policies in Supabase
- Ensure Supabase project is not paused

### Username Not Saving (Google OAuth)
- The fix is already in place with cookie-based storage
- Test by creating a new account
- Old test accounts may need database cleanup

## Important Files

- `.env.local` - Local environment variables (DO NOT COMMIT)
- `middleware.ts` - Route protection
- `lib/supabase-server.ts` - Server-side Supabase client
- `lib/supabase.ts` - Client-side Supabase client
- `app/auth/callback/route.ts` - OAuth callback handler

## Database Management

Your Supabase tables:
- `profiles` - User profiles (username, bio, etc.)
- `books` - User's book collection

RLS is enabled - users can only access their own data.

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: Create issues in your repo for bug tracking

## Success Metrics

After deployment, your app should:
- ✅ Load in < 2 seconds
- ✅ Be fully mobile responsive
- ✅ Have zero console errors
- ✅ Handle 100+ concurrent users (Supabase free tier)
- ✅ Have 99.9% uptime (Vercel SLA)

---

**Congratulations! 🎉 Your Bookfolio app is now live!**

Remember to test thoroughly before sharing with real users.
