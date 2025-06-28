import React, { useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { useAppStore } from '../hooks/useAppStore';
import { DiagramView } from '../components/View';
import { Editor } from '../components/Editor';
import { Navbar } from '../components/Layout';
import { Actions } from '../components/Actions';

const StyledPanelGroup = styled(PanelGroup)`
  height: 100%;
  width: 100%;
`;

const StyledPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
`;

const StyledResizeHandle = styled(PanelResizeHandle)`
  background-color: #e0e0e0;
  width: 4px;
  margin: 0 4px;
  border-radius: 2px;
  position: relative;
  transition: all 0.2s ease;
  cursor: col-resize;
  
  &:hover {
    background-color: #1976d2;
    width: 6px;
  }
  
  &[data-resize-handle-active] {
    background-color: #1976d2;
    width: 6px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 20px;
    background-color: #666;
    border-radius: 1px;
    opacity: 0.5;
  }
  
  &:hover::after,
  &[data-resize-handle-active]::after {
    opacity: 1;
  }
`;

const StyledMainLayout = styled(Box)`
  height: 100%;
  padding: 8px;
`;

const EditorPage: React.FC = () => {
  const { updateState, code, panelSizes, setPanelSizes } = useAppStore();

  // Initialize with a sample diagram
  useEffect(() => {
    if (!code) {
      updateState({
        code: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Fix it]
    D --> B
    C --> E[End]`,
        mermaid: JSON.stringify({
          theme: 'default',
          themeVariables: {
            primaryColor: '#ff79c6',
            primaryTextColor: '#282a36',
            primaryBorderColor: '#bd93f9',
            lineColor: '#f8f8f2',
            fontFamily: 'Arial'
          }
        })
      });
    }
  }, [code, updateState]);

  const editorPanelSx = {
    height: '100%',
    border: 1,
    borderColor: 'divider',
    borderRadius: '8px 0 0 8px',
    overflow: 'hidden',
    backgroundColor: 'background.paper'
  };

  const viewerPanelSx = {
    height: '100%',
    border: 1,
    borderColor: 'divider',
    borderRadius: '0 8px 8px 0',
    overflow: 'hidden',
    backgroundColor: 'background.paper'
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <StyledMainLayout>
        <StyledPanelGroup 
          direction="horizontal"
          onLayout={(sizes) => setPanelSizes(sizes)}
        >
          {/* Editor Panel */}
          <StyledPanel defaultSize={panelSizes[0]} minSize={30} maxSize={70}>
            <Box sx={editorPanelSx}>
              <Editor />
            </Box>
          </StyledPanel>
          
          {/* Resize Handle */}
          <StyledResizeHandle />
          
          {/* Diagram Panel */}
          <StyledPanel defaultSize={panelSizes[1]} minSize={30} maxSize={70}>
            <Box sx={viewerPanelSx}>
              <Actions />
              <Box sx={{ height: 'calc(100% - 48px)' }}>
                <DiagramView />
              </Box>
            </Box>
          </StyledPanel>
        </StyledPanelGroup>
      </StyledMainLayout>
    </Box>
  );
};

export default EditorPage; 