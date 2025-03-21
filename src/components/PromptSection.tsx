
import React, { useState } from 'react';
import { Sparkles, Send, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PromptSectionProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  className?: string;
}

const PromptSection: React.FC<PromptSectionProps> = ({
  onSubmit,
  isLoading,
  className
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    onSubmit(prompt);
  };

  const samplePrompts = [
    "Generate a function to check if a string is a palindrome",
    "Create a Python script to download files from a URL",
    "Write a recursive function to calculate factorial",
    "Create a simple Flask API with two endpoints"
  ];

  const handleSampleClick = (sample: string) => {
    setPrompt(sample);
  };

  const handleCopySample = (sample: string) => {
    navigator.clipboard.writeText(sample);
    toast.success('Prompt copied to clipboard');
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="text-sm font-medium flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Prompt
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto p-3 space-y-2">
        <p className="text-sm text-muted-foreground">Sample prompts:</p>
        
        <div className="space-y-1.5">
          {samplePrompts.map((sample, index) => (
            <div 
              key={index}
              className="group flex items-center justify-between text-xs bg-secondary/50 hover:bg-secondary p-2 rounded-md cursor-pointer transition-colors"
              onClick={() => handleSampleClick(sample)}
            >
              <span className="line-clamp-1">{sample}</span>
              <button 
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded-md transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopySample(sample);
                }}
              >
                <Copy className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
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
