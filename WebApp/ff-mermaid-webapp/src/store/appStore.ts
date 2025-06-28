import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { State, ValidatedState, EditorMode, MarkerData } from '../types';

// Default state matching the Svelte version
const defaultState: State = {
  code: `flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
  `,
  mermaid: JSON.stringify({
    theme: 'default'
  }, null, 2),
  updateDiagram: true,
  rough: false,
  panZoom: true,
  grid: true,
  editorMode: 'code'
};

interface AppState extends State {
  // Additional state properties
  error?: Error;
  errorMarkers: MarkerData[];
  diagramType?: string;
  
  // UI preferences
  panelSizes: number[];
  themeMode: 'light' | 'dark' | 'auto';
  showConfig: boolean;
  
  // Actions
  updateCode: (code: string) => void;
  updateConfig: (mermaid: string) => void;
  updateState: (newState: Partial<State>) => void;
  setError: (error?: Error) => void;
  setErrorMarkers: (errorMarkers: MarkerData[]) => void;
  setDiagramType: (diagramType?: string) => void;
  toggleRough: () => void;
  togglePanZoom: () => void;
  toggleGrid: () => void;
  setEditorMode: (editorMode: EditorMode) => void;
  setPanelSizes: (sizes: number[]) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  toggleConfig: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // State
      ...defaultState,
      error: undefined,
      errorMarkers: [],
      diagramType: undefined,
      
      // UI preferences
      panelSizes: [50, 50],
      themeMode: 'auto',
      showConfig: false,
      
      // Actions
      updateCode: (code: string) => set({ code }),
      updateConfig: (mermaid: string) => set({ mermaid }),
      updateState: (newState: Partial<State>) => set(newState),
      setError: (error?: Error) => set({ error }),
      setErrorMarkers: (errorMarkers: MarkerData[]) => set({ errorMarkers }),
      setDiagramType: (diagramType?: string) => set({ diagramType }),
      toggleRough: () => set((state) => ({ rough: !state.rough })),
      togglePanZoom: () => set((state) => ({ panZoom: !state.panZoom })),
      toggleGrid: () => set((state) => ({ grid: !state.grid })),
      setEditorMode: (editorMode: EditorMode) => set({ editorMode }),
      setPanelSizes: (panelSizes: number[]) => set({ panelSizes }),
      setThemeMode: (themeMode: 'light' | 'dark' | 'auto') => set({ themeMode }),
      toggleConfig: () => set((state) => ({ showConfig: !state.showConfig })),
      
      // Reset to default
      reset: () => set(defaultState)
    }),
    {
      name: 'mermaid-editor-store',
      partialize: (state) => ({
        code: state.code,
        mermaid: state.mermaid,
        rough: state.rough,
        panZoom: state.panZoom,
        grid: state.grid,
        editorMode: state.editorMode,
        panelSizes: state.panelSizes,
        themeMode: state.themeMode,
        showConfig: state.showConfig
      })
    }
  )
); 