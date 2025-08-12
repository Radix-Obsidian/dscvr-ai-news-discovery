import { TrendingUp, Clock, Star, Bookmark, ArrowRight, RefreshCw, Sparkles, Zap, Globe } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArticleCard, Article, FeedItem } from "./ArticleCard";
import { useTrendingItems, useFeedBuilder } from "../src/hooks/useFeedBuilder";

interface ForYouContentProps {
  onArticleClick: (article: Article | FeedItem) => void;
  onCategoryChange?: (category: string) => void;
}

export function ForYouContent({ onArticleClick, onCategoryChange }: ForYouContentProps) {
  // Use the new feed builder hooks
  const { items: trendingItems, loading: trendingLoading, error: trendingError, refresh: refreshTrending } = useTrendingItems(6);
  const { items: allItems, loading: allLoading, error: allError } = useFeedBuilder({ limit: 12 });
  
  // Mock data as fallback when RSS feeds are not available
  const mockTrendingItems = [
    {
      id: "mock_1",
      title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
      content: "A new AI model demonstrates human-level reasoning capabilities, marking a significant breakthrough in artificial intelligence research.",
      excerpt: "A new AI model demonstrates human-level reasoning capabilities, marking a significant breakthrough in artificial intelligence research.",
      author: "Dr. Sarah Chen",
      source: "Nature AI",
      url: "#",
      publishedAt: "2024-01-15T10:30:00Z",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
      category: "AI & Technology",
      tags: ["AI", "artificial intelligence", "research", "breakthrough"],
      readingTime: 8,
      wordCount: 1600,
      sentiment: "positive" as const,
      language: "en",
      country: "US",
      apiSource: "rss-feed" as const
    },
    {
      id: "mock_2",
      title: "Quantum Computing Milestone: 1000-Qubit Processor Unveiled",
      content: "Researchers have successfully developed a 1000-qubit quantum processor, bringing us closer to practical quantum computing applications.",
      excerpt: "Researchers have successfully developed a 1000-qubit quantum processor, bringing us closer to practical quantum computing applications.",
      author: "Dr. Michael Rodriguez",
      source: "Science Daily",
      url: "#",
      publishedAt: "2024-01-14T15:45:00Z",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
      category: "Tech & Science",
      tags: ["quantum computing", "technology", "research", "breakthrough"],
      readingTime: 6,
      wordCount: 1200,
      sentiment: "positive" as const,
      language: "en",
      country: "US",
      apiSource: "rss-feed" as const
    },
    {
      id: "mock_3",
      title: "SpaceX Successfully Lands Starship on Mars Simulation",
      content: "SpaceX has achieved another milestone by successfully landing a Starship prototype in a Mars simulation environment.",
      excerpt: "SpaceX has achieved another milestone by successfully landing a Starship prototype in a Mars simulation environment.",
      author: "Elon Musk",
      source: "Space News",
      url: "#",
      publishedAt: "2024-01-13T20:15:00Z",
      imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=200&fit=crop",
      category: "Space Exploration",
      tags: ["spacex", "mars", "space exploration", "technology"],
      readingTime: 5,
      wordCount: 1000,
      sentiment: "positive" as const,
      language: "en",
      country: "US",
      apiSource: "rss-feed" as const
    }
  ];

  const mockAllItems = [
    ...mockTrendingItems,
    {
      id: "mock_4",
      title: "Climate Tech Startup Raises $50M for Carbon Capture Innovation",
      content: "A promising climate technology startup has secured significant funding to scale their innovative carbon capture solution.",
      excerpt: "A promising climate technology startup has secured significant funding to scale their innovative carbon capture solution.",
      author: "Jane Smith",
      source: "TechCrunch",
      url: "#",
      publishedAt: "2024-01-12T09:20:00Z",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop",
      category: "Climate Tech",
      tags: ["climate tech", "startup", "funding", "carbon capture"],
      readingTime: 4,
      wordCount: 800,
      sentiment: "positive" as const,
      language: "en",
      country: "US",
      apiSource: "rss-feed" as const
    },
    {
      id: "mock_5",
      title: "Breakthrough in Biotech: New Gene Therapy Shows Promise",
      content: "Scientists have developed a novel gene therapy approach that could revolutionize treatment for genetic disorders.",
      excerpt: "Scientists have developed a novel gene therapy approach that could revolutionize treatment for genetic disorders.",
      author: "Dr. Emily Johnson",
      source: "Nature Biotechnology",
      url: "#",
      publishedAt: "2024-01-11T14:30:00Z",
      imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=200&fit=crop",
      category: "Biotech",
      tags: ["biotech", "gene therapy", "medical research", "breakthrough"],
      readingTime: 7,
      wordCount: 1400,
      sentiment: "positive" as const,
      language: "en",
      country: "US",
      apiSource: "rss-feed" as const
    }
  ];
  
  // Mock trending topics for now (can be enhanced later)
  const trendingTopics = [
    { name: "AI Breakthroughs", articles: 12, trend: "+23%", category: "AI", icon: Sparkles },
    { name: "Quantum Computing", articles: 8, trend: "+15%", category: "Tech & Science", icon: Zap },
    { name: "Space Exploration", articles: 6, trend: "+8%", category: "Tech & Science", icon: Globe },
    { name: "Climate Tech", articles: 9, trend: "+12%", category: "Tech & Science", icon: TrendingUp },
    { name: "Biotech Advances", articles: 7, trend: "+18%", category: "Tech & Science", icon: Star }
  ];

  const handleTrendingTopicClick = (topic: { name: string; articles: number; trend: string; category: string }) => {
    if (onCategoryChange) {
      onCategoryChange(topic.category);
    }
  };



  return (
    <div className="space-y-6 p-6">
      {/* Apple HIG: Welcome Section with clear visual hierarchy */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border-primary/20 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome to Dscvr AI</h2>
            <p className="text-muted-foreground text-lg">
              Discover trending content from across the web, powered by our intelligent feed builder.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live feeds active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>AI-powered curation</span>
          </div>
        </div>
      </Card>

      {/* Apple HIG: Trending Items with enhanced visual design */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Trending Now</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshTrending}
            disabled={trendingLoading}
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${trendingLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {trendingLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-6 border-border/50 bg-card/50">
                <div className="space-y-4">
                  <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                  <div className="h-32 bg-muted/50 rounded-lg animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : trendingError ? (
          <Card className="p-8 text-center border-border/50 bg-card/50">
            <div className="p-4 bg-destructive/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-destructive" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Failed to load trending items</h4>
            <p className="text-muted-foreground mb-4">Please check your connection and try again.</p>
            <Button variant="outline" size="lg" onClick={refreshTrending}>
              Try Again
            </Button>
          </Card>
        ) : trendingItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingItems.map((item) => (
              <ArticleCard
                key={item.id}
                article={item as any}
                onClick={onArticleClick}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTrendingItems.slice(0, 6).map((item) => (
              <ArticleCard
                key={item.id}
                article={item}
                onClick={() => onArticleClick(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Apple HIG: Trending Topics with enhanced interactivity */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Trending Topics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingTopics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <Card 
                key={index} 
                className="p-6 cursor-pointer hover:bg-accent/30 hover:shadow-md transition-all duration-200 border-border/50 bg-card/50 group"
                onClick={() => handleTrendingTopicClick(topic)}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${topic.name} articles`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTrendingTopicClick(topic);
                  }
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {topic.name}
                    </h4>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 font-semibold">
                    {topic.trend}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">
                    {topic.articles} articles
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Apple HIG: Latest Articles with improved layout */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Latest Articles</h3>
        </div>
        
        {allLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6 border-border/50 bg-card/50">
                <div className="space-y-4">
                  <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                  <div className="h-32 bg-muted/50 rounded-lg animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : allError ? (
          <Card className="p-8 text-center border-border/50 bg-card/50">
            <div className="p-4 bg-destructive/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-destructive" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Failed to load latest articles</h4>
            <p className="text-muted-foreground">Please try again later.</p>
          </Card>
        ) : allItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allItems.slice(0, 4).map((item) => (
              <ArticleCard
                key={item.id}
                article={item as any}
                onClick={onArticleClick}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockAllItems.slice(0, 4).map((item) => (
              <ArticleCard
                key={item.id}
                article={item as any}
                onClick={onArticleClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Apple HIG: Continue Reading with enhanced placeholder */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Continue Reading</h3>
        </div>
        
        <Card className="p-8 text-center border-border/50 bg-card/50">
          <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Reading History</h4>
          <p className="text-muted-foreground mb-4">
            Your reading progress and history will be available here soon.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Progress tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Reading history</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}