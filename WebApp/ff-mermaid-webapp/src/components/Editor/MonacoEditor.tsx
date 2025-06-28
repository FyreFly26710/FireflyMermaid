import React, { useEffect, useRef, useCallback } from 'react';
import Editor, { OnMount, OnChange, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import { initMermaidLanguage } from '../../utils/monacoMermaidLanguage';
import { useAppStore } from '../../hooks/useAppStore';
import type { EditorMode } from '../../types';

interface MonacoEditorProps {
  onUpdate: (text: string) => void;
}

// Configure Monaco loader
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs'
  }
});

export const MonacoEditor: React.FC<MonacoEditorProps> = ({ onUpdate }) => {
  const theme = useTheme();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const currentTextRef = useRef<string>('');
  
  const { 
    code, 
    mermaid: config, 
    editorMode 
  } = useAppStore();

  // Initialize Monaco and create models
  const handleEditorDidMount: OnMount = useCallback((editor, monacoInstance) => {
    editorRef.current = editor;

    // Initialize mermaid language support
    initMermaidLanguage(monacoInstance);

    // Set initial theme
    monacoInstance.editor.setTheme(theme.palette.mode === 'dark' ? 'mermaid-dark' : 'mermaid');

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      editor.layout();
    });
    
    const editorElement = editor.getDomNode();
    if (editorElement?.parentElement) {
      resizeObserver.observe(editorElement.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [theme.palette.mode]);

  // Handle content changes
  const handleEditorChange: OnChange = useCallback((value) => {
    if (!value || value === currentTextRef.current) {
      return;
    }
    
    currentTextRef.current = value;
    onUpdate(value);
  }, [onUpdate]);

  // Update editor content when editorMode changes
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const newText = editorMode === 'code' ? code : config;
    if (newText !== currentTextRef.current) {
      currentTextRef.current = newText;
    }
  }, [code, config, editorMode]);

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setTheme(theme.palette.mode === 'dark' ? 'mermaid-dark' : 'mermaid');
    }
  }, [theme.palette.mode]);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Editor
        height="100%"
        language={editorMode === 'code' ? 'mermaid' : 'json'}
        value={editorMode === 'code' ? code : config}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          minimap: { enabled: false },
          overviewRulerLanes: 0,
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineHeight: 20,
          fontFamily: '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
          wordWrap: 'on',
          automaticLayout: true,
          contextmenu: true,
          folding: true,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          tabSize: 2,
          insertSpaces: true
        }}
        loading={
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'text.secondary'
            }}
          >
            Loading editor...
          </Box>
        }
      />
    </Box>
  );
}; 