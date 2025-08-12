import redis
import json
import pickle
from typing import Any, Optional
from functools import wraps
import os

# Redis connection
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=False,  # Keep as bytes for pickle
    socket_connect_timeout=5,
    socket_timeout=5,
    retry_on_timeout=True,
    health_check_interval=30,
)

def cache_result(expire_time: int = 300):
    """Decorator to cache function results in Redis"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            cache_key = f"{func.__name__}:{hash(str(args) + str(sorted(kwargs.items())))}"
            
            try:
                # Try to get from cache
                cached_result = redis_client.get(cache_key)
                if cached_result:
                    return pickle.loads(cached_result)
                
                # If not in cache, execute function
                result = func(*args, **kwargs)
                
                # Store in cache
                redis_client.setex(
                    cache_key,
                    expire_time,
                    pickle.dumps(result)
                )
                
                return result
            except Exception as e:
                # If Redis fails, just execute function without caching
                print(f"Cache error: {e}")
                return func(*args, **kwargs)
        
        return wrapper
    return decorator

def cache_articles(expire_time: int = 600):
    """Specialized cache for articles with JSON serialization"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"articles:{hash(str(args) + str(sorted(kwargs.items())))}"
            
            try:
                # Try to get from cache
                cached_result = redis_client.get(cache_key)
                if cached_result:
                    return json.loads(cached_result.decode('utf-8'))
                
                # If not in cache, execute function
                result = func(*args, **kwargs)
                
                # Store in cache (articles as JSON for better performance)
                redis_client.setex(
                    cache_key,
                    expire_time,
                    json.dumps(result, default=str)
                )
                
                return result
            except Exception as e:
                print(f"Article cache error: {e}")
                return func(*args, **kwargs)
        
        return wrapper
    return decorator

def clear_cache(pattern: str = "*"):
    """Clear cache entries matching pattern"""
    try:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
            return len(keys)
        return 0
    except Exception as e:
        print(f"Cache clear error: {e}")
        return 0

def get_cache_stats():
    """Get cache statistics"""
    try:
        info = redis_client.info()
        return {
            "connected_clients": info.get("connected_clients", 0),
            "used_memory_human": info.get("used_memory_human", "0B"),
            "keyspace_hits": info.get("keyspace_hits", 0),
            "keyspace_misses": info.get("keyspace_misses", 0),
        }
    except Exception as e:
        print(f"Cache stats error: {e}")
        return {}
