
import { useState } from 'react';
import { toast } from 'sonner';
import { extractCodeFromResponse } from '@/lib/codeParser';

interface GroqResponse {
  fullResponse: string;
  extractedCode: string;
}

interface ApiKeyState {
  key: string;
  isStored: boolean;
}

export const useGroqApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GroqResponse | null>(null);
  const [apiKey, setApiKey] = useState<ApiKeyState>(() => {
    const storedKey = localStorage.getItem('groq_api_key');
    return {
      key: storedKey || '',
      isStored: !!storedKey
    };
  });

  const saveApiKey = (key: string) => {
    if (!key.trim()) {
      toast.error('Please enter a valid API key');
      return false;
    }
    
    localStorage.setItem('groq_api_key', key);
    setApiKey({ key, isStored: true });
    toast.success('API key saved successfully');
    return true;
  };

  const clearApiKey = () => {
    localStorage.removeItem('groq_api_key');
    setApiKey({ key: '', isStored: false });
    toast.success('API key removed');
  };

  const callGroqApi = async (prompt: string, extractCode: boolean = true): Promise<GroqResponse | null> => {
    if (!apiKey.key) {
      toast.error('Groq API key is not set');
      return null;
    }

    setIsLoading(true);
    setResponse(null);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.key}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful coding assistant. When generating code, surround the code with ###CODE_START### and ###CODE_END### tags.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Groq API error:', errorData);
        throw new Error(`API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      const responseContent = data.choices[0].message.content;
      
      // Extract code if requested
      const extractedCode = extractCode ? extractCodeFromResponse(responseContent) : '';
      
      const result = {
        fullResponse: responseContent,
        extractedCode
      };
      
      setResponse(result);
      return result;
      
    } catch (error) {
      console.error('Error calling Groq API:', error);
      toast.error(`Failed to get response from Groq: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callGroqApi,
    isLoading,
    response,
    apiKey: apiKey.isStored,
    saveApiKey,
    clearApiKey
  };
};
