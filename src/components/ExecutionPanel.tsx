
import React from 'react';
import { cn } from '@/lib/utils';
import { Terminal, Play, Copy, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';

interface ExecutionPanelProps {
  output: string;
  error: string | null;
  executionTime: number;
  isExecuting: boolean;
  isPyodideLoaded?: boolean;
  loadingPyodide?: boolean;
  onExecute: () => void;
  className?: string;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  output,
  error,
  executionTime,
  isExecuting,
  isPyodideLoaded = true,
  loadingPyodide = false,
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
        
        <div className="flex items-center gap-2">
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
            disabled={isExecuting || loadingPyodide}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md transition-colors text-xs",
              (isExecuting || loadingPyodide)
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isExecuting || loadingPyodide ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            {loadingPyodide ? "Loading Python..." : isExecuting ? "Running..." : "Run"}
          </button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 bg-editor">
        <div className="p-3 font-mono text-sm text-editor-foreground">
          {loadingPyodide ? (
            <div className="flex flex-col gap-3 items-center justify-center h-full">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="text-muted-foreground">
                Loading Python environment...
              </div>
              <div className="text-xs text-muted-foreground">
                This may take a few moments on first run
              </div>
            </div>
          ) : isExecuting ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-3 h-3 bg-primary/50 rounded-full animate-pulse" />
              Executing code...
            </div>
          ) : error ? (
            <pre className="text-destructive whitespace-pre-wrap break-all">{error}</pre>
          ) : output ? (
            <>
              <pre className="whitespace-pre-wrap break-words">{output}</pre>
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
      </ScrollArea>
    </div>
  );
};

export default ExecutionPanel;
