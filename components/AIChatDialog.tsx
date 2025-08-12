import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { ollamaService } from '../src/services/ollamaService';

interface ChatMessage {
  id: number;
  message: string;
  response: string;
  created_at: string;
}

interface AIChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  articleId?: string;
  articleTitle?: string;
  articleContent?: string;
}

export function AIChatDialog({ isOpen, onClose, articleId, articleTitle, articleContent }: AIChatDialogProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSuggestedQuestions();
      checkOllamaAvailability();
    }
  }, [isOpen]);

  const checkOllamaAvailability = async () => {
    try {
      const available = await ollamaService.isAvailable();
      setIsOllamaAvailable(available);
    } catch (error) {
      console.error('Ollama service not available:', error);
      setIsOllamaAvailable(false);
    }
  };

  const loadSuggestedQuestions = async () => {
    try {
      // Generate contextual questions based on the article
      setSuggestedQuestions([
        "What are the main points of this article?",
        "Can you explain the key concepts mentioned?",
        "What are the implications of this news?",
        "Can you explain this in simpler terms?"
      ]);
    } catch (error) {
      console.error('Error loading suggested questions:', error);
      setSuggestedQuestions([]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isOllamaAvailable) return;

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');

    // Add user message to chat immediately
    const newMessage: ChatMessage = {
      id: Date.now(),
      message: userMessage,
      response: "",
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // Get AI response using Ollama service
      const aiResponse = await ollamaService.generateArticleChatResponse(
        userMessage,
        articleContent || "",
        articleTitle || "This article"
      );

      // Update the message with the AI response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, response: aiResponse }
            : msg
        )
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Update with error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, response: "Sorry, I'm having trouble connecting to the AI service right now. Please try again later." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
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
                <p className="text-sm text-muted-foreground">
                  Ask questions about: {articleTitle}
                  {!isOllamaAvailable && (
                    <span className="text-red-500 ml-2">(AI service unavailable)</span>
                  )}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[60vh]">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation about this article</p>
                {!isOllamaAvailable && (
                  <p className="text-sm text-red-500 mt-2">
                    AI service is currently unavailable. Please check your Ollama service configuration.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    {message.response && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                          <p className="text-sm whitespace-pre-wrap">{message.response}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Loading indicator */}
                    {!message.response && isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Suggested Questions */}
          {suggestedQuestions.length > 0 && messages.length === 0 && (
            <div className="p-6 border-t border-border">
              <p className="text-sm font-medium mb-3">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuestionClick(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isOllamaAvailable ? "Ask a question about this article..." : "AI service unavailable"}
                className="flex-1 min-h-[60px] resize-none"
                disabled={!isOllamaAvailable}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || !isOllamaAvailable}
                className="self-end"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
