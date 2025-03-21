
import { useState } from 'react';

interface CodeExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

export const useCodeExecution = () => {
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Using Pyodide for client-side Python execution
  const executeCode = async (code: string) => {
    setIsExecuting(true);
    setResult(null);
    
    try {
      // In a real implementation, we'd load Pyodide here
      // For now, we'll simulate execution with a timeout
      
      const startTime = performance.now();
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple simulation - in reality we'd use Pyodide or a backend service
      let output = "Output would appear here...";
      let error = null;
      
      // Simple error detection simulation
      if (code.includes('SyntaxError') || code.includes('raise Error')) {
        error = "SyntaxError: invalid syntax";
        output = "";
      } else if (code.includes('print(')) {
        // Extract content from print statements
        const printMatches = code.match(/print\((["'])(.*?)\1\)/g);
        if (printMatches) {
          output = printMatches
            .map(match => {
              const content = match.match(/print\((["'])(.*?)\1\)/);
              return content ? content[2] : '';
            })
            .join('\n');
        }
      }
      
      const executionTime = performance.now() - startTime;
      
      setResult({
        output,
        error,
        executionTime
      });
    } catch (err) {
      setResult({
        output: '',
        error: err instanceof Error ? err.message : 'An unknown error occurred',
        executionTime: 0
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executeCode,
    result,
    isExecuting
  };
};
