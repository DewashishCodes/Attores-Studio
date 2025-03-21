
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Code } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-2">
        <div className="bg-primary rounded-md p-1.5">
          <Code className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight">GroqCraft Studio</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">AI-Powered Code Editor</div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
