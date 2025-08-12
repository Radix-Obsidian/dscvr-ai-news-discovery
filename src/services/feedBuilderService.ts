// New Feed Builder Service
export interface FeedItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  readingTime: number;
  wordCount: number;
  apiSource: 'rss-feed';
  sentiment?: 'positive' | 'negative' | 'neutral';
  language: string;
  country: string;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: string;
  priority: number;
  enabled: boolean;
}

// RSS Feed Configuration
const RSS_FEEDS: FeedSource[] = [
  {
    id: 'reddit-trending',
    name: 'Reddit Trending',
    url: 'https://rss.app/feeds/v1.1/V6yeazGWEdtV98wO.json',
    category: 'Trending',
    priority: 1,
    enabled: true
  },
  {
    id: 'feed-2',
    name: 'Feed 2',
    url: 'https://rss.app/feeds/v1.1/hd9ERoOglTDtQGB5.json',
    category: 'General',
    priority: 2,
    enabled: true
  },
  {
    id: 'feed-3',
    name: 'Feed 3',
    url: 'https://rss.app/feeds/v1.1/nstPTXGvSOtovcBa.json',
    category: 'General',
    priority: 2,
    enabled: true
  },
  {
    id: 'feed-4',
    name: 'Feed 4',
    url: 'https://rss.app/feeds/v1.1/H09AmWgYZgGhhSbi.json',
    category: 'General',
    priority: 2,
    enabled: true
  },
  {
    id: 'feed-5',
    name: 'Feed 5',
    url: 'https://rss.app/feeds/v1.1/XCyJPliS1iOyCv5y.json',
    category: 'General',
    priority: 2,
    enabled: true
  },
  {
    id: 'feed-6',
    name: 'Feed 6',
    url: 'https://rss.app/feeds/v1.1/OAP8F5qMaQkzsFUt.json',
    category: 'General',
    priority: 3,
    enabled: true
  },
  {
    id: 'feed-7',
    name: 'Feed 7',
    url: 'https://rss.app/feeds/v1.1/UWLe7qkql3LoXBK1.json',
    category: 'General',
    priority: 3,
    enabled: true
  },
  {
    id: 'feed-8',
    name: 'Feed 8',
    url: 'https://rss.app/feeds/v1.1/90oLLBd6LsucuHjN.json',
    category: 'General',
    priority: 3,
    enabled: true
  },
  {
    id: 'feed-9',
    name: 'Feed 9',
    url: 'https://rss.app/feeds/v1.1/e4AYkortCX0iBkYk.json',
    category: 'General',
    priority: 3,
    enabled: true
  },
  {
    id: 'feed-10',
    name: 'Feed 10',
    url: 'https://rss.app/feeds/v1.1/XoWQmqjmjYamCBKD.json',
    category: 'General',
    priority: 3,
    enabled: true
  }
];

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  minDelay: 1000, // 1 second minimum between requests
  maxDelay: 3000, // 3 seconds maximum delay
  maxRetries: 2,
  retryDelay: 2000, // 2 seconds base retry delay
  batchSize: 2, // Process 2 feeds at a time
  batchDelay: 2000, // 2 seconds between batches
};

