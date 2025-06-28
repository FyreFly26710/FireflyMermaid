import { useAppStore as useStore } from '../store/appStore';
import { EditorMode, MarkerData } from '../types';

// Custom hook with commonly used selectors
export const useAppStore = () => {
  const store = useStore();
  return store;
};

// Selector hooks for specific state slices
export const useEditorState = () => useStore((state) => ({
  code: state.code,
  mermaid: state.mermaid,
  editorMode: state.editorMode,
  updateCode: state.updateCode,
  updateConfig: state.updateConfig,
  setEditorMode: state.setEditorMode
}));

export const useViewState = () => useStore((state) => ({
  rough: state.rough,
  panZoom: state.panZoom,
  grid: state.grid,
  error: state.error,
  errorMarkers: state.errorMarkers,
  diagramType: state.diagramType,
  toggleRough: state.toggleRough,
  togglePanZoom: state.togglePanZoom,
  toggleGrid: state.toggleGrid
}));

export const useErrorState = () => useStore((state) => ({
  error: state.error,
  errorMarkers: state.errorMarkers,
  setError: state.setError,
  setErrorMarkers: state.setErrorMarkers
})); 