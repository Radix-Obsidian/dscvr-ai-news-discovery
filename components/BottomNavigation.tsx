import { Home, Grid3x3, Edit3, User } from "lucide-react";
import { Button } from "./ui/button";

export type NavTab = "home" | "categories" | "write" | "profile";

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onCategoryChange?: (category: string) => void;
}

const navItems = [
  { id: "home" as NavTab, icon: Home, label: "Home" },
  { id: "categories" as NavTab, icon: Grid3x3, label: "Categories" },
  { id: "write" as NavTab, icon: Edit3, label: "Write" },
  { id: "profile" as NavTab, icon: User, label: "Profile" },
];

export function BottomNavigation({ activeTab, onTabChange, onCategoryChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`
                flex flex-col items-center gap-1 px-3 py-2 h-auto min-w-0 flex-1
                ${isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
              onClick={() => {
                onTabChange(item.id);
                if (onCategoryChange && item.id === "categories") {
                  onCategoryChange("For You");
                }
              }}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}