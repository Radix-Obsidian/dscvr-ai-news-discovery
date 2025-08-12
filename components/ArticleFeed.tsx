import { ArticleCard, Article } from "./ArticleCard";
import { Card } from "./ui/card";

interface ArticleFeedProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  loading?: boolean;
  error?: string | null;
}

export function ArticleFeed({ articles, onArticleClick, loading = false, error = null }: ArticleFeedProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card key={index} className="border-border">
              <div className="aspect-video bg-muted animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-6 border-border">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">Failed to load articles</p>
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-6 border-border">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">No articles found</p>
            <p className="text-sm">Try selecting a different category or check back later.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid layout for articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={onArticleClick as any}
          />
        ))}
      </div>
    </div>
  );
}