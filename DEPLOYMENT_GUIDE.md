# AI Blog Website - Deployment Guide

## 🚀 Complete Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### 1. Environment Setup

Create `.env` file in the root directory:
```env
NODE_ENV=production
PORT=8000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
CORS_ORIGIN=your_frontend_url
```

Create `client/.env` file:
```env
PORT=3000
REACT_APP_API_URL=your_backend_url/api
```

### 2. Installation

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Database Setup

The application will automatically create the necessary MongoDB collections and indexes when it starts.

### 4. Running the Application

#### Development Mode
```bash
# Start backend server (Terminal 1)
npm run dev

# Start frontend server (Terminal 2)
cd client
npm start
```

#### Production Mode
```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

### 5. Admin Panel Access

- URL: `http://localhost:3000/admin`
- Default credentials: admin / admin123 (change in .env file)

## 📁 Project Structure

```
ai-blog-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.js         # Main app component
│   ├── package.json
│   └── .env
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── services/              # Backend services
├── scripts/               # Utility scripts
├── tests/                 # Test files
├── server.js              # Main server file
├── package.json
├── .env
└── README.md
```

## 🔧 Features

### Frontend Features
- Responsive design for all devices
- Search functionality
- Pagination
- Post viewing with rich content support
- Admin panel with authentication

### Backend Features
- RESTful API
- MongoDB integration
- AI content generation (Gemini API)
- Automated post scheduling
- Admin authentication
- CRUD operations for posts

### Admin Panel Features
- Dashboard with statistics
- Create/Edit/Delete posts
- Media support (images/videos)
- HTML content editing
- Tag management
- Post status management (draft/published)
- Profile management

## 🛠 API Endpoints

### Public Endpoints
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:identifier` - Get single post

### Admin Endpoints (Authenticated)
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/posts` - Get all posts for admin
- `GET /api/admin/posts/:id` - Get single post for editing
- `POST /api/admin/posts` - Create new post
- `PUT /api/admin/posts/:id` - Update post
- `DELETE /api/admin/posts/:id` - Delete post

## 🔐 Security Features

- HTTP Basic Authentication for admin routes
- Input validation and sanitization
- CORS protection
- Environment variable protection
- SQL injection prevention (NoSQL)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Customization

### Styling
- Main styles in `client/src/App.css`
- Gradient themes and modern UI
- Easy color scheme modification

### Content
- Modify AI prompts in `services/aiService.js`
- Adjust cron schedules in `services/cronService.js`
- Update admin credentials in `.env`

## 🚀 Deployment Options

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy with Git

### Vercel (Frontend) + Railway (Backend)
1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Update CORS and API URLs

### DigitalOcean App Platform
1. Create new app
2. Connect GitHub repository
3. Configure environment variables

## 🔍 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Check connection string and network access
2. **CORS Errors**: Verify CORS_ORIGIN in .env
3. **Admin Login**: Check ADMIN_USERNAME and ADMIN_PASSWORD
4. **Port Conflicts**: Use `npm run kill-ports` script

### Logs
- Backend logs: Console output
- Frontend logs: Browser developer tools
- MongoDB logs: Atlas dashboard

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/posts` should return posts
- Frontend: Should load homepage
- Admin: Should allow login with credentials

### Performance
- Use MongoDB Atlas monitoring
- Monitor API response times
- Check frontend bundle size

## 🔄 Updates and Maintenance

### Regular Tasks
1. Update dependencies monthly
2. Monitor MongoDB storage usage
3. Review and update AI prompts
4. Backup database regularly

### Scaling
- Use MongoDB Atlas auto-scaling
- Consider CDN for media files
- Implement Redis for caching if needed

## 📞 Support

For issues or questions:
1. Check this deployment guide
2. Review error logs
3. Check MongoDB Atlas status
4. Verify environment variables

## 🎯 Next Steps

After deployment:
1. Test all functionality
2. Create your first manual post
3. Verify AI post generation
4. Customize styling as needed
5. Set up monitoring and backups