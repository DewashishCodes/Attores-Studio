
import React, { useState } from 'react';
import { Eye, EyeOff, Key, Save, Trash } from 'lucide-react';

interface ApiKeyFormProps {
  apiKeyExists: boolean;
  onSaveKey: (key: string) => boolean;
  onClearKey: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  apiKeyExists,
  onSaveKey,
  onClearKey
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveKey(apiKey)) {
      setApiKey('');
    }
  };

  return (
    <div className="p-4 rounded-md border border-border bg-card">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <Key className="h-4 w-4 text-primary" />
        Groq API Key
      </h3>

      {apiKeyExists ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Your Groq API key is saved in browser storage.
          </p>
          <button
            onClick={onClearKey}
            className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors mt-1"
          >
            <Trash className="h-3 w-3" />
            Remove API key
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <input 
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-1.5 pr-8 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter your Groq API key here..."
            />
            <button 
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1"
            >
              <Save className="h-3 w-3" />
              Save API Key
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your API key will be stored in your browser's local storage.
            It is only used for making requests to the Groq API.
          </p>
        </form>
      )}
    </div>
  );
};

export default ApiKeyForm;
