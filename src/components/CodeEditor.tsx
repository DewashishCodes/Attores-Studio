
import React, { useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { cn } from '@/lib/utils';

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
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
        }}
        theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs'}
      />
    </div>
  );
};

export default CodeEditor;
