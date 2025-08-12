// Ollama Service for AI Chat functionality
interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    top_k?: number;
  };
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
}

interface OllamaChatRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  stream?: boolean;
  options?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    top_k?: number;
  };
}

interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
}

class OllamaService {
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    // Use environment variable or fallback to localhost
    this.baseUrl = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
    this.defaultModel = import.meta.env.VITE_OLLAMA_MODEL || 'llama2:7b';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Ollama API error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ollama API request failed:', error);
      throw error;
    }
  }

  // Generate text using Ollama
  async generateText(
    prompt: string,
    model?: string,
    options?: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    }
  ): Promise<string> {
    const request: OllamaGenerateRequest = {
      model: model || this.defaultModel,
      prompt,
      stream: options?.stream || false,
      options: {
        temperature: options?.temperature || 0.7,
        max_tokens: options?.max_tokens || 1000,
      },
    };

    try {
      const response = await this.request<OllamaGenerateResponse>(
        '/api/generate',
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      return response.response;
    } catch (error) {
      console.error('Failed to generate text:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  // Chat with Ollama
  async chat(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    model?: string,
    options?: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    }
  ): Promise<string> {
    const request: OllamaChatRequest = {
      model: model || this.defaultModel,
      messages,
      stream: options?.stream || false,
      options: {
        temperature: options?.temperature || 0.7,
        max_tokens: options?.max_tokens || 1000,
      },
    };

    try {
      const response = await this.request<OllamaChatResponse>(
        '/api/chat',
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      return response.message.content;
    } catch (error) {
      console.error('Failed to chat with Ollama:', error);
      throw new Error('Failed to get AI chat response');
    }
  }

  // Get available models
  async getModels(): Promise<Array<{ name: string; size: number; modified_at: string }>> {
    try {
      const response = await this.request<{ models: Array<{ name: string; size: number; modified_at: string }> }>(
        '/api/tags'
      );
      return response.models || [];
    } catch (error) {
      console.error('Failed to get models:', error);
      return [];
    }
  }

  // Check if Ollama service is available
  async isAvailable(): Promise<boolean> {
    try {
      await this.request('/api/tags');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Generate article summary
  async generateArticleSummary(
    articleContent: string,
    maxLength: number = 200
  ): Promise<string> {
    const prompt = `
Please provide a concise summary of the following article content in ${maxLength} characters or less:

${articleContent.substring(0, 2000)}

Summary:
`;

    return this.generateText(prompt, this.defaultModel, {
      temperature: 0.3,
      max_tokens: maxLength,
    });
  }

  // Generate AI chat response for article
  async generateArticleChatResponse(
    userQuestion: string,
    articleContent: string,
    articleTitle: string
  ): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant for a news discovery platform. You help users understand articles by answering their questions. Be concise, accurate, and helpful.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      {
        role: 'user' as const,
        content: `Article Title: ${articleTitle}\n\nArticle Content: ${articleContent.substring(0, 3000)}\n\nUser Question: ${userQuestion}`,
      },
    ];

    return this.chat(messages, this.defaultModel, {
      temperature: 0.7,
      max_tokens: 500,
    });
  }

  // Analyze sentiment
  async analyzeSentiment(content: string): Promise<'positive' | 'negative' | 'neutral'> {
    const prompt = `
Analyze the sentiment of the following text and respond with only one word: positive, negative, or neutral.

Text: ${content.substring(0, 1000)}

Sentiment:`;

    try {
      const response = await this.generateText(prompt, this.defaultModel, {
        temperature: 0.3,
        max_tokens: 10,
      });

      const sentiment = response.trim().toLowerCase();
      if (['positive', 'negative', 'neutral'].includes(sentiment)) {
        return sentiment as 'positive' | 'negative' | 'neutral';
      }
      return 'neutral';
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
      return 'neutral';
    }
  }
}

export const ollamaService = new OllamaService();
