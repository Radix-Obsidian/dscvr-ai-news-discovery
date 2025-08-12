import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  TrendingUp, 
  Search, 
  Bookmark, 
  Plus,
  Sparkles,
  Zap,
  Globe,
  Star
} from "lucide-react";

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const categories = [
  { id: "For You", name: "For You", icon: Sparkles },
  { id: "Top", name: "Top", icon: Star },
  { id: "Tech & Science", name: "Tech & Science", icon: Zap },
  { id: "Finance", name: "Finance", icon: TrendingUp },
  { id: "World", name: "World", icon: Globe },
  { id: "AI", name: "AI", icon: Sparkles },
  { id: "Trending", name: "Trending", icon: TrendingUp },
  { id: "General", name: "General", icon: Search },
  { id: "Custom", name: "Custom", icon: Bookmark },
];

export function Sidebar({ activeCategory, onCategoryChange, className }: SidebarProps) {
  return (
    <div className={`w-80 space-y-6 sticky top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto ${className || ''}`}>
      {/* Categories */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Categories
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Create new category")}
            className="h-8 px-3 text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </div>
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-12 text-left transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-accent/50 text-foreground"
                }`}
                onClick={() => onCategoryChange(category.id)}
                aria-pressed={isActive}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}