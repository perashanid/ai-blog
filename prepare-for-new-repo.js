const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing AI Blog Website for New Repository...\n');

// Files and directories to include in the new repository
const filesToInclude = [
    // Root files
    'package.json',
    'server.js',
    '.env.example',
    'README.md',
    'ADMIN_GUIDE.md',
    'DEPLOYMENT_GUIDE.md',

    // Directories
    'client/',
    'models/',
    'routes/',
    'services/',
    'scripts/',
    'tests/',
    '.kiro/'
];

// Files to exclude
const filesToExclude = [
    'node_modules/',
    'client/node_modules/',
    'client/build/',
    '.env',
    'client/.env',
    '.git/',
    'prepare-for-new-repo.js'
];

// Create .env.example files
const createEnvExample = () => {
    const rootEnvExample = `NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-blog-db
GEMINI_API_KEY=your_gemini_api_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
CORS_ORIGIN=http://localhost:3000`;

    const clientEnvExample = `PORT=3000
REACT_APP_API_URL=http://localhost:8000/api`;

    fs.writeFileSync('.env.example', rootEnvExample);
    fs.writeFileSync('client/.env.example', clientEnvExample);

    console.log('✅ Created .env.example files');
};

// Create .gitignore
const createGitignore = () => {
    const gitignoreContent = `# Dependencies
node_modules/
client/node_modules/

# Production builds
client/build/
dist/

# Environment variables
.env
client/.env

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Local development
*.local

# Vercel
.vercel

# Kiro IDE (keep .kiro directory but ignore some files)
.kiro/cache/
.kiro/logs/`;

    fs.writeFileSync('.gitignore', gitignoreContent);
    console.log('✅ Created .gitignore file');
};

// Update README with complete information
const updateReadme = () => {
    const readmeContent = `# AI Blog Website

A modern, full-stack blog website with AI-powered content generation and comprehensive admin panel.

## 🌟 Features

### Frontend
- **Modern React Interface**: Clean, responsive design
- **Search & Pagination**: Easy content discovery
- **Rich Content Display**: Support for HTML, images, and videos
- **Mobile-First Design**: Works perfectly on all devices

### Backend
- **RESTful API**: Clean, documented endpoints
- **AI Content Generation**: Automated blog posts using Google Gemini
- **Scheduled Publishing**: Automatic content creation with cron jobs
- **MongoDB Integration**: Scalable database solution

### Admin Panel
- **Secure Authentication**: Protected admin routes
- **Dashboard Analytics**: Post statistics and insights
- **Rich Text Editor**: Create and edit posts with HTML support
- **Media Management**: Add images and videos to posts
- **Tag System**: Organize content with tags
- **Draft/Publish Workflow**: Control post visibility

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd ai-blog-website
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   cd client && npm install && cd ..
   \`\`\`

3. **Environment setup**
   \`\`\`bash
   cp .env.example .env
   cp client/.env.example client/.env
   \`\`\`
   
   Update the \`.env\` files with your credentials.

4. **Start development servers**
   \`\`\`bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd client && npm start
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - API: http://localhost:8000/api

## 🔐 Admin Panel

Access the admin panel at \`/admin\` with your configured credentials.

### Features:
- **Dashboard**: Overview of all posts and statistics
- **Create Posts**: Rich text editor with media support
- **Edit Posts**: Modify both AI-generated and manual posts
- **Media Gallery**: Add images and videos
- **Tag Management**: Organize content
- **Profile Management**: Admin user information

## 📁 Project Structure

\`\`\`
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
\`\`\`

## 🛠 API Documentation

### Public Endpoints
- \`GET /api/posts\` - Get paginated posts
- \`GET /api/posts/:id\` - Get single post

### Admin Endpoints
- \`GET /api/admin/profile\` - Admin profile
- \`POST /api/admin/posts\` - Create post
- \`PUT /api/admin/posts/:id\` - Update post
- \`DELETE /api/admin/posts/:id\` - Delete post

## 🎨 Customization

### Styling
Modify \`client/src/App.css\` for custom themes and colors.

### AI Content
Update prompts in \`services/aiService.js\` to change AI writing style.

### Scheduling
Adjust cron jobs in \`services/cronService.js\` for posting frequency.

## 🚀 Deployment

See \`DEPLOYMENT_GUIDE.md\` for detailed deployment instructions for various platforms.

### Quick Deploy Options:
- **Vercel + Railway**: Frontend on Vercel, Backend on Railway
- **Heroku**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🔧 Development

### Available Scripts

**Backend:**
- \`npm start\` - Production server
- \`npm run dev\` - Development server
- \`npm test\` - Run tests
- \`npm run kill-ports\` - Kill development ports

**Frontend:**
- \`npm start\` - Development server
- \`npm run build\` - Production build
- \`npm test\` - Run tests

## 📊 Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Modern CSS with Flexbox/Grid

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Gemini AI
- Cron Jobs

### Development
- ESLint
- Prettier
- Git hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the \`DEPLOYMENT_GUIDE.md\`
2. Review the \`ADMIN_GUIDE.md\`
3. Open an issue on GitHub

## 🎯 Roadmap

- [ ] User authentication and comments
- [ ] SEO optimization
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Theme customization

---

Built with ❤️ using React, Node.js, and MongoDB`;

    fs.writeFileSync('README.md', readmeContent);
    console.log('✅ Updated README.md');
};

// Main execution
const main = () => {
    try {
        createEnvExample();
        createGitignore();
        updateReadme();

        console.log('\n🎉 Repository preparation complete!');
        console.log('\n📋 Next Steps:');
        console.log('1. Create a new GitHub repository');
        console.log('2. Copy all files except node_modules and .env files');
        console.log('3. Initialize git in the new directory:');
        console.log('   git init');
        console.log('   git add .');
        console.log('   git commit -m "Initial commit: AI Blog Website"');
        console.log('   git branch -M main');
        console.log('   git remote add origin <your-repo-url>');
        console.log('   git push -u origin main');
        console.log('\n4. Update environment variables in the new repository');
        console.log('5. Deploy using the DEPLOYMENT_GUIDE.md');

        console.log('\n📁 Files ready for new repository:');
        filesToInclude.forEach(file => {
            if (fs.existsSync(file)) {
                console.log(`   ✅ ${file}`);
            } else {
                console.log(`   ❌ ${file} (missing)`);
            }
        });

    } catch (error) {
        console.error('❌ Error preparing repository:', error.message);
    }
};

main();