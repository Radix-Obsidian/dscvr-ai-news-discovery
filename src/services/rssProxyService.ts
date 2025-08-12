// Add proper type imports for browser APIs
interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
}

// RSS Proxy Service to handle CORS and rate limiting issues
export interface RSSProxyResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class RSSProxyService {
  private baseUrl = 'http://localhost:8000/api/v1';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<RSSProxyResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('RSS Proxy request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private getCacheKey(url: string): string {
    return `rss_${btoa(url)}`;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    return cached?.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async fetchRSSFeed(url: string): Promise<RSSProxyResponse> {
    const cacheKey = this.getCacheKey(url);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return { success: true, data: this.getCache(cacheKey) };
    }

    // Make request through backend proxy
    const response = await this.makeRequest('/rss/proxy', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });

    if (response.success && response.data) {
      this.setCache(cacheKey, response.data);
    }

    return response;
  }

  async getTrendingFeeds(): Promise<RSSProxyResponse> {
    return this.makeRequest('/rss/trending');
  }

  async getFeedByCategory(category: string): Promise<RSSProxyResponse> {
    return this.makeRequest(`/rss/category/${encodeURIComponent(category)}`);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const rssProxyService = new RSSProxyService();
