import { Search, User, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "./AuthContext";

interface MobileHeaderProps {
  onSearchOpen?: () => void;
  onAuthOpen?: () => void;
  onMenuOpen?: () => void;
}

export function MobileHeader({ onSearchOpen, onAuthOpen, onMenuOpen }: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm md:hidden">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuOpen}
              className="h-8 w-8 text-foreground hover:bg-accent/50"
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-bold text-primary tracking-tight">
              Dscvr
            </h1>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchOpen}
              className="h-8 w-8 text-foreground hover:bg-accent/50"
              aria-label="Search articles"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:bg-accent/50"
                aria-label="Profile"
              >
                <User className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={onAuthOpen}
                className="h-8 w-8 text-foreground hover:bg-accent/50"
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
