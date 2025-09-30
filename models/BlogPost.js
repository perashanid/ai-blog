const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxLength: [200, 'Title cannot exceed 200 characters'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxLength: [50000, 'Content cannot exceed 50000 characters'] // Increased for rich content
  },
  excerpt: {
    type: String,
    maxLength: [200, 'Excerpt cannot exceed 200 characters']
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  ai_generated: {
    type: Boolean,
    default: false,
    index: true
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxLength: [200, 'Caption cannot exceed 200 characters']
    },
    position: {
      type: Number,
      default: 0
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxLength: [50, 'Tag cannot exceed 50 characters']
  }],
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Generate slug from title and update lastModified
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Generate excerpt if not provided
  if (!this.excerpt && this.content) {
    // Strip HTML tags for excerpt
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 150) + '...';
  }
  
  // Update lastModified if content changed
  if (this.isModified('content') || this.isModified('title') || this.isModified('media')) {
    this.lastModified = new Date();
  }
  
  next();
});

// Compound index for efficient querying
blogPostSchema.index({ date: -1, status: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);