
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Send, User, Bot, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useGroqApi } from '@/hooks/useGroqApi';
import ApiKeyForm from './ApiKeyForm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { callGroqApi, isLoading, apiKey, saveApiKey, clearApiKey } = useGroqApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await callGroqApi(`Answer this coding question: ${input}`, false);
      
      if (response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.fullResponse,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="text-sm font-medium flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-primary" />
          Coding Assistant
        </h2>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs"
        >
          <Settings className="h-3.5 w-3.5" />
          API Settings
          {showSettings ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </div>
      
      {showSettings && (
        <div className="p-3 border-b border-border bg-background/50">
          <ApiKeyForm 
            apiKeyExists={apiKey}
            onSaveKey={saveApiKey}
            onClearKey={clearApiKey}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-auto p-3 space-y-3 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-1">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">Ask a coding question</p>
              <p className="text-xs text-muted-foreground">
                E.g. "How do I handle file uploads in Flask?"
              </p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={cn(
                "flex gap-2 text-sm p-2 rounded-lg max-w-[90%]",
                message.role === 'user' 
                  ? "ml-auto bg-primary text-primary-foreground" 
                  : "mr-auto bg-secondary"
              )}
            >
              <div className="flex-shrink-0 w-5 h-5">
                {message.role === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              <div className="overflow-auto">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-1">{line}</p>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a coding question..."
            className="w-full p-2 pr-10 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !apiKey}
            className={cn(
              "absolute right-1 top-1 p-1 rounded-md transition-colors",
              isLoading 
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:bg-primary/90",
              (!input.trim() || !apiKey) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
