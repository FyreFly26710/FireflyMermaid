import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import styled from 'styled-components';
import { useHistoryStore } from '../../store/historyStore';
import { useAppStore } from '../../hooks/useAppStore';
import type { HistoryEntry, HistoryType } from '../../types';

const StyledHistoryDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: 600px;
    max-width: 90vw;
    height: 500px;
  }
`;

const StyledHistoryItem = styled(ListItem)`
  && {
    border-bottom: 1px solid #e0e0e0;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    [data-theme="dark"] & {
      border-bottom-color: #3a3a3a;
      
      &:hover {
        background-color: #2a2a2a;
      }
    }
  }
`;

const StyledModeSelect = styled(FormControl)`
  && {
    min-width: 120px;
    margin-bottom: 16px;
  }
`;

interface HistoryProps {
  open: boolean;
  onClose: () => void;
}

export const History: React.FC<HistoryProps> = ({ open, onClose }) => {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  
  const {
    historyMode,
    currentHistory,
    setHistoryMode,
    clearHistoryData,
    restoreHistory
  } = useHistoryStore();
  
  const { updateState } = useAppStore();

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  const handleLoadEntry = useCallback((entry: HistoryEntry) => {
    updateState(entry.state);
    onClose();
  }, [updateState, onClose]);

  const handleDeleteEntry = useCallback((id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    clearHistoryData(id);
  }, [clearHistoryData]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all history entries?')) {
      clearHistoryData();
    }
  }, [clearHistoryData]);

  const handleExportHistory = useCallback(() => {
    const dataStr = JSON.stringify(currentHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mermaid-history-${historyMode}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentHistory, historyMode]);

  const handleImportHistory = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            restoreHistory(data);
          } catch (error) {
            alert('Failed to parse history file');
            console.error('History import error:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [restoreHistory]);

  const getEntryDisplayName = useCallback((entry: HistoryEntry) => {
    if (entry.name) return entry.name;
    if (entry.type === 'loader') return 'Loaded Diagram';
    return `Diagram ${entry.id.slice(0, 8)}`;
  }, []);

  const getTypeLabel = useCallback((type: HistoryType) => {
    switch (type) {
      case 'auto': return 'Auto';
      case 'manual': return 'Manual';
      case 'loader': return 'Loaded';
      default: return type;
    }
  }, []);

  return (
    <StyledHistoryDialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <HistoryIcon />
          <Typography variant="h6">History</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <StyledModeSelect>
            <Select
              value={historyMode}
              onChange={(e) => setHistoryMode(e.target.value as HistoryType)}
              displayEmpty
            >
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
              <MenuItem value="loader">Loaded</MenuItem>
            </Select>
          </StyledModeSelect>
          
          <Box display="flex" gap={1}>
            <Button
              startIcon={<UploadIcon />}
              onClick={handleImportHistory}
              size="small"
            >
              Import
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleExportHistory}
              size="small"
              disabled={currentHistory.length === 0}
            >
              Export
            </Button>
            <Button
              startIcon={<ClearIcon />}
              onClick={handleClearAll}
              color="error"
              size="small"
              disabled={currentHistory.length === 0}
            >
              Clear All
            </Button>
          </Box>
        </Box>

        <Divider />

        {currentHistory.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography color="textSecondary">
              No {getTypeLabel(historyMode).toLowerCase()} history entries found
            </Typography>
          </Box>
        ) : (
          <List>
            {currentHistory.map((entry) => (
              <StyledHistoryItem key={entry.id}>
                <ListItemButton
                  onClick={() => handleLoadEntry(entry)}
                  selected={selectedEntry === entry.id}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1">
                          {getEntryDisplayName(entry)}
                        </Typography>
                        <Chip 
                          label={getTypeLabel(entry.type as HistoryType)} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(entry.time)}
                        </Typography>
                        {entry.url && (
                          <Typography variant="caption" display="block" color="textSecondary">
                            Source: {entry.url}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => handleDeleteEntry(entry.id, e)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </StyledHistoryItem>
            ))}
          </List>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </StyledHistoryDialog>
  );
}; 