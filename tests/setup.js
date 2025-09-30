require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');

beforeAll(async () => {
  // Connect to test database
  const testDbUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/ai-blog-test';
  await mongoose.connect(testDbUri);
});

afterAll(async () => {
  // Clean up and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});