import React from "react";
import { ArticleCard, Article, FeedItem } from "./ArticleCard";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Sparkles, Zap, Globe, TrendingUp, Star, RefreshCw } from "lucide-react";
import { useFeedBuilder, useTrendingItems } from "../src/hooks/useFeedBuilder";

interface ForYouContentProps {
  onArticleClick: (article: Article | FeedItem) => void;
  onCategoryChange: (category: string) => void;
}

export function ForYouContent({ onArticleClick, onCategoryChange }: ForYouContentProps) {
  const { items: trendingItems, loading: trendingLoading, error: trendingError, refresh: refreshTrending } = useTrendingItems(6);
  const { items: allItems, loading: allLoading, error: allError } = useFeedBuilder({ limit: 12 });

  const handleTrendingTopicClick = (topic: { name: string; articles: number; trend: string; category: string }) => {
    onCategoryChange(topic.category);
  };

  const handleRefresh = () => {
    refreshTrending();
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">For You</h1>
          <p className="text-muted-foreground mt-2">
            Personalized content curated just for you
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={trendingLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${trendingLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Trending Topics */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Trending Topics</h2>
          <Button variant="ghost" size="sm" onClick={() => onCategoryChange("Trending")}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {["AI", "Tech & Science", "Space Exploration", "Climate Tech", "Biotech"].map((category, index) => {
            const icons = [Sparkles, Zap, Globe, TrendingUp, Star];
            const Icon = icons[index];
            return (
              <Card 
                key={category}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onCategoryChange(category)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">{category}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.floor(Math.random() * 20) + 5} articles
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Trending Articles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Trending Now</h2>
          <Button variant="ghost" size="sm" onClick={() => onCategoryChange("Trending")}>
            View All
          </Button>
        </div>
        
        {trendingLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                  <div className="bg-muted h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : trendingError ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Unable to load trending articles</p>
            <Button variant="outline" onClick={handleRefresh} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingItems?.slice(0, 6).map((item) => (
              <ArticleCard
                key={item.id}
                article={item as any}
                onClick={() => onArticleClick(item as any)}
              />
            ))}
          </div>
        )}
      </section>

      {/* All Articles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Latest Articles</h2>
          <Button variant="ghost" size="sm" onClick={() => onCategoryChange("All")}>
            View All
          </Button>
        </div>
        
        {allLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-32 rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                  <div className="bg-muted h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : allError ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Unable to load articles</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allItems?.slice(0, 4).map((item) => (
              <ArticleCard
                key={item.id}
                article={item as any}
                onClick={() => onArticleClick(item as any)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Continue Reading Section */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Continue Reading</h2>
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Sign in to track your reading progress and get personalized recommendations
          </p>
          <Button className="mt-3">
            Sign In
          </Button>
        </div>
      </section>
    </div>
  );
}