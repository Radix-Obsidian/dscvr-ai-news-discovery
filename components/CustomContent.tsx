import { Plus, Settings, Eye, Users, Globe, Lock, Edit3, Trash2, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { useState } from "react";
// Article and FeedItem imports removed as they're not being used

// CustomContentProps interface removed as it's not being used

interface CustomFeed {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  sources: string[];
  isPublic: boolean;
  followers: number;
  articles: number;
  lastUpdated: string;
  color: string;
}

const mockCustomFeeds: CustomFeed[] = [
  {
    id: "1",
    name: "AI Breakthroughs",
    description: "Latest developments in artificial intelligence and machine learning",
    keywords: ["AI", "Machine Learning", "Neural Networks", "Deep Learning"],
    sources: ["TechCrunch", "MIT Technology Review", "Nature AI"],
    isPublic: true,
    followers: 1247,
    articles: 89,
    lastUpdated: "2 hours ago",
    color: "bg-blue-500"
  },
  {
    id: "2", 
    name: "Quantum Research",
    description: "Quantum computing and quantum physics research updates",
    keywords: ["Quantum", "Computing", "Physics", "Entanglement"],
    sources: ["Nature Physics", "Science", "IEEE Spectrum"],
    isPublic: false,
    followers: 0,
    articles: 34,
    lastUpdated: "5 hours ago",
    color: "bg-purple-500"
  },
  {
    id: "3",
    name: "Climate Tech",
    description: "Environmental technology and climate change solutions",
    keywords: ["Climate", "Environment", "Renewable Energy", "Sustainability"],
    sources: ["CleanTechnica", "GreenTech Media", "Yale Environment 360"],
    isPublic: true,
    followers: 892,
    articles: 156,
    lastUpdated: "1 day ago",
    color: "bg-green-500"
  }
];

const suggestedTopics = [
  "Space Exploration", "Biotechnology", "Renewable Energy", "Cybersecurity", 
  "Autonomous Vehicles", "Virtual Reality", "5G Technology", "Blockchain",
  "Gene Therapy", "Materials Science", "Nanotechnology", "Robotics"
];

const popularSources = [
  "Nature", "Science", "MIT Technology Review", "IEEE Spectrum", "TechCrunch",
  "The Verge", "Wired", "Ars Technica", "Scientific American", "New Scientist"
];

interface CustomContentProps {
  onArticleClick?: (article: any) => void;
  onCategoryChange?: (category: string) => void;
}

export function CustomContent({ onArticleClick: _onArticleClick, onCategoryChange: _onCategoryChange }: CustomContentProps) {
  // Props are available for future use
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedDescription, setNewFeedDescription] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [followedFeeds, setFollowedFeeds] = useState<string[]>([]);
  const [myFeeds, setMyFeeds] = useState(mockCustomFeeds);

  const handleCreateFeed = () => {
    const newFeed: CustomFeed = {
      id: Date.now().toString(),
      name: newFeedName,
      description: newFeedDescription,
      keywords: selectedKeywords,
      sources: selectedSources,
      isPublic,
      followers: 0,
      articles: 0,
      lastUpdated: "Just now",
      color: "bg-blue-500"
    };
    
    setMyFeeds(prev => [newFeed, ...prev]);
    setIsCreateDialogOpen(false);
    
    // Reset form
    setNewFeedName("");
    setNewFeedDescription("");
    setSelectedKeywords([]);
    setSelectedSources([]);
    setIsPublic(true);
  };

  const handleFollowFeed = (feedName: string) => {
    setFollowedFeeds(prev => 
      prev.includes(feedName) 
        ? prev.filter(name => name !== feedName)
        : [...prev, feedName]
    );
  };

  const isFollowing = (feedName: string) => followedFeeds.includes(feedName);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Custom Feeds</h2>
          <p className="text-muted-foreground">Create personalized news feeds based on your interests</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Feed
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Custom Feed</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a new custom feed with your preferred topics and sources
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feed-name" className="text-foreground">Feed Name</Label>
                  <Input 
                    id="feed-name"
                    placeholder="Enter feed name..."
                    value={newFeedName}
                    onChange={(e) => setNewFeedName(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feed-description" className="text-foreground">Description</Label>
                  <Textarea 
                    id="feed-description"
                    placeholder="Describe what this feed covers..."
                    value={newFeedDescription}
                    onChange={(e) => setNewFeedDescription(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-3">
                <Label className="text-foreground">Keywords & Topics</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((topic) => (
                    <Badge
                      key={topic}
                      variant={selectedKeywords.includes(topic) ? "default" : "secondary"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleKeyword(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div className="space-y-3">
                <Label className="text-foreground">Preferred Sources</Label>
                <div className="flex flex-wrap gap-2">
                  {popularSources.map((source) => (
                    <Badge
                      key={source}
                      variant={selectedSources.includes(source) ? "default" : "secondary"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleSource(source)}
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-foreground">Public Feed</Label>
                  <p className="text-sm text-muted-foreground">Allow others to discover and follow this feed</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateFeed}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!newFeedName.trim()}
                >
                  Create Feed
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="my-feeds" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="my-feeds" className="data-[state=active]:bg-background">My Feeds</TabsTrigger>
          <TabsTrigger value="discover" className="data-[state=active]:bg-background">Discover</TabsTrigger>
          <TabsTrigger value="following" className="data-[state=active]:bg-background">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="my-feeds" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myFeeds.map((feed) => (
              <Card key={feed.id} className="p-4 space-y-4 border-border bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${feed.color}`} />
                    <div>
                      <h4 className="font-semibold text-foreground">{feed.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{feed.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {feed.keywords.slice(0, 3).map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {feed.keywords.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{feed.keywords.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {feed.articles}
                    </div>
                    {feed.isPublic && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {feed.followers}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {feed.isPublic ? (
                      <Globe className="h-3 w-3 text-green-500" />
                    ) : (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-border text-foreground hover:bg-muted">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Popular Public Feeds */}
            {[
              { name: "Tech Innovations", followers: 5234, articles: 1247, description: "Latest technology breakthroughs and innovations" },
              { name: "Science Daily", followers: 3891, articles: 892, description: "Daily science news and research updates" },
              { name: "Startup News", followers: 2156, articles: 567, description: "Startup funding, acquisitions, and industry news" },
              { name: "AI Research", followers: 4567, articles: 234, description: "Cutting-edge AI and machine learning research" }
            ].map((feed, index) => (
              <Card key={index} className="p-4 space-y-4 border-border bg-card">
                <div>
                  <h4 className="font-semibold text-foreground">{feed.name}</h4>
                  <p className="text-sm text-muted-foreground">{feed.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {feed.followers.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {feed.articles}
                    </div>
                  </div>
                  <Button 
                    variant={isFollowing(feed.name) ? "default" : "outline"} 
                    size="sm" 
                    className={`border-border text-foreground hover:bg-muted ${isFollowing(feed.name) ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => handleFollowFeed(feed.name)}
                  >
                    <Star className={`h-3 w-3 mr-1 ${isFollowing(feed.name) ? 'fill-current' : ''}`} />
                    {isFollowing(feed.name) ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-4 mt-6">
          {followedFeeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Tech Innovations", followers: 5234, articles: 1247, description: "Latest technology breakthroughs and innovations" },
                { name: "Science Daily", followers: 3891, articles: 892, description: "Daily science news and research updates" },
                { name: "Startup News", followers: 2156, articles: 567, description: "Startup funding, acquisitions, and industry news" },
                { name: "AI Research", followers: 4567, articles: 234, description: "Cutting-edge AI and machine learning research" }
              ].filter(feed => followedFeeds.includes(feed.name)).map((feed, index) => (
                <Card key={index} className="p-4 space-y-4 border-border bg-card">
                  <div>
                    <h4 className="font-semibold text-foreground">{feed.name}</h4>
                    <p className="text-sm text-muted-foreground">{feed.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {feed.followers.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {feed.articles}
                      </div>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-primary text-primary-foreground"
                      onClick={() => handleFollowFeed(feed.name)}
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Following
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No feeds followed yet</h3>
              <p className="text-muted-foreground mb-4">Discover and follow feeds created by other users to stay updated on topics you care about.</p>
              <Button 
                variant="outline" 
                className="border-border text-foreground hover:bg-muted"
                onClick={() => {
                  const discoverTab = document.querySelector('[data-value="discover"]') as HTMLElement;
                  if (discoverTab) discoverTab.click();
                }}
              >
                Discover Feeds
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}