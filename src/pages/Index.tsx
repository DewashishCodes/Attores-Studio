
import React, { useState } from 'react';
import Header from '@/components/Header';
import ResizablePanels from '@/components/ResizablePanels';
import PromptSection from '@/components/PromptSection';
import OutputSection from '@/components/OutputSection';
import ExecutionPanel from '@/components/ExecutionPanel';
import ChatInterface from '@/components/ChatInterface';
import { useGroqApi } from '@/hooks/useGroqApi';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

// Monaco Editor needs to be dynamically imported with React.lazy
const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

const Index = () => {
  const { callGroqApi, isLoading, response } = useGroqApi();
  const { executeCode, result, isExecuting } = useCodeExecution();
  const [currentCode, setCurrentCode] = useState<string>('');
  const isMobile = useIsMobile();

  const handlePromptSubmit = async (prompt: string) => {
    try {
      const res = await callGroqApi(prompt);
      if (res?.extractedCode) {
        setCurrentCode(res.extractedCode);
      }
    } catch (error) {
      console.error('Error submitting prompt:', error);
      toast.error('Failed to process your prompt');
    }
  };

  const handleExecuteCode = () => {
    if (!currentCode.trim()) {
      toast.error('No code to execute');
      return;
    }
    
    executeCode(currentCode);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-hidden">
          {isMobile ? (
            // Mobile layout - stacked
            <div className="h-full flex flex-col">
              <div className="h-1/3 border-b border-border">
                <PromptSection 
                  onSubmit={handlePromptSubmit} 
                  isLoading={isLoading} 
                />
              </div>
              
              <div className="h-1/3 border-b border-border">
                <OutputSection
                  fullResponse={response?.fullResponse || ''}
                  extractedCode={response?.extractedCode || currentCode}
                  isLoading={isLoading}
                  onCodeChange={setCurrentCode}
                />
              </div>
              
              <ResizablePanels
                direction="horizontal"
                className="h-1/3"
                initialSizes={[50, 50]}
              >
                <ExecutionPanel
                  output={result?.output || ''}
                  error={result?.error || null}
                  executionTime={result?.executionTime || 0}
                  isExecuting={isExecuting}
                  onExecute={handleExecuteCode}
                />
                <ChatInterface />
              </ResizablePanels>
            </div>
          ) : (
            // Desktop layout - 3 columns
            <ResizablePanels
              direction="horizontal"
              className="h-full"
              initialSizes={[20, 50, 30]}
              minSizes={[15, 30, 20]}
            >
              {/* Left column */}
              <ResizablePanels
                direction="vertical"
                initialSizes={[60, 40]}
                minSizes={[30, 20]}
              >
                <PromptSection 
                  onSubmit={handlePromptSubmit} 
                  isLoading={isLoading} 
                />
                <ExecutionPanel
                  output={result?.output || ''}
                  error={result?.error || null}
                  executionTime={result?.executionTime || 0}
                  isExecuting={isExecuting}
                  onExecute={handleExecuteCode}
                />
              </ResizablePanels>
              
              {/* Middle column - Code Editor */}
              <React.Suspense fallback={<div className="h-full flex items-center justify-center">Loading editor...</div>}>
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <h2 className="text-sm font-medium">Code Editor</h2>
                    <div className="text-xs text-muted-foreground">
                      Press Ctrl+Space for suggestions
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <MonacoEditor
                      height="100%"
                      language="python"
                      value={currentCode}
                      onChange={(value) => setCurrentCode(value || '')}
                      options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        lineHeight: 1.5,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>
              </React.Suspense>
              
              {/* Right column */}
              <ResizablePanels
                direction="vertical"
                initialSizes={[60, 40]}
                minSizes={[30, 20]}
              >
                <OutputSection
                  fullResponse={response?.fullResponse || ''}
                  extractedCode={response?.extractedCode || ''}
                  isLoading={isLoading}
                  onCodeChange={setCurrentCode}
                />
                <ChatInterface />
              </ResizablePanels>
            </ResizablePanels>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
