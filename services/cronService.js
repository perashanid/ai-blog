const cron = require('node-cron');
const BlogPost = require('../models/BlogPost');
const aiService = require('./aiService');
const newsService = require('./newsService');

class CronService {
  constructor() {
    this.isRunning = false;
  }

  start() {
    // Generate regular AI posts every 12 hours (at 00:00 and 12:00)
    cron.schedule('0 0,12 * * *', async () => {
      await this.generateAIPost();
    });

    // Generate daily tech news digest at 8:00 AM every day
    cron.schedule('0 8 * * *', async () => {
      await this.generateTechNewsDigest();
    });

    console.log('Cron service started:');
    console.log('- AI posts will be generated every 12 hours');
    console.log('- Tech news digest will be generated daily at 8:00 AM');
    
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

  async generateTechNewsDigest() {
    if (this.isRunning) {
      console.log('Another generation process is running, skipping tech news digest...');
      return;
    }

    this.isRunning = true;
    
    try {
      console.log('Starting tech news digest generation...');
      
      // Check if we already have a tech news digest for today
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const existingDigest = await BlogPost.findOne({
        newsDigest: true,
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });

      if (existingDigest) {
        console.log('Tech news digest already exists for today, skipping...');
        return;
      }
      
      const digestContent = await newsService.createDailyTechDigest();
      
      const post = new BlogPost({
        title: digestContent.title,
        content: digestContent.content,
        ai_generated: digestContent.ai_generated,
        tags: digestContent.tags,
        newsDigest: true
      });

      await post.save();
      
      console.log(`Tech news digest created successfully: "${post.title}"`);
      
    } catch (error) {
      console.error('Failed to generate tech news digest:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  // Manual triggers for testing
  async triggerAIGeneration() {
    return await this.generateAIPost();
  }

  async triggerTechNewsDigest() {
    return await this.generateTechNewsDigest();
  }
}

module.exports = new CronService();