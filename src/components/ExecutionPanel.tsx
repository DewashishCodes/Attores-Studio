
import React from 'react';
import { cn } from '@/lib/utils';
import { Terminal, Play, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ExecutionPanelProps {
  output: string;
  error: string | null;
  executionTime: number;
  isExecuting: boolean;
  onExecute: () => void;
  className?: string;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  output,
  error,
  executionTime,
  isExecuting,
  onExecute,
  className
}) => {
  const hasOutput = output || error;
  
  const handleCopyOutput = () => {
    navigator.clipboard.writeText(error || output);
    toast.success('Output copied to clipboard');
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="text-sm font-medium flex items-center gap-1.5">
          <Terminal className="h-4 w-4 text-primary" />
          Execution Output
        </h2>
        
        <div className="flex items-center gap-1">
          {hasOutput && !isExecuting && (
            <button
              onClick={handleCopyOutput}
              className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Copy output"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
          
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md transition-colors text-xs",
              isExecuting 
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Play className="h-3 w-3" />
            Run
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-3 font-mono text-sm bg-editor text-editor-foreground overflow-auto custom-scrollbar">
        {isExecuting ? (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
            <div className="w-3 h-3 bg-primary/50 rounded-full animate-pulse" />
            Executing code...
          </div>
        ) : error ? (
          <pre className="text-destructive whitespace-pre-wrap">{error}</pre>
        ) : output ? (
          <>
            <pre className="whitespace-pre-wrap">{output}</pre>
            {executionTime > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                Execution time: {executionTime.toFixed(2)}ms
              </div>
            )}
          </>
        ) : (
          <div className="text-muted-foreground italic">
            Code execution output will appear here
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionPanel;
