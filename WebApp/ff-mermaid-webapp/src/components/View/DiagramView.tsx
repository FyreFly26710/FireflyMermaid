import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import uniqueID from 'lodash-es/uniqueId';
import type { MermaidConfig } from 'mermaid';

import { render as renderDiagram } from '../../utils/mermaid';
import { useAppStore } from '../../hooks/useAppStore';

interface DiagramViewProps {
  shouldShowGrid?: boolean;
}

export const DiagramView: React.FC<DiagramViewProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { code, mermaid: config } = useAppStore();

  useEffect(() => {
    const renderDiagramSimple = async () => {
      if (!containerRef.current || !code) return;

      try {
        const container = containerRef.current;
        const viewID = uniqueID('graph-');
        
        const { svg } = await renderDiagram(
          JSON.parse(config) as MermaidConfig, 
          code, 
          viewID
        );
        
        if (svg.length > 0) {
          container.innerHTML = svg;
        }
      } catch (error) {
        console.error('Render error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error}</div>`;
        }
      }
    };

    renderDiagramSimple();
  }, [code, config]);

  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <div 
        id="container" 
        ref={containerRef}
        style={{ height: '100%', overflow: 'auto' }}
      />
    </Box>
  );
}; 