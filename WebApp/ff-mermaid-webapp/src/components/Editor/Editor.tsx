import React from 'react';
import { Box, Alert, AlertTitle, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { MonacoEditor } from './MonacoEditor';
import { EditorToolbar } from './EditorToolbar';
import { useAppStore } from '../../hooks/useAppStore';

const StyledErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  fontSize: theme.typography.body2.fontSize,
  borderTop: `1px solid ${theme.palette.divider}`
}));

const StyledErrorHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const StyledErrorContent = styled(Box)(({ theme }) => ({
  maxHeight: '128px',
  overflow: 'auto',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  '& pre': {
    margin: 0,
    fontFamily: '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
    fontSize: '0.875rem',
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    color: theme.palette.text.primary
  }
}));

interface EditorProps {
  className?: string;
}

export const Editor: React.FC<EditorProps> = ({ className }) => {
  const { 
    editorMode, 
    error, 
    updateCode, 
    updateConfig 
  } = useAppStore();

  const handleUpdate = (text: string) => {
    if (editorMode === 'code') {
      updateCode(text);
    } else {
      updateConfig(text);
    }
  };

  return (
    <Box 
      className={className}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* Editor Toolbar */}
      <EditorToolbar />
      
      {/* Monaco Editor */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <MonacoEditor onUpdate={handleUpdate} />
      </Box>

      {/* Error Display */}
      {error && (
        <StyledErrorContainer data-testid="error-container">
          <StyledErrorHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorOutlineIcon 
                sx={{ 
                  color: 'error.main',
                  fontSize: '1.5rem'
                }} 
              />
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Syntax Error
              </Typography>
            </Box>
          </StyledErrorHeader>
          
          <StyledErrorContent>
            <pre>{error.toString()}</pre>
          </StyledErrorContent>
        </StyledErrorContainer>
      )}
    </Box>
  );
}; 