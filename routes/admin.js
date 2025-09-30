const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const basicAuth = require('express-basic-auth');
const cronService = require('../services/cronService');

// Basic authentication middleware
const authMiddleware = basicAuth({
  users: {
    [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD
  },
  challenge: true,
  realm: 'Admin Area'
});

// Apply auth to all admin routes
router.use(authMiddleware);

// POST /api/admin/posts - Create new manual post
router.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title and content are required'
        }
      });
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title cannot exceed 200 characters'
        }
      });
    }

    if (content.length > 50000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Content cannot exceed 50000 characters'
        }
      });
    }

    const post = new BlogPost({
      title,
      content,
      ai_generated: false
    });

    await post.save();

    res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_SLUG',
          message: 'A post with similar title already exists'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_POST_ERROR',
        message: 'Failed to create post',
        details: error.message
      }
    });
  }
});

// GET /api/admin/posts - Get all posts for admin
router.get('/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .sort({ date: -1 })
      .select('title excerpt date ai_generated status slug');

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ADMIN_POSTS_ERROR',
        message: 'Failed to fetch posts',
        details: error.message
      }
    });
  }
});

// GET /api/admin/profile - Get admin profile
router.get('/profile', async (req, res) => {
  try {
    const totalPosts = await BlogPost.countDocuments();
    const aiPosts = await BlogPost.countDocuments({ ai_generated: true });
    const manualPosts = totalPosts - aiPosts;
    const recentPosts = await BlogPost.find()
      .sort({ date: -1 })
      .limit(5)
      .select('title date ai_generated');

    const profile = {
      username: process.env.ADMIN_USERNAME,
      role: 'Administrator',
      joinDate: '2024-01-01', // You can make this dynamic
      stats: {
        totalPosts,
        aiPosts,
        manualPosts
      },
      recentActivity: recentPosts
    };

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_PROFILE_ERROR',
        message: 'Failed to fetch profile',
        details: error.message
      }
    });
  }
});

// GET /api/admin/posts/:id - Get single post for editing
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POST_NOT_FOUND',
          message: 'Post not found'
        }
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_POST_ERROR',
        message: 'Failed to fetch post',
        details: error.message
      }
    });
  }
});

// PUT /api/admin/posts/:id - Update a post
router.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, media, tags } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title and content are required'
        }
      });
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title cannot exceed 200 characters'
        }
      });
    }

    if (content.length > 50000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Content cannot exceed 50000 characters'
        }
      });
    }

    const updateData = {
      title,
      content,
      status: status || 'published',
      media: media || [],
      tags: tags || [],
      modifiedBy: 'admin'
    };

    const post = await BlogPost.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POST_NOT_FOUND',
          message: 'Post not found'
        }
      });
    }

    res.json({
      success: true,
      data: post,
      message: 'Post updated successfully'
    });
  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_SLUG',
          message: 'A post with similar title already exists'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_POST_ERROR',
        message: 'Failed to update post',
        details: error.message
      }
    });
  }
});

// DELETE /api/admin/posts/:id - Delete a post
router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await BlogPost.findByIdAndDelete(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POST_NOT_FOUND',
          message: 'Post not found'
        }
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_POST_ERROR',
        message: 'Failed to delete post',
        details: error.message
      }
    });
  }
});

// POST /api/admin/generate-ai - Manually trigger AI post generation
router.post('/generate-ai', async (req, res) => {
  try {
    await cronService.triggerAIGeneration();
    res.json({
      success: true,
      message: 'AI post generation triggered successfully'
    });
  } catch (error) {
    console.error('Error triggering AI generation:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AI_GENERATION_ERROR',
        message: 'Failed to trigger AI post generation',
        details: error.message
      }
    });
  }
});

// POST /api/admin/generate-news-digest - Manually trigger tech news digest
router.post('/generate-news-digest', async (req, res) => {
  try {
    await cronService.triggerTechNewsDigest();
    res.json({
      success: true,
      message: 'Tech news digest generation triggered successfully'
    });
  } catch (error) {
    console.error('Error triggering news digest generation:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'NEWS_DIGEST_ERROR',
        message: 'Failed to trigger tech news digest generation',
        details: error.message
      }
    });
  }
});

// GET /api/admin/test-news - Test news fetching (development only)
router.get('/test-news', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  
  try {
    const newsService = require('../services/newsService');
    const articles = await newsService.fetchNewsFromAPI();
    
    res.json({
      success: true,
      data: {
        articlesCount: articles.length,
        articles: articles.slice(0, 5) // Show first 5 for testing
      }
    });
  } catch (error) {
    console.error('Error testing news fetch:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'NEWS_TEST_ERROR',
        message: 'Failed to test news fetching',
        details: error.message
      }
    });
  }
});

module.exports = router;