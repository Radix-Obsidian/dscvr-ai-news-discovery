import { Search, User, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { useAuth } from "./AuthContext";


interface HeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSettingsClick?: () => void;
  onSearchOpen?: () => void;
  onAuthOpen?: () => void;
  className?: string;
}

const categories = ["For You", "Top", "Tech & Science", "Finance", "World", "AI", "Custom"];

export function Header({ activeCategory, onCategoryChange, onSettingsClick, onSearchOpen, onAuthOpen, className }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm ${className || ''}`}>
      <div className="px-6 py-4">
        {/* Apple HIG: Clear visual hierarchy with proper spacing */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo and branding - Apple HIG: Prominent but not overwhelming */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              Dscvr
            </h1>
            <div className="h-6 w-px bg-border/50" />
            <span className="text-sm text-muted-foreground font-medium">
              AI News Discovery
            </span>
          </div>
          
          {/* Action buttons - Apple HIG: Clear touch targets and proper spacing */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchOpen}
              className="h-10 w-10 text-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
              aria-label="Search articles"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="h-10 w-10 text-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={onAuthOpen}
                className="h-10 w-10 text-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                aria-label="Sign in"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Apple HIG: Category navigation with clear active states */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <Button
                key={category}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={`h-9 px-4 whitespace-nowrap font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent hover:border-border/50"
                }`}
                aria-pressed={isActive}
                aria-label={`View ${category} articles`}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
}