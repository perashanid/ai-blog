const request = require('supertest');
const app = require('../server');
const BlogPost = require('../models/BlogPost');

describe('API Endpoints', () => {
  beforeEach(async () => {
    // Clean up test data
    await BlogPost.deleteMany({});
  });

  describe('GET /api/posts', () => {
    it('should return empty array when no posts exist', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return posts when they exist', async () => {
      // Create test post
      const testPost = new BlogPost({
        title: 'Test Post',
        content: 'This is a test post content',
        ai_generated: false
      });
      await testPost.save();

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Test Post');
    });
  });

  describe('POST /api/admin/posts', () => {
    it('should create a new post with valid credentials', async () => {
      const postData = {
        title: 'New Test Post',
        content: 'This is new test content'
      };

      const response = await request(app)
        .post('/api/admin/posts')
        .auth(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
        .send(postData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(postData.title);
      expect(response.body.data.ai_generated).toBe(false);
    });

    it('should reject request without authentication', async () => {
      const postData = {
        title: 'Unauthorized Post',
        content: 'This should not be created'
      };

      await request(app)
        .post('/api/admin/posts')
        .send(postData)
        .expect(401);
    });
  });
});