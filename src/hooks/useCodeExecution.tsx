
import { useState, useEffect } from 'react';

// Pyodide type definitions
declare global {
  interface Window {
    pyodide: any;
    loadPyodide: (options: { indexURL: string }) => Promise<any>;
  }
}

interface CodeExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

export const useCodeExecution = () => {
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPyodideLoaded, setIsPyodideLoaded] = useState(false);
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);
  const [loadingPyodide, setLoadingPyodide] = useState(false);

  // Load Pyodide when the hook is first used
  useEffect(() => {
    const loadPyodide = async () => {
      if (typeof window === 'undefined' || window.pyodide || loadingPyodide) {
        return;
      }
      
      try {
        setLoadingPyodide(true);
        
        // Load Pyodide script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.async = true;
        script.onload = async () => {
          try {
            console.log('Loading Pyodide environment...');
            const pyodide = await window.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
            });
            
            // Initialize stdout/stderr capture
            await pyodide.runPythonAsync(`
              import sys
              from io import StringIO
              
              class CaptureOutput:
                  def __init__(self):
                      self.stdout = StringIO()
                      self.stderr = StringIO()
                      self.original_stdout = sys.stdout
                      self.original_stderr = sys.stderr
                  
                  def __enter__(self):
                      sys.stdout = self.stdout
                      sys.stderr = self.stderr
                      return self
                  
                  def __exit__(self, exc_type, exc_val, exc_tb):
                      sys.stdout = self.original_stdout
                      sys.stderr = self.original_stderr
                  
                  def get_output(self):
                      return self.stdout.getvalue()
                  
                  def get_error(self):
                      return self.stderr.getvalue()
            `);
            
            setPyodideInstance(pyodide);
            setIsPyodideLoaded(true);
            setLoadingPyodide(false);
            console.log('Pyodide loaded successfully');
          } catch (err) {
            console.error('Error initializing Pyodide:', err);
            setLoadingPyodide(false);
          }
        };
        
        script.onerror = () => {
          console.error('Failed to load Pyodide script');
          setLoadingPyodide(false);
        };
        
        document.body.appendChild(script);
      } catch (err) {
        console.error('Error loading Pyodide:', err);
        setLoadingPyodide(false);
      }
    };
    
    loadPyodide();
  }, []);

  // Execute Python code using Pyodide
  const executeCode = async (code: string) => {
    setIsExecuting(true);
    setResult(null);
    
    // If Pyodide isn't loaded yet, show loading message
    if (!isPyodideLoaded || !pyodideInstance) {
      setTimeout(() => {
        setResult({
          output: 'Setting up Python environment, please wait...',
          error: null,
          executionTime: 0
        });
      }, 100);
      
      // Try to wait for Pyodide to load
      let attempts = 0;
      const maxAttempts = 20;
      
      while (!isPyodideLoaded && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      if (!isPyodideLoaded || !pyodideInstance) {
        setIsExecuting(false);
        setResult({
          output: '',
          error: 'Python environment failed to initialize. Please refresh the page and try again.',
          executionTime: 0
        });
        return;
      }
    }
    
    try {
      const startTime = performance.now();
      
      // Execute the Python code and capture output
      const result = await pyodideInstance.runPythonAsync(`
        with CaptureOutput() as capture:
            try:
                exec(${JSON.stringify(code)})
                stdout_output = capture.get_output()
                stderr_output = capture.get_error()
            except Exception as e:
                stderr_output = str(e)
                stdout_output = ""
        
        [stdout_output, stderr_output]
      `);
      
      const executionTime = performance.now() - startTime;
      
      const [stdout, stderr] = result.toJs();
      
      setResult({
        output: stdout,
        error: stderr || null,
        executionTime
      });
    } catch (err) {
      console.error('Error executing code:', err);
      
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
    isExecuting,
    isPyodideLoaded,
    loadingPyodide
  };
};
