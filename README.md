# AI Blog Website

A modern, full-stack blog website with AI-powered content generation and comprehensive admin panel.

## Features

### Frontend
- Modern React Interface: Clean, responsive design
- Search & Pagination: Easy content discovery
- Rich Content Display: Support for HTML, images, and videos
- YouTube Video Integration: Automatic embedding of YouTube videos
- Mobile-First Design: Works perfectly on all devices

### Backend
- RESTful API: Clean, documented endpoints
- AI Content Generation: Automated blog posts using Google Gemini
- Scheduled Publishing: Automatic content creation with cron jobs
- MongoDB Integration: Scalable database solution

### Admin Panel
- Secure Authentication: Protected admin routes
- Dashboard Analytics: Post statistics and insights
- Rich Text Editor: Create and edit posts with HTML support
- Media Management: Add images, videos, and YouTube content
- YouTube Video Support: Easy integration of YouTube videos
- Tag System: Organize content with tags
- Draft/Publish Workflow: Control post visibility

## Installation

```bash
npm install
cd client && npm install && cd ..
```

## Configuration

Copy `.env.example` to `.env` and update with your credentials:
- MongoDB connection string
- Google Gemini API key
- Admin credentials

## Usage

Start development servers:

```bash
# Backend
npm run dev

# Frontend (in new terminal)
cd client && npm start
```

Access:
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- API: http://localhost:8000/api

## Project Structure

```
ai-blog-website/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.js         # Main app
│   └── package.json
├── models/                 # MongoDB schemas
├── routes/                 # Express routes
├── services/              # Backend services
├── server.js              # Main server
└── package.json
```

## API Endpoints

### Public
- `GET /api/posts` - Get paginated posts
- `GET /api/posts/:id` - Get single post

### Admin
- `GET /api/admin/profile` - Admin profile
- `POST /api/admin/posts` - Create post
- `PUT /api/admin/posts/:id` - Update post
- `DELETE /api/admin/posts/:id` - Delete post

## Tech Stack

### Frontend
- React 18
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Gemini AI
- Cron Jobs
