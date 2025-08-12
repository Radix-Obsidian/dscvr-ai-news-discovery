import { TrendingUp, TrendingDown, RefreshCw, Home, Search, Bookmark, Plus } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState, useEffect, useCallback } from "react";

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const categories = [
  { id: "For You", name: "For You", icon: Home },
  { id: "Trending", name: "Trending", icon: TrendingUp },
  { id: "General", name: "General", icon: Search },
  { id: "Custom", name: "Custom", icon: Bookmark },
];

// Mock data for stock and weather
const mockMarketData = [
  { symbol: "S&P 500", price: 4567.89, change: 23.45, changePercent: 0.52 },
  { symbol: "NASDAQ", price: 14234.56, change: -12.34, changePercent: -0.09 },
  { symbol: "DOW", price: 35678.90, change: 45.67, changePercent: 0.13 }
];

const mockCompaniesData = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.45, change: 2.34 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.67, change: -1.23 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.90, change: 5.67 }
];

const mockWeatherData = {
  current: {
    temperature: 72,
    weatherCode: 1000
  },
  location: {
    city: "San Francisco"
  },
  forecast: [
    { day: "Mon", high: 75, low: 65 },
    { day: "Tue", high: 78, low: 68 },
    { day: "Wed", high: 72, low: 62 },
    { day: "Thu", high: 76, low: 66 },
    { day: "Fri", high: 80, low: 70 }
  ]
};

const getWeatherIcon = (code: number) => {
  if (code === 1000) return "☀️";
  return "☀️";
};

const getWeatherDescription = (code: number) => {
  if (code === 1000) return "Clear";
  return "Clear";
};

export function Sidebar({ activeCategory, onCategoryChange, className }: SidebarProps) {
  const [marketData] = useState(mockMarketData);
  const [companiesData] = useState(mockCompaniesData);
  const [weatherData] = useState(mockWeatherData);
  const [isLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const updateMarketData = useCallback(() => {
    setLastUpdate(new Date());
    // Market data update logic commented out for now
  }, []);

  useEffect(() => {
    const interval = setInterval(updateMarketData, 60000); // Reduced to 1 minute to minimize reflows

    return () => clearInterval(interval);
  }, [updateMarketData]);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(2);
  };

  const formatChange = (change: number) => {
    return change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  };

  return (
    <div className={`w-80 space-y-6 sticky top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto ${className || ''}`}>
      {/* Weather Widget - Apple HIG: Clear visual hierarchy, proper spacing */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label="Weather icon">
              {getWeatherIcon(weatherData.current.weatherCode)}
            </span>
            <div>
              <span className="text-2xl font-semibold text-foreground">
                {weatherData.current.temperature}°F
              </span>
              <div className="text-sm text-muted-foreground">
                {getWeatherDescription(weatherData.current.weatherCode)}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm font-medium text-foreground mb-4">
          {weatherData.location.city}
        </p>
        
        {/* Apple HIG: Consistent grid, proper touch targets */}
        <div className="grid grid-cols-5 gap-3">
          {weatherData.forecast.map((forecast, index) => (
            <div key={index} className="text-center p-2 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                {forecast.day}
              </div>
              <div className="text-sm font-semibold text-foreground">
                {forecast.high}°
              </div>
              <div className="text-xs text-muted-foreground">
                {forecast.low}°
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories - Apple HIG: Clear navigation, proper button states */}
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

      {/* Market Outlook - Apple HIG: Data visualization, clear metrics */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-foreground">Market Outlook</h3>
          <div className="flex items-center gap-2">
            {isLoading && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {marketData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-colors">
              <div>
                <div className="font-semibold text-foreground">{item.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  ${formatPrice(item.price)}
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1.5 text-sm font-medium ${
                  item.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatChange(item.change)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trending Companies - Apple HIG: Rich content, clear hierarchy */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-foreground">Trending Companies</h3>
          <div className="flex items-center gap-2">
            {isLoading && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {companiesData.map((company, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {company.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground truncate max-w-[120px]">
                    {company.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {company.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">
                  ${formatPrice(company.price)}
                </div>
                <div className={`text-sm font-medium ${
                  company.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {company.change >= 0 ? '+' : ''}{company.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Feed Status - Apple HIG: System status, clear indicators */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Feed Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
            <span className="text-sm font-medium text-foreground">Active Feeds</span>
            <Badge variant="secondary" className="font-semibold">10</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
            <span className="text-sm font-medium text-foreground">Last Update</span>
            <span className="text-xs text-muted-foreground font-medium">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <span className="text-sm font-medium text-foreground">Status</span>
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white font-semibold">
              Online
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}