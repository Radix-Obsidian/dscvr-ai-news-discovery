import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { Send, Bot, X, Lightbulb, HelpCircle } from "lucide-react";
import { useAuth } from './AuthContext';

interface AIChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
}

interface ChatMessage {
  id: number;
  message: string;
  response: string;
  created_at: string;
}

interface ArticleInsights {
  key_takeaways: string;
  why_matters: string;
  related_topics: string;
  questions: string;
}

export function AIChatDialog({ isOpen, onClose, articleId, articleTitle }: AIChatDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<ArticleInsights | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
      loadInsights();
      loadSuggestedQuestions();
    }
  }, [isOpen, articleId, user]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      // Placeholder for future implementation
      console.log('Chat history loading not implemented yet');
      setMessages([]);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadInsights = async () => {
    try {
      // Placeholder for future AI insights
      setInsights({
        key_takeaways: "AI insights feature coming soon...",
        why_matters: "This feature will provide intelligent analysis of articles.",
        related_topics: "AI, Machine Learning, Content Analysis",
        questions: "What are the main points? How does this relate to current trends?"
      });
    } catch (error) {
      console.error('Error loading insights:', error);
      setInsights(null);
    }
  };

  const loadSuggestedQuestions = async () => {
    try {
      // Placeholder for future AI questions
      setSuggestedQuestions([
        "What are the key takeaways from this article?",
        "How does this relate to current trends?",
        "What are the implications for the future?",
        "Can you explain this in simpler terms?"
      ]);
    } catch (error) {
      console.error('Error loading suggested questions:', error);
      setSuggestedQuestions([]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');

    // Add user message to chat
    const newMessage: ChatMessage = {
      id: Date.now(),
      message: userMessage,
      response: "AI chat feature coming soon! This will provide intelligent responses about the article content.",
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-card border-border p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <DialogTitle className="text-foreground">AI Chat Assistant</DialogTitle>
                <p className="text-sm text-muted-foreground">Ask questions about: {articleTitle}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-[600px]">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-2">AI Chat Coming Soon</h3>
                  <p className="text-muted-foreground">
                    This feature will provide intelligent responses about article content.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <Card className="max-w-[80%] bg-primary text-primary-foreground">
                          <CardContent className="p-3">
                            <p className="text-sm">{msg.message}</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* AI Response */}
                      <div className="flex justify-start">
                        <Card className="max-w-[80%] bg-muted">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4 text-primary" />
                              <span className="text-xs text-muted-foreground">AI Assistant</span>
                            </div>
                            <p className="text-sm">{msg.response}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <Card className="max-w-[80%] bg-muted">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary animate-pulse" />
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about this article..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-border p-6 space-y-6">
            {/* Insights */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">Article Insights</h3>
              </div>
              {insights ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Key Takeaways</h4>
                    <p className="text-xs text-muted-foreground">{insights.key_takeaways}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Why This Matters</h4>
                    <p className="text-xs text-muted-foreground">{insights.why_matters}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Related Topics</h4>
                    <p className="text-xs text-muted-foreground">{insights.related_topics}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Loading insights...</p>
              )}
            </div>

            {/* Suggested Questions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">Suggested Questions</h3>
              </div>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <span className="text-xs">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
