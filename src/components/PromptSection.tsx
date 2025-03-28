import React, { useState } from 'react';
import { Sparkles, Send, Settings, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ApiKeyForm from './ApiKeyForm';

interface PromptSectionProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  apiKeyExists: boolean;
  onSaveApiKey: (key: string) => boolean;
  onClearApiKey: () => void;
  className?: string;
}

const PromptSection: React.FC<PromptSectionProps> = ({
  onSubmit,
  isLoading,
  apiKeyExists,
  onSaveApiKey,
  onClearApiKey,
  className
}) => {
  const [prompt, setPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    if (!apiKeyExists) {
      toast.error('Please set your Groq API key first');
      setShowSettings(true);
      return;
    }
    
    onSubmit(prompt);
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="text-sm font-medium flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Prompt
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
            apiKeyExists={apiKeyExists}
            onSaveKey={onSaveApiKey}
            onClearKey={onClearApiKey}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-auto p-3">
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full min-h-[100px] p-3 pr-10 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={cn(
              "absolute bottom-3 right-3 p-1.5 rounded-md transition-colors",
              isLoading 
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:bg-primary/90",
              !prompt.trim() && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {isLoading && (
          <div className="mt-2 text-xs text-center text-muted-foreground animate-pulse">
            AI is thinking...
          </div>
        )}
      </form>
    </div>
  );
};

export default PromptSection;
