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

  async generateAIPost(isManual = false) {
    if (this.isRunning) {
      console.log('AI post generation already in progress, skipping...');
      return { success: false, message: 'AI post generation already in progress' };
    }

    this.isRunning = true;
    
    try {
      const triggerType = isManual ? 'Manual admin' : 'Automatic';
      console.log(`Starting ${triggerType.toLowerCase()} AI post generation...`);
      
      const aiContent = await aiService.generateBlogPost();
      
      const post = new BlogPost({
        title: aiContent.title,
        content: aiContent.content,
        ai_generated: true,
        tags: ['ai-generated', 'blog', 'technology']
      });

      await post.save();
      
      console.log(`${triggerType} AI post created successfully: "${post.title}"`);
      return { success: true, message: `${triggerType} AI post created successfully`, postTitle: post.title };
      
    } catch (error) {
      console.error('Failed to generate AI post:', error.message);
      console.error('Error stack:', error.stack);
      return { success: false, message: `Failed to generate AI post: ${error.message}` };
    } finally {
      this.isRunning = false;
    }
  }

  async generateTechNewsDigest(isManual = false) {
    if (this.isRunning) {
      console.log('Another generation process is running, skipping tech news digest...');
      return { success: false, message: 'Another generation process is running' };
    }

    this.isRunning = true;
    
    try {
      const triggerType = isManual ? 'Manual admin' : 'Automatic';
      console.log(`Starting ${triggerType.toLowerCase()} tech news digest generation...`);
      
      // Only check for existing digest if this is an automatic trigger
      if (!isManual) {
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
          console.log('Tech news digest already exists for today, skipping automatic generation...');
          return { success: false, message: 'Tech news digest already exists for today', existingPost: existingDigest.title };
        }
      }
      
      console.log('Calling newsService.createDailyTechDigest()...');
      const digestContent = await newsService.createDailyTechDigest();
      
      if (!digestContent || !digestContent.title || !digestContent.content) {
        throw new Error('Invalid digest content received from news service');
      }
      
      // Add timestamp to title for manual generations to avoid duplicates
      let finalTitle = digestContent.title;
      if (isManual) {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        finalTitle = `${digestContent.title} (${timestamp})`;
      }
      
      console.log('Creating new blog post...');
      const post = new BlogPost({
        title: finalTitle,
        content: digestContent.content,
        ai_generated: digestContent.ai_generated,
        tags: digestContent.tags,
        newsDigest: true
      });

      await post.save();
      
      console.log(`${triggerType} tech news digest created successfully: "${post.title}"`);
      return { success: true, message: `${triggerType} tech news digest created successfully`, postTitle: post.title };
      
    } catch (error) {
      console.error('Failed to generate tech news digest:', error.message);
      console.error('Error stack:', error.stack);
      return { success: false, message: `Failed to generate tech news digest: ${error.message}` };
    } finally {
      this.isRunning = false;
    }
  }

  // Manual triggers for admin (bypass daily restrictions)
  async triggerAIGeneration() {
    return await this.generateAIPost(true); // true = manual/admin trigger
  }

  async triggerTechNewsDigest() {
    return await this.generateTechNewsDigest(true); // true = manual/admin trigger
  }
}

module.exports = new CronService();