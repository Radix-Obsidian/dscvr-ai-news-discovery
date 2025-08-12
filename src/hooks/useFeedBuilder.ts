import { useState, useEffect, useCallback } from 'react';
import { feedBuilderService, FeedItem } from '../services/feedBuilderService';

interface UseFeedBuilderReturn {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

interface UseFeedBuilderOptions {
  category?: string;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useFeedBuilder(options: UseFeedBuilderOptions = {}): UseFeedBuilderReturn {
  const { category, limit = 20, autoRefresh = false, refreshInterval = 300000 } = options;
  
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedItems = await feedBuilderService.getFeedItems(category, limit);
      setItems(fetchedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      console.error('Error fetching feed items:', err);
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  const refresh = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchItems();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchItems]);

  return {
    items,
    loading,
    error,
    refresh
  };
}

interface UseTrendingItemsReturn {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTrendingItems(limit: number = 10): UseTrendingItemsReturn {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedItems = await feedBuilderService.getTrendingItems(limit);
      setItems(fetchedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending items');
      console.error('Error fetching trending items:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refresh = useCallback(() => {
    fetchTrendingItems();
  }, [fetchTrendingItems]);

  useEffect(() => {
    fetchTrendingItems();
  }, [fetchTrendingItems]);

  return {
    items,
    loading,
    error,
    refresh
  };
}

interface UseSearchItemsReturn {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
  clearSearch: () => void;
}

export function useSearchItems(limit: number = 20): UseSearchItemsReturn {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setItems([]);
      // setCurrentQuery('');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // setCurrentQuery(query);
      
      const searchResults = await feedBuilderService.searchItems(query, limit);
      setItems(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search items');
      console.error('Error searching items:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const clearSearch = useCallback(() => {
    setItems([]);
    setError(null);
    // setCurrentQuery('');
  }, []);

  return {
    items,
    loading,
    error,
    search,
    clearSearch
  };
}

export function useFeedCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const availableCategories = feedBuilderService.getAvailableCategories();
    setCategories(availableCategories);
  }, []);

  return categories;
}

export function useFeedSources() {
  const [sources, setSources] = useState(feedBuilderService.getFeedSources());

  const refreshSources = useCallback(() => {
    setSources(feedBuilderService.getFeedSources());
  }, []);

  return {
    sources,
    refreshSources
  };
}
