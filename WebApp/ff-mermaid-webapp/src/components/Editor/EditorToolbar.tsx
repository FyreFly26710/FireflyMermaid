import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';

import { useAppStore } from '../../hooks/useAppStore';
import type { EditorMode } from '../../types';

const StyledToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  minHeight: '48px'
}));

interface EditorToolbarProps {
  className?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ className }) => {
  const { editorMode, setEditorMode } = useAppStore();

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: EditorMode | null) => {
    if (newMode) {
      setEditorMode(newMode);
    }
  };

  return (
    <StyledToolbar className={className}>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'medium' }}>
        Editor
      </Typography>
      
      <ToggleButtonGroup
        value={editorMode}
        exclusive
        onChange={handleModeChange}
        size="small"
        aria-label="editor mode"
      >
        <ToggleButton value="code" aria-label="mermaid code">
          <CodeIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Code
        </ToggleButton>
        <ToggleButton value="config" aria-label="configuration">
          <SettingsIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Config
        </ToggleButton>
      </ToggleButtonGroup>
    </StyledToolbar>
  );
}; 