import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Share2, Bot, Clock, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { AIChatDialog } from "./AIChatDialog";
import { ReadingProgress } from "./ReadingProgress";
import { Article } from "./ArticleCard";

interface EnhancedArticleDetailProps {
  articleId: string;
  onBack: () => void;
}

export function EnhancedArticleDetail({ articleId, onBack }: EnhancedArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  
  // Mock article data as fallback
  const mockArticle: Article = {
    id: articleId,
    title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
    blurb: "A new AI model demonstrates human-level reasoning capabilities, marking a significant breakthrough in artificial intelligence research.",
    content: "A new AI model demonstrates human-level reasoning capabilities, marking a significant breakthrough in artificial intelligence research. This development represents a major step forward in the field of artificial intelligence, with implications for various industries and applications. The model, developed by researchers at leading institutions, shows remarkable ability to understand and process complex information in ways that were previously thought to be uniquely human. This breakthrough opens up new possibilities for AI applications in fields such as healthcare, education, and scientific research. The implications of this development are far-reaching and could fundamentally change how we interact with technology in the coming years.",
    author: "Dr. Sarah Chen",
    source: "Nature AI",
    url: "#",
    publishedAt: "2024-01-15T10:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category: "AI & Technology",
    tags: ["AI", "artificial intelligence", "research", "breakthrough"],
    readingTime: 8,
    wordCount: 1600,
    sentiment: "positive",
    language: "en",
    country: "US",
    apiSource: "rss-feed",
    sourceCount: 1
  };

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      try {
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setArticle(mockArticle);
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const [aiSummary, setAiSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.blurb,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      if (article) {
        navigator.clipboard.writeText(`${article.title}\n\n${article.blurb}\n\n${window.location.href}`);
      }
    }
  };

  const generateAISummary = async () => {
    if (!article) return;
    
    setSummaryLoading(true);
    try {
      // Mock AI summary generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAiSummary({
        summary: "This article discusses a significant breakthrough in artificial intelligence research, where a new model demonstrates human-level reasoning capabilities. The development represents a major advancement in AI technology with far-reaching implications.",
        key_points: [
          "New AI model shows human-level reasoning abilities",
          "Major breakthrough in artificial intelligence research",
          "Implications for healthcare, education, and scientific research",
          "Could fundamentally change human-technology interaction"
        ],
        essential_info: "The research demonstrates that AI systems can now process and understand complex information in ways previously thought to be uniquely human, opening new possibilities for AI applications across various industries.",
        reading_time: 3
      });
    } catch (error) {
      console.error('Error generating AI summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-48"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
              <div className="aspect-video bg-muted rounded-lg mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-foreground font-medium">Error</div>
            <div className="w-8"></div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <div className="p-4 bg-destructive/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ArrowLeft className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Failed to load article</h2>
            <p className="text-muted-foreground mb-6">{error || 'Article not found'}</p>
            <Button onClick={onBack} variant="outline">
              Go Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Apple HIG: Enhanced header with better visual hierarchy */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="border-primary text-primary">
              {article.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAIChatOpen(true)}
              className="text-foreground hover:bg-muted"
              title="Chat with AI about this article"
            >
              <Bot className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={`text-foreground hover:bg-muted ${isBookmarked ? 'text-primary' : ''}`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:bg-muted"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Apple HIG: Enhanced content area with better typography */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Apple HIG: Enhanced article header */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min read</span>
              </div>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.blurb}
            </p>
            
            {/* Apple HIG: Enhanced tags and sentiment */}
            <div className="flex items-center gap-3 flex-wrap">
              {article.tags.slice(0, 5).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {article.sentiment && (
                <Badge 
                  variant={article.sentiment === 'positive' ? 'default' : article.sentiment === 'negative' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {article.sentiment}
                </Badge>
              )}
            </div>
          </div>

          {/* Apple HIG: Enhanced content area with better typography */}
          <div className="prose prose-lg max-w-none mb-12">
            <ReadingProgress
              progress={readingProgress}
              onProgressChange={setReadingProgress}
            />
            
            {summaryLoading ? (
              <div className="mt-8 space-y-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-muted/50 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted/50 rounded-lg w-full mb-2"></div>
                  <div className="h-4 bg-muted/50 rounded-lg w-5/6"></div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Bot className="h-4 w-4 animate-pulse" />
                  <span>AI is analyzing this article...</span>
                </div>
              </div>
            ) : aiSummary ? (
              <div className="mt-8 space-y-8">
                {/* Apple HIG: Enhanced AI Summary with better visual design */}
                <Card className="p-8 border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Bot className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-900">AI Summary</h3>
                      <p className="text-sm text-blue-700">Generated by our AI assistant</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 font-semibold">
                      ~{aiSummary.reading_time} min read
                    </Badge>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-blue-900 leading-relaxed text-lg">{aiSummary.summary}</p>
                    
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-3 text-lg">Key Points:</h4>
                      <ul className="space-y-2">
                        {aiSummary.key_points.map((point: string, index: number) => (
                          <li key={index} className="text-blue-900 text-base flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-3 text-lg">Essential Information:</h4>
                      <p className="text-blue-900 text-base leading-relaxed">{aiSummary.essential_info}</p>
                    </div>
                  </div>
                </Card>
                
                {/* Apple HIG: Enhanced toggle for full content */}
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowFullContent(!showFullContent)}
                    className="border-border/50 hover:bg-accent/50 px-8"
                  >
                    {showFullContent ? 'Hide Full Article' : 'Show Full Article'}
                  </Button>
                </div>
                
                {/* Full Article Content (hidden by default) */}
                {showFullContent && (
                  <div className="text-foreground leading-relaxed space-y-6 mt-8">
                    {article.content
                      .replace(/&amp;/g, '&') // Fix HTML entities
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"')
                      .replace(/&#39;/g, "'")
                      .replace(/<[^>]*>/g, '') // Remove HTML tags
                      .replace(/\s+/g, ' ') // Normalize whitespace
                      .split('\n\n')
                      .filter((paragraph: string) => paragraph.trim().length > 0)
                      .map((paragraph: string, index: number) => (
                        <p key={index} className="text-lg leading-8">
                          {paragraph.trim()}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Button
                  onClick={generateAISummary}
                  disabled={summaryLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3"
                >
                  <Bot className="h-5 w-5 mr-2" />
                  Generate AI Summary
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Get an intelligent summary and key insights from our AI assistant
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Chat Dialog */}
      <AIChatDialog
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        articleTitle={article.title}
      />
    </div>
  );
}
