import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Search, Clock, TrendingUp, ArrowRight, Loader2, X, Sparkles } from "lucide-react";
import { Article, FeedItem } from "./ArticleCard";

import { useSearchItems, useTrendingItems } from "../src/hooks/useFeedBuilder";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleClick: (article: Article | FeedItem) => void;
}

export function SearchDialog({ isOpen, onClose, onArticleClick }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  // Use the new feed builder hooks
  const { items: searchResults, loading: isSearching, error: searchError, search, clearSearch } = useSearchItems(20);
  const { items: trendingItems, loading: trendingLoading } = useTrendingItems(5);
  
  // Mock recent searches for now (would come from user history in real app)
  const recentSearches = [
    "AI breakthrough", "Quantum computing", "Climate tech", "Space exploration"
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setHasSearched(false);
      clearSearch();
      return;
    }

    setHasSearched(true);
    await search(searchQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  const handleResultClick = (result: Article | FeedItem) => {
    onArticleClick(result);
    onClose();
  };

  const handleClearSearch = () => {
    setQuery("");
    setHasSearched(false);
    clearSearch();
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setHasSearched(false);
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-card/95 backdrop-blur-sm border-border/50 p-0 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-foreground sr-only">Search Articles</DialogTitle>
          
          {/* Apple HIG: Prominent search field with clear visual hierarchy */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles, topics, or sources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-12 h-14 bg-background/50 border-border/50 text-foreground text-lg font-medium rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                autoFocus
                aria-label="Search articles"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {!hasSearched ? (
            // Apple HIG: Initial state with clear sections and visual hierarchy
            <div className="p-6 space-y-8">
              {/* Trending Items - Apple HIG: Rich content with clear visual cues */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Trending Now</h3>
                </div>
                <div className="grid gap-3">
                  {trendingLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} className="p-4 border-border/50 bg-card/50">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 bg-muted/50 rounded-lg animate-pulse"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    trendingItems.slice(0, 3).map((item) => (
                      <Card 
                        key={item.id} 
                        className="p-4 cursor-pointer hover:bg-accent/30 hover:shadow-md transition-all duration-200 border-border/50 bg-card/50 group"
                        onClick={() => handleResultClick(item as any)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Read article: ${item.title}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleResultClick(item as any);
                          }
                        }}
                      >
                        <div className="flex gap-4">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="h-12 w-12 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-lg hidden">📰</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate text-base group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {item.excerpt}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Recent Searches - Apple HIG: Quick access to previous searches */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Recent Searches</h3>
                </div>
                <div className="grid gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-12 px-4 hover:bg-accent/30 hover:text-foreground transition-colors rounded-lg"
                      onClick={() => handleQuickSearch(search)}
                    >
                      <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground font-medium">{search}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Suggestions - Apple HIG: Helpful suggestions for discovery */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Popular Topics</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Technology", "Science", "Business", "Health", "Environment", "Space"].map((topic) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="px-3 py-1 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                      onClick={() => handleQuickSearch(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Apple HIG: Search results with clear information hierarchy
            <div className="p-6 space-y-6">
              {isSearching ? (
                // Loading state - Apple HIG: Clear loading feedback
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-foreground font-medium">Searching...</span>
                  </div>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="p-4 border-border/50 bg-card/50">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 bg-muted/50 rounded-lg animate-pulse"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                          <div className="h-3 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                          <div className="h-3 bg-muted/50 rounded w-1/4 animate-pulse"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : searchError ? (
                // Error state - Apple HIG: Clear error messaging with recovery options
                <div className="text-center py-12">
                  <div className="p-4 bg-destructive/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Search failed</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't complete your search. Please try again.
                  </p>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => handleSearch(query)}
                    className="px-6"
                  >
                    Try Again
                  </Button>
                </div>
              ) : searchResults.length > 0 ? (
                // Search results - Apple HIG: Rich content with clear metadata
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear Search
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <Card
                        key={result.id}
                        className="p-4 cursor-pointer hover:bg-accent/30 hover:shadow-md transition-all duration-200 border-border/50 bg-card/50 group"
                        onClick={() => handleResultClick(result as any)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Read article: ${result.title}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleResultClick(result as any);
                          }
                        }}
                      >
                        <div className="flex gap-4">
                          <img
                            src={result.imageUrl}
                            alt={result.title}
                            className="h-16 w-16 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="h-16 w-16 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-xl hidden">📰</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                              {result.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {result.excerpt}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                {result.category}
                              </Badge>
                              <span className="font-medium">
                                {new Date(result.publishedAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span className="font-medium">{result.author}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors self-center" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                // No results - Apple HIG: Helpful empty state with suggestions
                <div className="text-center py-12">
                  <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try searching with different keywords or browse trending topics below.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Technology", "Science", "Business", "Health"].map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="px-3 py-1 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                        onClick={() => handleQuickSearch(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}