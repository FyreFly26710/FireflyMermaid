import React, { useEffect } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { useAppStore } from '../hooks/useAppStore';
import { DiagramView } from '../components/View';
import { Editor } from '../components/Editor';
import { Navbar } from '../components/Layout';

const EditorPage: React.FC = () => {
  const { updateState, code } = useAppStore();

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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ flex: 1, py: 2 }}>
        <Box sx={{ height: '100%' }}>
          <Grid container spacing={1} sx={{ height: '100%' }}>
            {/* Editor Panel */}
            <Grid item xs={12} md={6} sx={{ height: '100%' }}>
              <Box sx={{ 
                height: '100%', 
                border: 1, 
                borderColor: 'divider', 
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <Editor />
              </Box>
            </Grid>
            
            {/* Diagram Panel */}
            <Grid item xs={12} md={6} sx={{ height: '100%' }}>
              <Box sx={{ 
                height: '100%', 
                border: 1, 
                borderColor: 'divider', 
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <DiagramView />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default EditorPage; 