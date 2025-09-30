# Render Deployment Checklist

## Pre-Deployment ✅

- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas cluster created and configured
- [ ] Gemini API key obtained from Google AI Studio
- [ ] Admin credentials decided (username/password)

## Render Configuration ✅

### Service Settings:
- [ ] **Name**: `ai-blog-website`
- [ ] **Runtime**: `Node`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm start`
- [ ] **Branch**: `main`
- [ ] **Auto-Deploy**: Enabled

### Environment Variables:
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/ai-blog-db`
- [ ] `GEMINI_API_KEY` = `your_gemini_api_key_here`
- [ ] `ADMIN_USERNAME` = `admin`
- [ ] `ADMIN_PASSWORD` = `your_secure_password_here`

## Post-Deployment ✅

- [ ] App successfully deployed and accessible
- [ ] Copy deployed app URL
- [ ] Add `CORS_ORIGIN` environment variable with app URL
- [ ] Test admin panel login
- [ ] Test AI post generation
- [ ] Verify database connection
- [ ] Check all API endpoints work

## Quick Form Fill Guide

When creating the web service on Render, copy these values:

```
Name: ai-blog-website
Region: [Choose closest to you]
Branch: main
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Instance Type: Free
Auto-Deploy: Yes
```

**Environment Variables to add:**
```
NODE_ENV=production
MONGODB_URI=[Your MongoDB Atlas connection string]
GEMINI_API_KEY=[Your Gemini API key]
ADMIN_USERNAME=admin
ADMIN_PASSWORD=[Your secure password]
```

**After deployment, add:**
```
CORS_ORIGIN=[Your deployed app URL]
```