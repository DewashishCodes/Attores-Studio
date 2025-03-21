
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Code } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <header className={cn(
      "h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6",
      theme === 'futuristic' && "border-primary/20"
    )}>
      <div className="flex items-center space-x-2">
        <div className={cn(
          "bg-primary rounded-md p-1.5",
          theme === 'futuristic' && "animate-cyber-glow"
        )}>
          <Code className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className={cn(
          "text-lg font-semibold tracking-tight",
          theme === 'futuristic' && "cyber-highlight"
        )}>
          GroqCraft Studio
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          {theme === 'light' ? 'Light Mode' : theme === 'dark' ? 'Dark Mode' : 'Futuristic Mode'}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
