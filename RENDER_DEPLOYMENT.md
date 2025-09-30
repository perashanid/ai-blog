# Render Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: Set up a free MongoDB Atlas cluster
2. **Gemini API Key**: Get your API key from Google AI Studio
3. **GitHub Repository**: Your code should be pushed to GitHub
4. **Render Account**: Sign up at [render.com](https://render.com)

## Step-by-Step Deployment Guide

### Step 1: Prepare Your Environment Variables

Before deploying, you'll need these environment variables:

- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `GEMINI_API_KEY`: Your Google Gemini API key
- `ADMIN_USERNAME`: Admin panel username
- `ADMIN_PASSWORD`: Admin panel password
- `CORS_ORIGIN`: Your Render app URL (will be provided after deployment)

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in or create an account
   - Click "New +" → "Web Service"

2. **Connect Your Repository**
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub account if not already connected
   - Select your repository

3. **Configure Your Web Service**

   Fill out the form with these values:

   **Basic Settings:**
   - **Name**: `ai-blog-website` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Runtime**: `Node`

   **Build & Deploy Settings:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

   **Advanced Settings:**
   - **Instance Type**: `Free` (or upgrade as needed)
   - **Auto-Deploy**: `Yes` (recommended)

4. **Add Environment Variables**

   In the "Environment Variables" section, add:

   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/ai-blog-db
   GEMINI_API_KEY = your_gemini_api_key_here
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = your_secure_password_here
   ```

   **Important**: Don't add `CORS_ORIGIN` yet - you'll get this after deployment.

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete (5-10 minutes)

### Step 3: Post-Deployment Configuration

1. **Get Your App URL**
   - Once deployed, copy your app URL (e.g., `https://your-app-name.onrender.com`)

2. **Update CORS_ORIGIN**
   - Go to your service settings
   - Add environment variable: `CORS_ORIGIN = https://your-app-name.onrender.com`
   - Save changes (this will trigger a redeploy)

### Step 4: MongoDB Atlas Setup

1. **Create MongoDB Atlas Cluster**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP (or use 0.0.0.0/0 for all IPs)

2. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use this as your `MONGODB_URI`

### Step 5: Get Gemini API Key

1. **Google AI Studio**
   - Go to [aistudio.google.com](https://aistudio.google.com)
   - Sign in with Google account
   - Click "Get API Key"
   - Create new API key
   - Copy and use as `GEMINI_API_KEY`

## Important Notes

- **Free Tier Limitations**: Render free tier spins down after 15 minutes of inactivity
- **Build Time**: First deployment takes 5-10 minutes
- **Environment Variables**: Always use strong passwords for admin credentials
- **HTTPS**: Render provides HTTPS by default
- **Custom Domain**: Available on paid plans

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **App Won't Start**
   - Check if PORT environment variable is set correctly
   - Verify start command: `npm start`
   - Check server logs for errors

3. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check MongoDB Atlas network access settings
   - Ensure database user has proper permissions

4. **API Errors**
   - Verify Gemini API key is valid
   - Check CORS_ORIGIN matches your deployed URL
   - Ensure all required environment variables are set

## Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: Monitor performance and usage
- **Health Check**: Your app has `/api/health` endpoint

## Scaling

- **Upgrade Plan**: For better performance and no sleep
- **Database**: Consider upgrading MongoDB Atlas for production
- **CDN**: Consider adding Cloudflare for better performance