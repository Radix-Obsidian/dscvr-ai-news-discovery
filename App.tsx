import { useState } from "react";
import { Header } from "./components/Header";
import { MobileHeader } from "./components/MobileHeader";
import { ArticleFeed } from "./components/ArticleFeed";
import { EnhancedArticleDetail } from "./components/EnhancedArticleDetail";
import { BottomNavigation, NavTab } from "./components/BottomNavigation";
import { Sidebar } from "./components/Sidebar";
import { ForYouContent } from "./components/ForYouContent";
import { CustomContent } from "./components/CustomContent";
import { SettingsPage } from "./components/SettingsPage";
import { AuthProvider } from "./components/AuthContext";
import { Article, FeedItem } from "./components/ArticleCard";
import { Toaster } from "./components/ui/sonner";
import { SearchDialog } from "./components/SearchDialog";
import { AuthDialog } from "./components/AuthDialog";
import { useFeedBuilder } from "./src/hooks/useFeedBuilder";
import { SidebarProvider } from "./components/ui/sidebar";

type View = "feed" | "article" | "settings";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("For You");
  const [selectedArticle, setSelectedArticle] = useState<Article | FeedItem | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [currentView, setCurrentView] = useState<View>("feed");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Use the new feed builder service
  const { items: articles, loading, error } = useFeedBuilder({
    category: activeCategory === "For You" ? undefined : activeCategory,
    limit: 20,
    autoRefresh: true,
    refreshInterval: 300000 // 5 minutes
  });

  const handleArticleClick = (article: Article | FeedItem) => {
    setSelectedArticle(article);
    setCurrentView("article");
  };

  const handleBackToFeed = () => {
    setSelectedArticle(null);
    setCurrentView("feed");
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSelectedArticle(null);
    setCurrentView("feed");
  };

  const handleSettingsClick = () => {
    setCurrentView("settings");
  };

  const handleBackFromSettings = () => {
    setCurrentView("feed");
  };

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleAuthOpen = () => {
    setIsAuthOpen(true);
  };

  const handleArticleClickFromSearch = (article: Article | FeedItem) => {
    setSelectedArticle(article);
    setCurrentView("article");
    setIsSearchOpen(false);
  };

  // Settings page view
  if (currentView === "settings") {
    return (
      <AuthProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-background">
            <SettingsPage onBack={handleBackFromSettings} />
            <Toaster />
          </div>
        </SidebarProvider>
      </AuthProvider>
    );
  }

  // Article detail view
  if (currentView === "article" && selectedArticle) {
    return (
      <AuthProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-background">
            <EnhancedArticleDetail 
              articleId={selectedArticle.id} 
              onBack={handleBackToFeed}
            />
            <Toaster />
          </div>
        </SidebarProvider>
      </AuthProvider>
    );
  }

  // Render custom content for specific categories
  const renderMainContent = () => {
    if (activeCategory === "For You") {
      return (
        <ForYouContent 
          onArticleClick={handleArticleClick}
          onCategoryChange={handleCategoryChange}
        />
      );
    } else if (activeCategory === "Custom") {
      return (
        <CustomContent 
          onArticleClick={handleArticleClick}
          onCategoryChange={handleCategoryChange}
        />
      );
    } else {
      return (
        <ArticleFeed 
          articles={articles as any}
          loading={loading}
          error={error}
          onArticleClick={handleArticleClick}
        />
      );
    }
  };

  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <Header 
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            onSearchOpen={handleSearchOpen}
            onAuthOpen={handleAuthOpen}
            onSettingsClick={handleSettingsClick}
            className="hidden md:block"
          />
          
          <MobileHeader 
            onSearchOpen={handleSearchOpen}
            onAuthOpen={handleAuthOpen}
            onMenuOpen={() => console.log("Menu opened")}
          />
          
          <div className="flex">
            <Sidebar 
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              className="hidden md:block"
            />
            
            <main className="flex-1">
              {renderMainContent()}
            </main>
          </div>

          <BottomNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCategoryChange={handleCategoryChange}
          />

          <SearchDialog 
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onArticleClick={handleArticleClickFromSearch}
          />

          <AuthDialog 
            isOpen={isAuthOpen}
            onOpenChange={setIsAuthOpen}
          />

          <Toaster />
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}