class FeedBuilderService {
  private cache = new Map<string, { data: FeedItem[]; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: FeedItem[]): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): FeedItem[] | null {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  private calculateWordCount(content: string): number {
    return content.trim().split(/\s+/).length;
  }

  private calculateReadingTime(wordCount: number): number {
    const averageWPM = 200;
    return Math.max(1, Math.ceil(wordCount / averageWPM));
  }

  private extractTags(text: string): string[] {
    const commonTags = [
      'trending', 'viral', 'popular', 'news', 'technology', 'AI', 'artificial intelligence',
      'social media', 'entertainment', 'politics', 'science', 'health', 'business',
      'sports', 'gaming', 'music', 'movies', 'television', 'fashion', 'food',
      'travel', 'education', 'environment', 'climate', 'space', 'robotics',
      'blockchain', 'cryptocurrency', 'startup', 'innovation', 'research'
    ];

    const foundTags = commonTags.filter(tag => 
      text.toLowerCase().includes(tag.toLowerCase())
    );

    return foundTags.slice(0, 5); // Limit to 5 tags
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['good', 'great', 'amazing', 'awesome', 'excellent', 'wonderful', 'fantastic', 'brilliant', 'innovative', 'breakthrough', 'success', 'win', 'love', 'happy', 'excited'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disaster', 'fail', 'problem', 'issue', 'concern', 'worry', 'hate', 'angry', 'sad', 'disappointed'];

    const positiveCount = positiveWords.filter(word => text.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.toLowerCase().includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private async fetchRSSFeed(feed: FeedSource): Promise<FeedItem[]> {
    let retries = 0;
    let retryDelay = RATE_LIMIT_CONFIG.retryDelay;

    while (retries < RATE_LIMIT_CONFIG.maxRetries) {
      try {
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, Math.random() * RATE_LIMIT_CONFIG.maxDelay));
        
        // Use proxy service to avoid CORS issues
        const { rssProxyService } = await import('./rssProxyService');
        const response = await rssProxyService.fetchRSSFeed(feed.url);
        
        if (!response.success) {
          console.warn(`Failed to fetch RSS feed ${feed.name}: ${response.error}`);
          retries++;
          if (retries < RATE_LIMIT_CONFIG.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryDelay *= 2; // Exponential backoff
          }
          continue;
        }

        const data = response.data;
        
        if (!data.items || !Array.isArray(data.items)) {
          console.warn(`No items found in RSS feed for ${feed.name}`);
          return [];
        }

        return data.items.map((item: any, index: number) => {
          const content = item.content_text || item.content_html || item.summary || '';
          const wordCount = this.calculateWordCount(content);
          
          return {
            id: `${feed.id}_${index}`,
            title: item.title || 'No Title',
            content: content,
            excerpt: content.length > 200 ? content.substring(0, 200) + '...' : content,
            author: item.authors?.[0]?.name || item.author || feed.name,
            source: feed.name,
            url: item.url || '#',
            publishedAt: item.date_published || item.pubDate || new Date().toISOString(),
            imageUrl: item.image || item.thumbnail || undefined,
            category: feed.category,
            tags: this.extractTags(`${item.title} ${content}`),
            readingTime: this.calculateReadingTime(wordCount),
            wordCount: wordCount,
            apiSource: 'rss-feed' as const,
            sentiment: this.analyzeSentiment(`${item.title} ${content}`),
            language: 'en',
            country: 'US'
          };
        });
        
      } catch (error) {
        console.warn(`Failed to fetch RSS feed ${feed.name}:`, error);
        retries++;
        if (retries < RATE_LIMIT_CONFIG.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retryDelay *= 2; // Exponential backoff
        }
      }
    }
    
    console.warn(`Max retries reached for RSS feed ${feed.name}`);
    return [];
  }

  async getFeedItems(category?: string, limit: number = 20): Promise<FeedItem[]> {
    const cacheKey = `feed_${category || 'all'}_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey) || [];
    }

    try {
      // Filter sources by category and sort by priority
      const sources = RSS_FEEDS
        .filter(source => source.enabled && (!category || source.category === category))
        .sort((a, b) => a.priority - b.priority);

      const allItems: FeedItem[] = [];

      // Process sources in batches to avoid overwhelming the API
      for (let i = 0; i < sources.length; i += RATE_LIMIT_CONFIG.batchSize) {
        const batch = sources.slice(i, i + RATE_LIMIT_CONFIG.batchSize);
        
        console.log(`Processing batch ${Math.floor(i / RATE_LIMIT_CONFIG.batchSize) + 1} of ${Math.ceil(sources.length / RATE_LIMIT_CONFIG.batchSize)}`);
        
        // Process batch in parallel
        const batchPromises = batch.map(async (source) => {
          try {
            const items = await this.fetchRSSFeed(source);
            console.log(`Successfully fetched ${items.length} items from ${source.name}`);
            return items;
          } catch (error) {
            console.warn(`Failed to fetch from ${source.name}:`, error);
            return [];
          }
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(items => allItems.push(...items));
        
        // Add delay between batches
        if (i + RATE_LIMIT_CONFIG.batchSize < sources.length) {
          console.log(`Waiting ${RATE_LIMIT_CONFIG.batchDelay}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_CONFIG.batchDelay));
        }
      }
      
      // Sort by published date (newest first)
      allItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      // Limit to requested number of items
      const limitedItems = allItems.slice(0, limit);
      
      console.log(`Successfully fetched ${limitedItems.length} items from ${sources.length} sources`);
      
      this.setCache(cacheKey, limitedItems);
      return limitedItems;
    } catch (error) {
      console.error(`Failed to fetch feed items for category ${category}:`, error);
      return [];
    }
  }

  async getTrendingItems(limit: number = 10): Promise<FeedItem[]> {
    return this.getFeedItems('Trending', limit);
  }

  async getAllItems(limit: number = 50): Promise<FeedItem[]> {
    return this.getFeedItems(undefined, limit);
  }

  async searchItems(query: string, limit: number = 20): Promise<FeedItem[]> {
    const allItems = await this.getAllItems(100); // Get more items for search
    
    const searchResults = allItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    return searchResults.slice(0, limit);
  }

  getAvailableCategories(): string[] {
    return [...new Set(RSS_FEEDS.map(feed => feed.category))];
  }

  getFeedSources(): FeedSource[] {
    return RSS_FEEDS.filter(feed => feed.enabled);
  }
}

export const feedBuilderService = new FeedBuilderService();
