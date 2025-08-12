// Add proper type imports for browser APIs
interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : 'http://localhost:8000/api/v1';

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  interests?: string[];
  reading_preferences?: any;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  url?: string;
  source: string;
  category?: string;
  published_at?: string;
  created_at: string;
  updated_at?: string;
  ai_summary?: string;
  sentiment_score?: number;
  relevance_score?: number;
  tags?: string[];
  image_url?: string;
  author?: string;
  reading_time?: number;
  author_id?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// API Service Class
class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
    interests?: string[];
    reading_preferences?: any;
  }): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Articles
  async getArticles(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<Article[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    const endpoint = `/articles${query ? `?${query}` : ''}`;
    return this.request<Article[]>(endpoint);
  }

  async getRecommendedArticles(limit: number = 20): Promise<Article[]> {
    return this.request<Article[]>(`/articles/recommended?limit=${limit}`);
  }

  async getArticle(id: number): Promise<Article> {
    return this.request<Article>(`/articles/${id}`);
  }

  async createArticle(articleData: {
    title: string;
    content: string;
    summary?: string;
    url?: string;
    source: string;
    category?: string;
    published_at?: string;
    image_url?: string;
    author?: string;
    reading_time?: number;
  }): Promise<Article> {
    return this.request<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(
    id: number,
    articleData: Partial<Article>
  ): Promise<Article> {
    return this.request<Article>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id: number): Promise<void> {
    return this.request<void>(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  async processArticleWithAI(id: number): Promise<any> {
    return this.request<any>(`/articles/${id}/process-ai`, {
      method: 'POST',
    });
  }

  // User Management
  async updateUser(userData: Partial<User>): Promise<User> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserInterests(): Promise<string[]> {
    return this.request<string[]>('/users/me/interests');
  }

  async updateUserInterests(interests: string[]): Promise<{
    message: string;
    interests: string[];
  }> {
    return this.request<{ message: string; interests: string[] }>(
      '/users/me/interests',
      {
        method: 'PUT',
        body: JSON.stringify(interests),
      }
    );
  }

  async getUserPreferences(): Promise<any> {
    return this.request<any>('/users/me/preferences');
  }

  async updateUserPreferences(preferences: any): Promise<{
    message: string;
    preferences: any;
  }> {
    return this.request<{ message: string; preferences: any }>(
      '/users/me/preferences',
      {
        method: 'PUT',
        body: JSON.stringify(preferences),
      }
    );
  }

  // News Management
  async fetchNews(): Promise<{
    message: string;
    total_fetched: number;
    saved_count: number;
  }> {
    return this.request<{
      message: string;
      total_fetched: number;
      saved_count: number;
    }>('/news/fetch');
  }

  async getNewsCategories(): Promise<{ categories: string[] }> {
    return this.request<{ categories: string[] }>('/news/categories');
  }

  async getNewsSources(): Promise<{ sources: string[] }> {
    return this.request<{ sources: string[] }>('/news/sources');
  }

  async getTrendingArticles(limit: number = 10): Promise<{
    articles: Article[];
  }> {
    return this.request<{ articles: Article[] }>(
      `/news/trending?limit=${limit}`
    );
  }

  async markArticleAsRead(
    articleId: number,
    readDuration?: number,
    completed: boolean = true
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/news/${articleId}/read`, {
      method: 'POST',
      body: JSON.stringify({
        read_duration: readDuration,
        completed: completed,
      }),
    });
  }

  async getReadingHistory(limit: number = 20): Promise<{
    reading_history: any[];
  }> {
    return this.request<{ reading_history: any[] }>(
      `/news/reading-history?limit=${limit}`
    );
  }
}

export const apiService = new ApiService();
