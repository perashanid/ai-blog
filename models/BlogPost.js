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
      enum: ['image', 'video', 'youtube'],
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
    },
    // YouTube-specific fields
    videoId: {
      type: String,
      required: function() {
        return this.type === 'youtube';
      }
    },
    thumbnail: {
      type: String
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxLength: [50, 'Tag cannot exceed 50 characters']
  }],
  newsDigest: {
    type: Boolean,
    default: false,
    index: true
  },
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

// Helper function to extract YouTube video ID
const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

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
  
  // Process media items to handle YouTube videos
  if (this.isModified('media') && this.media) {
    this.media.forEach(item => {
      if (item.type === 'video' || item.type === 'youtube') {
        const videoId = extractYouTubeId(item.url);
        if (videoId) {
          item.type = 'youtube';
          item.videoId = videoId;
          item.thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
    });
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