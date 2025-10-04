# Netlify Deployment Guide for Heritage Haven Frontend

This guide will help you deploy your Heritage Haven React frontend to Netlify.

## Prerequisites

1. **Netlify Account**: Sign up for a free account at [netlify.com](https://netlify.com)
2. **GitHub Account**: Your project code must be in a GitHub repository
3. **Backend Deployed**: Your backend should be deployed first (e.g., to Render, Heroku, etc.)

## Step 1: Prepare Your React Project

### A. Update Environment Variables

1. **Update `.env.production`** with your actual backend URL:
   ```env
   VITE_API_BASE_URL=https://your-actual-backend-url.onrender.com
   ```
   
   Replace `https://your-actual-backend-url.onrender.com` with your deployed backend URL.

### B. Verify Configuration Files

The following files have been created/configured for you:

1. **`frontend/public/_redirects`** - Handles client-side routing
   ```
   /* /index.html 200
   ```

2. **`frontend/.env.production`** - Production environment variables
3. **`frontend/.env.development`** - Development environment variables

## Step 2: Deploy to Netlify

### Option A: Continuous Deployment (Recommended)

1. **Login to Netlify**: Go to your Netlify dashboard
2. **Add New Site**: Click "Add new site" → "Import an existing project"
3. **Connect to GitHub**: Choose GitHub and authorize Netlify
4. **Select Repository**: Find and select your `DevCreate-BuildFest` repository
5. **Configure Build Settings**:
   - **Branch to deploy**: `main`
   - **Base directory**: `Heritage_haven/frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Heritage_haven/frontend/dist`

6. **Click "Deploy site"**

### Option B: Manual Deployment

1. **Build your project locally**:
   ```bash
   cd Heritage_haven/frontend
   npm run build
   ```

2. **Upload the `dist` folder** to Netlify via drag-and-drop

## Step 3: Configure Environment Variables in Netlify

1. **Go to Site Settings**: In your Netlify dashboard, click "Site settings"
2. **Environment Variables**: Go to "Environment variables" in the left sidebar
3. **Add Variable**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-actual-backend-url.onrender.com`
   - **Scopes**: Production, Deploy previews, Branch deploys

## Step 4: Test Your Deployment

1. **Open your site**: Netlify will provide a URL like `https://wonderful-site-name.netlify.app`
2. **Test functionality**:
   - Navigation between pages
   - User registration/login
   - Heritage site details
   - API calls to your backend

## Troubleshooting

### Common Issues:

1. **404 errors on refresh**: Make sure `_redirects` file exists in `public/` folder
2. **API calls failing**: Check if `VITE_API_BASE_URL` is set correctly
3. **CORS errors**: Ensure your backend allows requests from your Netlify domain

### Checking Logs:

1. **Netlify Deploy Logs**: Check the deploy logs in Netlify dashboard
2. **Browser Console**: Check for JavaScript errors in browser dev tools
3. **Network Tab**: Check if API calls are going to the correct URLs

## Updating Your Deployment

### Automatic Updates (Continuous Deployment):
- Push changes to your GitHub repository
- Netlify will automatically rebuild and deploy

### Manual Updates:
- Run `npm run build` locally
- Upload the new `dist` folder to Netlify

## Important Notes

1. **Backend URL**: Make sure to update the backend URL in `.env.production` before deploying
2. **CORS**: Ensure your backend accepts requests from your Netlify domain
3. **Environment Variables**: Vite only includes env variables that start with `VITE_`
4. **Build Time**: The build process typically takes 1-3 minutes

## Final Checklist

- [ ] Backend is deployed and accessible
- [ ] `.env.production` has correct backend URL
- [ ] `_redirects` file exists in `public/` folder
- [ ] Environment variable is set in Netlify
- [ ] Site builds successfully
- [ ] All pages load correctly
- [ ] API calls work in production

Your Heritage Haven frontend should now be live on Netlify! 🎉