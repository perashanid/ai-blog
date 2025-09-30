const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class NewsService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // News sources configuration
        this.newsSources = [
            {
                name: 'NewsAPI',
                url: 'https://newsapi.org/v2/everything',
                apiKey: process.env.NEWS_API_KEY,
                params: {
                    q: 'technology OR programming OR AI OR "artificial intelligence" OR software OR "web development" OR cybersecurity OR blockchain OR "machine learning"',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 20
                }
            },
            {
                name: 'HackerNews',
                url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
                itemUrl: 'https://hacker-news.firebaseio.com/v0/item/{id}.json'
            }
        ];
    }

    async fetchNewsFromAPI() {
        const articles = [];
        
        try {
            console.log('Starting news fetch...');
            
            // Fetch from NewsAPI if API key is available
            if (process.env.NEWS_API_KEY) {
                console.log('Fetching from NewsAPI...');
                try {
                    const newsApiResponse = await axios.get(this.newsSources[0].url, {
                        params: {
                            ...this.newsSources[0].params,
                            apiKey: this.newsSources[0].apiKey,
                            from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 24 hours
                        },
                        timeout: 30000
                    });

                    if (newsApiResponse.data.articles) {
                        const newsArticles = newsApiResponse.data.articles.map(article => ({
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            publishedAt: article.publishedAt,
                            source: article.source.name,
                            urlToImage: article.urlToImage
                        }));
                        articles.push(...newsArticles);
                        console.log(`Fetched ${newsArticles.length} articles from NewsAPI`);
                    }
                } catch (newsApiError) {
                    console.error('NewsAPI fetch failed:', newsApiError.message);
                }
            } else {
                console.log('NEWS_API_KEY not found, skipping NewsAPI...');
            }

            // Fetch from Hacker News
            console.log('Fetching from Hacker News...');
            try {
                const hackerNewsResponse = await axios.get(this.newsSources[1].url, { timeout: 30000 });
                const topStoryIds = hackerNewsResponse.data.slice(0, 15); // Get top 15 stories
                console.log(`Found ${topStoryIds.length} top stories from HN`);

                let hnArticleCount = 0;
                for (const id of topStoryIds) {
                    try {
                        const storyResponse = await axios.get(this.newsSources[1].itemUrl.replace('{id}', id), { timeout: 15000 });
                        const story = storyResponse.data;
                        
                        if (story && story.title && story.url && this.isTechRelated(story.title)) {
                            articles.push({
                                title: story.title,
                                description: story.title, // HN doesn't have descriptions
                                url: story.url,
                                publishedAt: new Date(story.time * 1000).toISOString(),
                                source: 'Hacker News',
                                score: story.score || 0
                            });
                            hnArticleCount++;
                        }
                    } catch (error) {
                        console.error(`Error fetching HN story ${id}:`, error.message);
                    }
                }
                console.log(`Fetched ${hnArticleCount} tech-related articles from Hacker News`);
            } catch (hnError) {
                console.error('Hacker News fetch failed:', hnError.message);
            }

            // Add some fallback tech articles if we couldn't fetch any
            if (articles.length === 0) {
                console.log('No articles fetched, adding fallback articles...');
                articles.push(...this.getFallbackArticles());
            }

        } catch (error) {
            console.error('Error in fetchNewsFromAPI:', error.message);
            // Return fallback articles if everything fails
            return this.getFallbackArticles();
        }

        console.log(`Total articles fetched: ${articles.length}`);
        return articles;
    }

    getFallbackArticles() {
        const today = new Date().toISOString();
        return [
            {
                title: "The Future of Artificial Intelligence in Software Development",
                description: "Exploring how AI is transforming the way we write, test, and deploy code.",
                url: "https://example.com/ai-software-development",
                publishedAt: today,
                source: "Tech Insights",
                score: 100
            },
            {
                title: "Web Development Trends: What's Next in 2024",
                description: "A comprehensive look at emerging frameworks, tools, and methodologies.",
                url: "https://example.com/web-dev-trends-2024",
                publishedAt: today,
                source: "Dev Weekly",
                score: 95
            },
            {
                title: "Cybersecurity Best Practices for Modern Applications",
                description: "Essential security measures every developer should implement.",
                url: "https://example.com/cybersecurity-best-practices",
                publishedAt: today,
                source: "Security Today",
                score: 90
            },
            {
                title: "The Rise of Edge Computing and Its Impact on Development",
                description: "How edge computing is changing application architecture and deployment strategies.",
                url: "https://example.com/edge-computing-development",
                publishedAt: today,
                source: "Cloud Computing News",
                score: 85
            },
            {
                title: "Open Source Projects That Are Changing the Tech Landscape",
                description: "Highlighting innovative open source projects making waves in the developer community.",
                url: "https://example.com/open-source-projects-2024",
                publishedAt: today,
                source: "Open Source Weekly",
                score: 80
            }
        ];
    }

    isTechRelated(title) {
        const techKeywords = [
            'ai', 'artificial intelligence', 'machine learning', 'programming', 'software', 
            'development', 'tech', 'technology', 'coding', 'javascript', 'python', 'react',
            'node', 'web', 'app', 'mobile', 'cloud', 'aws', 'google', 'microsoft', 'apple',
            'cybersecurity', 'blockchain', 'crypto', 'database', 'api', 'framework',
            'startup', 'silicon valley', 'github', 'open source', 'devops', 'kubernetes'
        ];
        
        const lowerTitle = title.toLowerCase();
        return techKeywords.some(keyword => lowerTitle.includes(keyword));
    }

    async generateTechNewsDigest(articles) {
        try {
            if (!articles || articles.length === 0) {
                return this.generateFallbackDigest();
            }

            // Sort articles by relevance and recency
            const sortedArticles = articles
                .filter(article => article.title && article.url)
                .sort((a, b) => {
                    const scoreA = (a.score || 0) + (this.isTechRelated(a.title) ? 10 : 0);
                    const scoreB = (b.score || 0) + (this.isTechRelated(b.title) ? 10 : 0);
                    return scoreB - scoreA;
                })
                .slice(0, 15); // Top 15 articles

            const newsData = sortedArticles.map(article => ({
                title: article.title,
                description: article.description || '',
                url: article.url,
                source: article.source,
                publishedAt: article.publishedAt
            }));

            const prompt = `Create a comprehensive daily tech news digest from the following articles. 

Format the content as a well-structured blog post with:
1. A brief introduction about today's tech highlights
2. Organize news into relevant categories (AI/ML, Web Development, Cybersecurity, Startups, etc.)
3. For each news item, provide:
   - A compelling headline
   - A 2-3 sentence summary in your own words
   - The original source link formatted as: [Read more at {source}]({url})
4. Add insightful commentary connecting related stories

Make it engaging and informative. Use proper markdown formatting with headers, bullet points, and links.
Do NOT include any conclusion, summary, or closing section at the end.
End the digest naturally after covering all the news items without wrapping up statements.

Here are the articles:
${newsData.map((article, index) => `
${index + 1}. Title: ${article.title}
   Description: ${article.description}
   Source: ${article.source}
   URL: ${article.url}
   Published: ${article.publishedAt}
`).join('\n')}

Write a comprehensive digest that synthesizes this information into a cohesive, engaging read.`;

            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const content = response.text();

            const today = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            return {
                title: `Tech News Digest - ${today}`,
                content: content,
                ai_generated: true,
                tags: ['tech news', 'daily digest', 'technology', 'news roundup'],
                newsDigest: true
            };

        } catch (error) {
            console.error('Error generating tech news digest:', error);
            return this.generateFallbackDigest();
        }
    }

    generateFallbackDigest() {
        const today = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        return {
            title: `Tech News Digest - ${today}`,
            content: `# Today's Tech Landscape

Welcome to today's technology digest. While we're currently experiencing some technical difficulties with our news aggregation service, the tech world continues to evolve at breakneck speed.

## Key Areas to Watch

### Artificial Intelligence & Machine Learning
The AI revolution continues to reshape industries, from healthcare to finance. Major developments in large language models, computer vision, and autonomous systems are driving unprecedented innovation.

### Web Development & Software Engineering
Modern web development frameworks and tools are making it easier than ever to build scalable, performant applications. The rise of edge computing and serverless architectures is changing how we think about deployment and scaling.

### Cybersecurity
As digital transformation accelerates, cybersecurity remains a critical concern. New threats emerge daily, but so do innovative solutions to protect our digital infrastructure.

### Emerging Technologies
Blockchain, quantum computing, and IoT continue to mature, promising to unlock new possibilities across various sectors.

---

*We're working to restore our full news aggregation service. Check back tomorrow for comprehensive coverage of the latest tech developments.*

[Visit our homepage](/) for more technology insights and analysis.`,
            ai_generated: true,
            tags: ['tech news', 'daily digest', 'technology'],
            newsDigest: true
        };
    }

    async createDailyTechDigest() {
        try {
            console.log('Starting daily tech news digest generation...');
            
            // Fetch latest tech news
            const articles = await this.fetchNewsFromAPI();
            console.log(`Fetched ${articles.length} articles`);
            
            // Generate digest using AI
            const digest = await this.generateTechNewsDigest(articles);
            
            console.log('Tech news digest generated successfully');
            return digest;
            
        } catch (error) {
            console.error('Error creating daily tech digest:', error);
            return this.generateFallbackDigest();
        }
    }
}

module.exports = new NewsService();