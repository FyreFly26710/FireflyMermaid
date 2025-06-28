export interface MarkerData {
  severity: number;
  message: string;
  source?: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface State {
  code: string;
  mermaid: string;
  updateDiagram: boolean;
  rough: boolean;
  panZoom?: boolean;
  grid?: boolean;
  editorMode?: EditorMode;
  pan?: { x: number; y: number };
  zoom?: number;
}

export interface ValidatedState extends State {
  editorMode: EditorMode;
  diagramType?: string;
  error?: Error;
  errorMarkers: MarkerData[];
  serialized?: string;
}

export type EditorMode = 'code' | 'config';

export interface Tab {
  id: string;
  title: string;
  icon?: React.ComponentType;
}

export interface PanZoomState {
  x: number;
  y: number;
  zoom: number;
}

export interface LoadingState {
  loading: boolean;
  message?: string;
}

export interface ErrorHash {
  loc: {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: number;
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface StatisticsData {
  code: string;
  diagramType?: string;
  isRough: boolean;
  renderTime: number;
}

export type HistoryType = 'auto' | 'manual' | 'loader';

export type HistoryEntry = { 
  id: string; 
  state: State; 
  time: number; 
  url?: string 
} & (
  | {
      type: 'loader';
      name: string;
    }
  | {
      type: HistoryType;
      name?: string;
    }
);

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>; 