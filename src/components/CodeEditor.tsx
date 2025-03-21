/* 
import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  className,
  readOnly = false,
  height = '100%'
}) => {
  const editorRef = useRef<any>(null);
  const { theme: appTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState('vs');

  useEffect(() => {
    if (appTheme === 'dark') {
      setEditorTheme('vs-dark');
    } else if (appTheme === 'futuristic') {
      setEditorTheme('hc-black');
    } else {
      setEditorTheme('vs');
    }
  }, [appTheme]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Set up Ctrl+Space for suggestions
    editor.addCommand(
      // Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Space, 
      2048 | 44, // Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Space
      () => {
        editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
      }
    );
  };

  return (
    <div className={cn('w-full h-full rounded-md overflow-hidden', className)}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme={editorTheme}
        options={{
          minimap: { enabled: true, scale: 0.75 },
          fontSize: 14,
          lineHeight: 1.5,
          tabSize: 4,
          scrollBeyondLastLine: false,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false,
          },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          wordWrap: 'on',
          wrappingIndent: 'same',
          bracketPairColorization: { enabled: true },
          renderLineHighlight: 'all',
          readOnly,
          automaticLayout: true,
          padding: { top: 12 },
          lineNumbers: "on",
          folding: true,
          glyphMargin: false,
          contextmenu: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
 */

import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  className,
  readOnly = false,
  height = '100%'
}) => {
  const editorRef = useRef<any>(null);
  const { theme: appTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState('vs');

  useEffect(() => {
    if (appTheme === 'dark') {
      setEditorTheme('vs-dark');
    } else if (appTheme === 'futuristic') {
      setEditorTheme('hc-black');
    } else {
      setEditorTheme('vs');
    }
  }, [appTheme]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Optional: Keep Ctrl+Space for manual trigger if desired
    editor.addCommand(
      2048 | 44, // Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Space
      () => {
        editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
      }
    );
  };

  return (
    <div className={cn('w-full h-full rounded-md overflow-hidden', className)}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme={editorTheme}
        options={{
          minimap: { enabled: true, scale: 0.75 },
          fontSize: 14,
          lineHeight: 1.5,
          tabSize: 4,
          scrollBeyondLastLine: false,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false,
          },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          wordWrap: 'on',
          wrappingIndent: 'same',
          bracketPairColorization: { enabled: true },
          renderLineHighlight: 'all',
          readOnly,
          automaticLayout: true,
          padding: { top: 12 },
          lineNumbers: 'on',
          folding: true,
          glyphMargin: false,
          contextmenu: true,
          // Enable automatic suggestions as you type
          quickSuggestions: {
            other: true,    // Suggestions for general code
            comments: false, // Disable in comments (optional)
            strings: false,  // Disable in strings (optional)
          },
          quickSuggestionsDelay: 100, // Delay in ms before suggestions appear (adjust as needed)
          suggestOnTriggerCharacters: true, // Trigger on special characters (e.g., '.' for Python)
          acceptSuggestionOnEnter: 'on', // Accept suggestion with Enter key
          suggest: {
            // Additional suggestion settings
            snippetsPreventQuickSuggestions: false, // Allow snippets in suggestions
            localityBonus: true, // Prioritize suggestions based on proximity
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;