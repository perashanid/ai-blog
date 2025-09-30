const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// GET /api/posts - Get all published posts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find({ status: 'published' })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .select('title excerpt date ai_generated slug');

    const total = await BlogPost.countDocuments({ status: 'published' });

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_POSTS_ERROR',
        message: 'Failed to fetch posts',
        details: error.message
      }
    });
  }
});

// GET /api/posts/:id - Get single post by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let post = null;
    
    // Check if identifier is a valid ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by ID
      post = await BlogPost.findById(identifier);
    }
    
    // If not found by ID or not a valid ObjectId, try to find by slug
    if (!post) {
      post = await BlogPost.findOne({ slug: identifier, status: 'published' });
    }

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

module.exports = router;