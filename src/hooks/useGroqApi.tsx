
import { useState } from 'react';
import { toast } from 'sonner';
import { extractCodeFromResponse } from '@/lib/codeParser';

interface GroqResponse {
  fullResponse: string;
  extractedCode: string;
}

export const useGroqApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GroqResponse | null>(null);

  const callGroqApi = async (prompt: string, extractCode: boolean = true): Promise<GroqResponse | null> => {
    setIsLoading(true);
    setResponse(null);
    
    try {
      // This is a simulation - in a real app, you'd make an actual API call
      // The API key should be secured in environment variables
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API response based on prompt keywords
      let simulatedResponse = '';
      
      if (prompt.toLowerCase().includes('generate') || prompt.toLowerCase().includes('create')) {
        simulatedResponse = `I'll help you create that code. Here's a solution:

###CODE_START###
def calculate_fibonacci(n):
    """Calculate the Fibonacci sequence up to n numbers."""
    fibonacci = [0, 1]
    if n <= 2:
        return fibonacci[:n]
        
    for i in range(2, n):
        fibonacci.append(fibonacci[i-1] + fibonacci[i-2])
    
    return fibonacci

# Example usage
result = calculate_fibonacci(10)
print(f"Fibonacci sequence: {result}")
###CODE_END###

This function implements an iterative approach to generating the Fibonacci sequence.
It's more memory efficient than the recursive approach for large sequences.`;
      } else if (prompt.toLowerCase().includes('explain') || prompt.toLowerCase().includes('how')) {
        simulatedResponse = `Let me explain how that works.

The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1.

###CODE_START###
# Recursive implementation (less efficient)
def fibonacci_recursive(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib_seq = fibonacci_recursive(n-1)
    fib_seq.append(fib_seq[-1] + fib_seq[-2])
    return fib_seq
###CODE_END###

The recursive approach is elegant but has exponential time complexity for larger values.`;
      } else {
        simulatedResponse = `I see your question about "${prompt}". 

Here's a simple Python implementation that might help:

###CODE_START###
def process_data(data):
    """Process the input data and return results."""
    results = []
    
    for item in data:
        # Simple transformation
        processed = item * 2
        results.append(processed)
    
    return results

# Test with sample data
sample_data = [1, 2, 3, 4, 5]
output = process_data(sample_data)
print(f"Processed data: {output}")
###CODE_END###

This is a basic implementation. Let me know if you need more specific functionality!`;
      }
      
      // Extract code if requested
      const extractedCode = extractCode ? extractCodeFromResponse(simulatedResponse) : '';
      
      setResponse({
        fullResponse: simulatedResponse,
        extractedCode
      });
      
      return {
        fullResponse: simulatedResponse,
        extractedCode
      };
      
    } catch (error) {
      console.error('Error calling Groq API:', error);
      toast.error('Failed to get response from AI');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callGroqApi,
    isLoading,
    response
  };
};
