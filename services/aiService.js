const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    async generateBlogPost() {
        try {
            const topics = [
                'The Future of Artificial Intelligence',
                'Web Development Trends',
                'Technology and Society',
                'Digital Innovation',
                'Programming Best Practices',
                'Cloud Computing Evolution',
                'Cybersecurity in Modern World',
                'Mobile App Development',
                'Data Science Insights',
                'Machine Learning Applications'
            ];

            const randomTopic = topics[Math.floor(Math.random() * topics.length)];

            // Generate a simple title based on the topic
            const titleVariations = [
                `${randomTopic}: A Complete Guide`,
                `Understanding ${randomTopic}`,
                `${randomTopic} Explained`,
                `The Future of ${randomTopic}`,
                `${randomTopic}: Key Insights`,
                `Exploring ${randomTopic}`,
                `${randomTopic} in 2024`,
                `${randomTopic}: Best Practices`
            ];
            
            const title = titleVariations[Math.floor(Math.random() * titleVariations.length)];

            const prompt = `Write a comprehensive blog post about "${randomTopic}". 
      The post should be informative, engaging, and around 800-1200 words. 
      Include practical insights and real-world examples. 
      Make it suitable for a tech-savvy audience but accessible to general readers.
      Format it with clear paragraphs and structure.
      Do not include a title in the content - just write the body of the blog post.
      Start directly with the content, no title or heading at the beginning.
      Do NOT include any conclusion, summary, or closing section at the end.
      End the post naturally after covering the main content without wrapping up statements.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const content = response.text();



            return {
                title: title,
                content: content,
                ai_generated: true
            };
        } catch (error) {
            console.error('AI content generation error:', error);
            throw new Error('Failed to generate AI content');
        }
    }
}

module.exports = new AIService();