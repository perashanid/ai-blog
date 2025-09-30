require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const postsRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');
const cronService = require('./services/cronService');

const app = express();

// Connect to database
connectDB();

// Security middleware with CSP configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8000',
      process.env.CORS_ORIGIN,
      process.env.RENDER_EXTERNAL_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/posts', postsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start cron service for AI post generation
  cronService.start();
});

// Increase server timeout for AI generation endpoints
server.timeout = 300000; // 5 minutes
server.keepAliveTimeout = 300000; // 5 minutes
server.headersTimeout = 310000; // Slightly higher than keepAliveTimeout

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop any running processes or change the port.`);
    console.error('You can run "npm run kill-ports" to stop existing Node processes.');
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

module.exports = app;