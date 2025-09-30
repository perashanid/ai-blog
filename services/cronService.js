const cron = require('node-cron');
const BlogPost = require('../models/BlogPost');
const aiService = require('./aiService');

class CronService {
  constructor() {
    this.isRunning = false;
  }

  start() {
    // Run every 12 hours (at 00:00 and 12:00)
    cron.schedule('0 0,12 * * *', async () => {
      await this.generateAIPost();
    });

    console.log('Cron service started - AI posts will be generated every 12 hours');
    
    // Generate initial post if no posts exist
    this.checkAndGenerateInitialPost();
  }

  async checkAndGenerateInitialPost() {
    try {
      const postCount = await BlogPost.countDocuments();
      if (postCount === 0) {
        console.log('No posts found, generating initial AI post...');
        await this.generateAIPost();
      }
    } catch (error) {
      console.error('Error checking for initial post:', error);
    }
  }

  async generateAIPost() {
    if (this.isRunning) {
      console.log('AI post generation already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    
    try {
      console.log('Starting AI post generation...');
      
      const aiContent = await aiService.generateBlogPost();
      
      const post = new BlogPost({
        title: aiContent.title,
        content: aiContent.content,
        ai_generated: true
      });

      await post.save();
      
      console.log(`AI post created successfully: "${post.title}"`);
      
    } catch (error) {
      console.error('Failed to generate AI post:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  // Manual trigger for testing
  async triggerAIGeneration() {
    return await this.generateAIPost();
  }
}

module.exports = new CronService();