import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Svg2Roughjs } from 'svg2roughjs';
import uniqueID from 'lodash-es/uniqueId';
import type { MermaidConfig } from 'mermaid';

import { render as renderDiagram, mayContainFontAwesome } from '../../utils/mermaid';
import { recordRenderTime, shouldRefreshView } from '../../utils/autoSync';
import { logEvent, saveStatistics } from '../../utils/statistics';
import { useAppStore } from '../../hooks/useAppStore';
import type { ValidatedState } from '../../types';

// Styled components for the diagram view
const StyledViewContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showGrid' && prop !== 'hasError'
})<{ showGrid?: boolean; hasError?: boolean }>(({ theme, showGrid, hasError }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  opacity: hasError ? 0.5 : 1,
  ...(showGrid && {
    backgroundSize: '30px 30px',
    backgroundImage: theme.palette.mode === 'dark' 
      ? 'radial-gradient(circle, rgba(70, 70, 70, 0.3) 2px, transparent 2px)'
      : 'radial-gradient(circle, rgba(228, 228, 228, 0.55) 2px, transparent 2px)'
  })
}));

const StyledDiagramContainer = styled(Box)({
  height: '100%',
  width: '100%',
  overflow: 'auto',
  '& svg': {
    height: '100%',
    maxWidth: '100%'
  }
});

interface DiagramViewProps {
  shouldShowGrid?: boolean;
}

export const DiagramView: React.FC<DiagramViewProps> = ({
  shouldShowGrid = true
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  
  const [error, setError] = useState(false);
  const [lastState, setLastState] = useState({
    code: '',
    config: '',
    rough: false
  });

  // Get state from store
  const { 
    code, 
    mermaid: config, 
    rough, 
    error: stateError,
    editorMode,
    errorMarkers,
    updateDiagram,
    updateState 
  } = useAppStore();

  const waitForFontAwesome = useCallback(async () => {
    // Simple font loading wait - can be enhanced with actual FontAwesome component
    return new Promise<void>((resolve) => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => resolve());
      } else {
        setTimeout(resolve, 100);
      }
    });
  }, []);

  const handleStateChange = useCallback(async (state: ValidatedState) => {
    const startTime = Date.now();
    
    if (state.error !== undefined) {
      setError(true);
      return;
    }
    
    setError(false);
    let diagramType: string | undefined;
    
    try {
      if (!containerRef.current) return;

      // Do not render if there is no change in Code/Config
      if (
        lastState.code === state.code &&
        lastState.config === state.mermaid &&
        lastState.rough === state.rough
      ) {
        return;
      }

      if (!shouldRefreshView()) {
        return;
      }

      setLastState({
        code: state.code,
        config: state.mermaid,
        rough: state.rough
      });

      if (mayContainFontAwesome(state.code)) {
        await waitForFontAwesome();
      }

      const scroll = viewRef.current?.parentElement?.scrollTop;
      const container = containerRef.current;
      delete container.dataset.processed;
      
      const viewID = uniqueID('graph-');
      const {
        svg,
        bindFunctions,
        diagramType: detectedDiagramType
      } = await renderDiagram(JSON.parse(state.mermaid) as MermaidConfig, state.code, viewID);
      
      diagramType = detectedDiagramType;
      
      if (svg.length > 0) {
        container.innerHTML = svg;
        let graphDiv = document.querySelector<SVGSVGElement>(`#${viewID}`);
        
        if (!graphDiv) {
          throw new Error('graph-div not found');
        }

        if (state.rough) {
          const svg2roughjs = new Svg2Roughjs(container);
          svg2roughjs.svg = graphDiv;
          await svg2roughjs.sketch();
          graphDiv.remove();
          
          const sketch = container.querySelector<SVGSVGElement>('svg');
          if (!sketch) {
            throw new Error('sketch not found');
          }
          
          const height = sketch.getAttribute('height');
          const width = sketch.getAttribute('width');
          sketch.setAttribute('id', 'graph-div');
          sketch.setAttribute('height', '100%');
          sketch.setAttribute('width', '100%');
          sketch.setAttribute('viewBox', `0 0 ${width} ${height}`);
          sketch.style.maxWidth = '100%';
          graphDiv = sketch;
        } else {
          graphDiv.setAttribute('height', '100%');
          graphDiv.style.maxWidth = '100%';
          if (bindFunctions) {
            bindFunctions(graphDiv);
          }
        }
      }

      if (viewRef.current?.parentElement && scroll) {
        viewRef.current.parentElement.scrollTop = scroll;
      }
      
      setError(false);
    } catch (error_) {
      console.error('view fail', error_);
      setError(true);
    }
    
    const renderTime = Date.now() - startTime;
    saveStatistics({ 
      code: state.code, 
      diagramType, 
      isRough: state.rough, 
      renderTime 
    });
    
    recordRenderTime(renderTime, () => {
      // Trigger re-render if needed
      updateState({ updateDiagram: true });
    });
  }, [lastState, waitForFontAwesome, updateState]);

  // Effect to handle state changes
  useEffect(() => {
    const state: ValidatedState = {
      code,
      mermaid: config,
      rough,
      error: stateError,
      editorMode: editorMode || 'code',
      errorMarkers: errorMarkers || [],
      updateDiagram: updateDiagram || false
    };

    handleStateChange(state).catch(console.error);
  }, [code, config, rough, stateError, editorMode, errorMarkers, updateDiagram, handleStateChange]);

  return (
    <StyledViewContainer 
      showGrid={shouldShowGrid}
      hasError={error}
    >
      <StyledDiagramContainer
        ref={viewRef}
        id="view"
      >
        <div 
          id="container" 
          ref={containerRef}
          style={{ height: '100%', overflow: 'auto' }}
        />
      </StyledDiagramContainer>
    </StyledViewContainer>
  );
}; 