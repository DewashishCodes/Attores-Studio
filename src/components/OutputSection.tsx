
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, Copy, Code, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import CodeEditor from './CodeEditor';

interface OutputSectionProps {
  fullResponse: string;
  extractedCode: string;
  isLoading: boolean;
  onCodeChange: (code: string) => void;
  className?: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({
  fullResponse,
  extractedCode,
  isLoading,
  onCodeChange,
  className
}) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(extractedCode);
    toast.success('Code copied to clipboard');
  };
  
  const handleCopyFullResponse = () => {
    navigator.clipboard.writeText(fullResponse);
    toast.success('Response copied to clipboard');
  };

  // Clean up the response by removing code blocks for display
  const cleanResponse = fullResponse.replace(/###CODE_START###[\s\S]*?###CODE_END###/g, '')
    .replace(/```(?:python)?\n[\s\S]*?```/g, '')
    .trim();

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <h2 className="text-sm font-medium flex items-center gap-1.5">
            <Bot className="h-4 w-4 text-primary" />
            AI Response
          </h2>
          
          {fullResponse && (
            <button
              onClick={handleCopyFullResponse}
              className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Copy full response"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="p-4 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Processing your request...</p>
            </div>
          </div>
        ) : cleanResponse ? (
          <div className="p-4 text-sm overflow-auto max-h-[200px] custom-scrollbar">
            {cleanResponse.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        ) : extractedCode ? (
          <div className="p-4 text-center text-sm text-muted-foreground italic">
            Code has been generated and placed in the editor below
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground italic">
            AI response will appear here
          </div>
        )}
      </div>
      
      {extractedCode && (
        <>
          <div className="flex items-center justify-between px-4 py-2 border-y border-border">
            <h2 className="text-sm font-medium flex items-center gap-1.5">
              <Code className="h-4 w-4 text-primary" />
              Generated Code
            </h2>
            
            <button
              onClick={handleCopyCode}
              className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Copy code"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={extractedCode}
              onChange={onCodeChange}
              language="python"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OutputSection;
