
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'futuristic' : 'light'} theme`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 transition-all dark:scale-0 futuristic:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all dark:scale-100 futuristic:scale-0" />
      <Zap className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all futuristic:scale-100" />
    </button>
  );
};

export default ThemeToggle;
