import { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

import { Card } from "./ui/card";
import { Clock, BookOpen, TrendingUp } from "lucide-react";

interface ReadingProgressProps {
  progress: number;
  onProgressChange: (progress: number) => void;
}

export function ReadingProgress({ 
  progress, 
  onProgressChange 
}: ReadingProgressProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      onProgressChange(Math.min(scrollPercent, 100));
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onProgressChange]);



  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 w-64 shadow-lg border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Reading Progress</span>
          </div>
          <Badge variant={progress >= 100 ? "default" : "secondary"}>
            {progress >= 100 ? "Completed" : `${Math.round(progress)}%`}
          </Badge>
        </div>
        
        <Progress value={progress} className="mb-3" />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Reading time</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Progress</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
