// Editor modes
export const EDITOR_MODES = {
  CODE: 'code',
  CONFIG: 'config'
} as const;

// Default mermaid configuration
export const DEFAULT_MERMAID_CONFIG = {
  theme: 'default'
} as const;

// Default code for new diagrams
export const DEFAULT_CODE = `flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]
  `;

// Event names for analytics
export const EVENTS = {
  MOBILE_VIEW_TOGGLE: 'mobileViewToggle',
  PAN_ZOOM: 'panZoom',
  DIAGRAM_RENDER: 'diagramRender',
  CODE_UPDATE: 'codeUpdate',
  CONFIG_UPDATE: 'configUpdate'
} as const;

// Error severities (matching Monaco Editor)
export const ERROR_SEVERITY = {
  ERROR: 8,
  WARNING: 4,
  INFO: 2,
  HINT: 1
} as const;

// Type exports for better type safety
export type EditorMode = typeof EDITOR_MODES[keyof typeof EDITOR_MODES];
export type EventName = typeof EVENTS[keyof typeof EVENTS];
export type ErrorSeverity = typeof ERROR_SEVERITY[keyof typeof ERROR_SEVERITY]; 