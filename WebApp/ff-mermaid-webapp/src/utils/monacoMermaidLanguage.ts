import type * as Monaco from 'monaco-editor';

// Simplified version of the mermaid language definition
// Based on the original monacoExtra.ts but streamlined for our needs

const commentRegex = /(?<!["'])%%(?![^"']*["']\)).*$/;

export const initMermaidLanguage = (monaco: typeof Monaco): void => {
  monaco.languages.register({ id: 'mermaid' });

  // Basic keywords for mermaid syntax highlighting
  const keywords = [
    // Common
    'title', 'accDescription', 'direction', 'TB', 'BT', 'RL', 'LR',
    
    // Flowchart
    'flowchart', 'graph', 'subgraph', 'end', 'click', 'call', 'href',
    'linkStyle', 'style', 'classDef', 'class',
    
    // Sequence
    'sequenceDiagram', 'participant', 'as', 'Note', 'note', 'activate', 'deactivate',
    'loop', 'alt', 'else', 'opt', 'par', 'and', 'rect',
    
    // Class
    'classDiagram', 'classDiagram-v2',
    
    // State
    'stateDiagram', 'stateDiagram-v2', 'state',
    
    // Gantt
    'gantt', 'dateFormat', 'axisFormat', 'section', 'excludes',
    
    // Pie
    'pie', 'showData',
    
    // Git Graph
    'gitGraph', 'commit', 'branch', 'merge', 'checkout',
    
    // Journey
    'journey',
    
    // ER
    'erDiagram',
    
    // C4
    'C4Context', 'C4Container', 'C4Component', 'Person', 'System', 'Container',
    
    // Others
    'mindmap', 'timeline', 'requirement', 'info'
  ];

  const blockKeywords = [
    'subgraph', 'end', 'class', 'loop', 'alt', 'else', 'opt', 'par', 'and', 'rect',
    'section', 'Boundary', 'state'
  ];

  monaco.languages.setMonarchTokensProvider('mermaid', {
    keywords,
    blockKeywords,
    typeKeywords: [
      'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 'classDiagram-v2',
      'stateDiagram', 'stateDiagram-v2', 'gantt', 'pie', 'gitGraph', 'journey',
      'erDiagram', 'C4Context', 'C4Container', 'C4Component', 'mindmap', 'timeline',
      'requirement', 'info'
    ],
    
    tokenizer: {
      root: [
        [commentRegex, 'comment'],
        [/[a-z_$][\w$]*/, {
          cases: {
            '@typeKeywords': 'type.identifier',
            '@blockKeywords': 'keyword.control',
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        [/\d+/, 'number'],
        [/[{}()\[\]]/, '@brackets'],
        [/[<>]/, 'delimiter.angle'],
        [/[;,.]/, 'delimiter'],
        [/-->|->|<->|<-->/, 'keyword.operator'],
        [/[=!<>]+/, 'operator'],
        [/\s+/, 'white']
      ]
    }
  });

  // Set up language configuration
  monaco.languages.setLanguageConfiguration('mermaid', {
    comments: {
      lineComment: '%%'
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  });

  // Define themes
  monaco.editor.defineTheme('mermaid', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a9955' },
      { token: 'keyword', foreground: '0000ff' },
      { token: 'keyword.control', foreground: 'af00db' },
      { token: 'type.identifier', foreground: '267f99' },
      { token: 'string', foreground: 'a31515' },
      { token: 'number', foreground: '098658' },
      { token: 'keyword.operator', foreground: 'ff6600' }
    ],
    colors: {
      'editor.background': '#ffffff'
    }
  });

  monaco.editor.defineTheme('mermaid-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'keyword', foreground: '569CD6' },
      { token: 'keyword.control', foreground: 'C586C0' },
      { token: 'type.identifier', foreground: '4EC9B0' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'keyword.operator', foreground: 'FF8C00' }
    ],
    colors: {
      'editor.background': '#1e1e1e'
    }
  });
}; 