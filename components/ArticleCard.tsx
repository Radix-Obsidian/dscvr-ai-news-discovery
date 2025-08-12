import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

import { Clock, User, Tag, TrendingUp, TrendingDown, Minus } from "lucide-react";


export interface Article {
  id: string;
  title: string;
  blurb: string;
  content: string;
  author: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  tags: string[];
  readingTime: number;
  wordCount: number;
  sentiment: "positive" | "negative" | "neutral";
  language: string;
  country: string;
  apiSource: "rss-feed" | "news-api" | "custom";
  sourceCount: number;
}

export interface FeedItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  tags: string[];
  readingTime: number;
  wordCount: number;
  sentiment: "positive" | "negative" | "neutral";
  language: string;
  country: string;
  apiSource: "rss-feed" | "news-api" | "custom";
}

interface ArticleCardProps {
  article: Article | FeedItem;
  size?: "small" | "medium" | "large";
  onClick: (article: Article | FeedItem) => void;
}

export function ArticleCard({ article, size = "medium", onClick }: ArticleCardProps) {
  const {
    title,
    author,
    publishedAt,
    imageUrl,
    category,
    tags,
    readingTime,
    sentiment
  } = article;
  
  // Get blurb from either Article or FeedItem
  const blurb = 'blurb' in article ? article.blurb : article.excerpt;
  
  // Apple HIG: Get sentiment icon for better visual communication
  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />;
      case 'negative':
        return <TrendingDown className="h-3 w-3" />;
      case 'neutral':
        return <Minus className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Apple HIG: Format relative time for better user understanding
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Large card layout (featured article) - Apple HIG: Clear visual hierarchy
  if (size === "large") {
    return (
      <Card 
        className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/10 border-border/50 bg-card/50 backdrop-blur-sm group col-span-full"
        onClick={() => onClick(article)}
        role="button"
        tabIndex={0}
        aria-label={`Read article: ${title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(article);
          }
        }}
      >
        <div className="md:flex">
          {/* Featured Image - Apple HIG: High-quality imagery */}
          <div className="md:w-1/2">
            <div className="relative w-full aspect-video overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-4xl hidden">
                📰
              </div>
            </div>
          </div>
          
          {/* Content - Apple HIG: Clear information hierarchy */}
          <div className="p-8 md:w-1/2 space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {category}
              </Badge>
              {sentiment && (
                <Badge 
                  variant={sentiment === 'positive' ? 'default' : sentiment === 'negative' ? 'destructive' : 'secondary'}
                  className="text-xs flex items-center gap-1"
                >
                  {getSentimentIcon(sentiment)}
                  {sentiment}
                </Badge>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
              {title}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed line-clamp-4 text-base">
              {blurb}
            </p>
            
            {/* Apple HIG: Clear metadata with proper spacing */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                {author && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{author}</span>
                  </div>
                )}
                {readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                )}
              </div>
              <span>{formatRelativeTime(publishedAt)}</span>
            </div>
            
            {/* Apple HIG: Tags for better content discovery */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Medium card layout - Apple HIG: Balanced information density
  if (size === "medium") {
    return (
      <Card 
        className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/10 border-border/50 bg-card/50 backdrop-blur-sm group"
        onClick={() => onClick(article)}
        role="button"
        tabIndex={0}
        aria-label={`Read article: ${title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(article);
          }
        }}
      >
        {/* Image - Apple HIG: Consistent aspect ratio */}
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-2xl hidden">
            📰
          </div>
        </div>
        
        {/* Content - Apple HIG: Clear hierarchy */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              {category}
            </Badge>
            {sentiment && (
              <Badge 
                variant={sentiment === 'positive' ? 'default' : sentiment === 'negative' ? 'destructive' : 'secondary'}
                className="text-xs flex items-center gap-1"
              >
                {getSentimentIcon(sentiment)}
                {sentiment}
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">
            {blurb}
          </p>
          
          {/* Apple HIG: Compact metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[100px]">{author}</span>
                </div>
              )}
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readingTime}m</span>
                </div>
              )}
            </div>
            <span>{formatRelativeTime(publishedAt)}</span>
          </div>
        </div>
      </Card>
    );
  }

  // Small card layout - Apple HIG: Compact but readable
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:shadow-black/10 border-border/50 bg-card/50 backdrop-blur-sm group"
      onClick={() => onClick(article)}
      role="button"
      tabIndex={0}
      aria-label={`Read article: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(article);
        }
      }}
    >
      <div className="flex">
        {/* Small image - Apple HIG: Efficient use of space */}
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-lg hidden">
            📰
          </div>
        </div>
        
        {/* Content - Apple HIG: Essential information only */}
        <div className="p-4 flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
              {category}
            </Badge>
            {sentiment && (
              <Badge 
                variant={sentiment === 'positive' ? 'default' : sentiment === 'negative' ? 'destructive' : 'secondary'}
                className="text-xs flex items-center gap-1"
              >
                {getSentimentIcon(sentiment)}
              </Badge>
            )}
          </div>
          
          <h4 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
            {title}
          </h4>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readingTime}m</span>
                </div>
              )}
            </div>
            <span>{formatRelativeTime(publishedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}