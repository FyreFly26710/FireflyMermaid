import React, { useState, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Alert,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  GridOn as GridIcon,
  ZoomIn as PanZoomIcon,
  Brush as RoughIcon
} from '@mui/icons-material';
import styled from 'styled-components';
import { useAppStore } from '../../hooks/useAppStore';
import { logEvent } from '../../utils/statistics';

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 400px;
    padding: 0;
  }
`;

const StyledDrawerHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  
  [data-theme="dark"] & {
    border-bottom-color: #3a3a3a;
  }
`;

const StyledDrawerContent = styled(Box)`
  padding: 16px;
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const StyledSectionHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const StyledConfigSection = styled(Box)`
  margin-bottom: 24px;
`;

const themes = [
  { value: 'default', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'forest', label: 'Forest' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'base', label: 'Base' }
];

const exportFormats = [
  { value: 'svg', label: 'SVG', description: 'Vector graphics' },
  { value: 'png', label: 'PNG', description: 'Raster image' },
  { value: 'pdf', label: 'PDF', description: 'Coming soon', disabled: true }
];

interface ConfigPanelProps {
  open: boolean;
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ open, onClose }) => {
  const {
    mermaid,
    rough,
    panZoom,
    grid,
    themeMode,
    updateConfig,
    toggleRough,
    togglePanZoom,
    toggleGrid,
    setThemeMode
  } = useAppStore();

  const [configJson, setConfigJson] = useState(mermaid);
  const [configError, setConfigError] = useState<string | null>(null);
  const [selectedExportFormat, setSelectedExportFormat] = useState('svg');

  const handleConfigChange = useCallback((value: string) => {
    setConfigJson(value);
    try {
      JSON.parse(value);
      setConfigError(null);
    } catch (error) {
      setConfigError('Invalid JSON configuration');
    }
  }, []);

  const handleConfigApply = useCallback(() => {
    try {
      JSON.parse(configJson);
      updateConfig(configJson);
      setConfigError(null);
      logEvent('config_applied');
    } catch (error) {
      setConfigError('Invalid JSON configuration');
    }
  }, [configJson, updateConfig]);

  const handleConfigReset = useCallback(() => {
    const defaultConfig = JSON.stringify({ theme: 'default' }, null, 2);
    setConfigJson(defaultConfig);
    updateConfig(defaultConfig);
    setConfigError(null);
    logEvent('config_reset');
  }, [updateConfig]);

  const handleThemeChange = useCallback((theme: string) => {
    try {
      const config = JSON.parse(configJson);
      config.theme = theme;
      const newConfig = JSON.stringify(config, null, 2);
      setConfigJson(newConfig);
      updateConfig(newConfig);
      logEvent('theme_changed', { theme });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  }, [configJson, updateConfig]);

  const getCurrentTheme = useCallback(() => {
    try {
      const config = JSON.parse(configJson);
      return config.theme || 'default';
    } catch {
      return 'default';
    }
  }, [configJson]);

  const handleDownload = useCallback(() => {
    // This would trigger the download based on selected format
    logEvent('config_download_triggered', { format: selectedExportFormat });
    // Integration with download functionality from Actions component
  }, [selectedExportFormat]);

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
    >
      <StyledDrawerHeader>
        <Typography variant="h6" component="div">
          Configuration
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </StyledDrawerHeader>

      <StyledDrawerContent>
        {/* Theme Section */}
        <StyledConfigSection>
          <StyledSectionHeader>
            <PaletteIcon color="primary" />
            <Typography variant="h6">Theme</Typography>
          </StyledSectionHeader>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Application Theme</InputLabel>
            <Select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark' | 'auto')}
              label="Application Theme"
            >
              <MenuItem value="auto">Auto (System)</MenuItem>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Mermaid Theme</InputLabel>
            <Select
              value={getCurrentTheme()}
              onChange={(e) => handleThemeChange(e.target.value)}
              label="Mermaid Theme"
            >
              {themes.map((theme) => (
                <MenuItem key={theme.value} value={theme.value}>
                  {theme.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </StyledConfigSection>

        <Divider />

        {/* Diagram Options */}
        <StyledConfigSection>
          <StyledSectionHeader>
            <SettingsIcon color="primary" />
            <Typography variant="h6">Diagram Options</Typography>
          </StyledSectionHeader>

          <FormControlLabel
            control={
              <Switch
                checked={rough}
                onChange={toggleRough}
                icon={<RoughIcon />}
                checkedIcon={<RoughIcon />}
              />
            }
            label={
              <Box>
                <Typography>Rough Sketch Style</Typography>
                <Typography variant="caption" color="textSecondary">
                  Hand-drawn appearance
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={panZoom}
                onChange={togglePanZoom}
                icon={<PanZoomIcon />}
                checkedIcon={<PanZoomIcon />}
              />
            }
            label={
              <Box>
                <Typography>Pan & Zoom</Typography>
                <Typography variant="caption" color="textSecondary">
                  Interactive diagram navigation
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={grid}
                onChange={toggleGrid}
                icon={<GridIcon />}
                checkedIcon={<GridIcon />}
              />
            }
            label={
              <Box>
                <Typography>Grid Background</Typography>
                <Typography variant="caption" color="textSecondary">
                  Show grid pattern
                </Typography>
              </Box>
            }
          />
        </StyledConfigSection>

        <Divider />

        {/* Advanced Configuration */}
        <StyledConfigSection>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Advanced Configuration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Edit the raw Mermaid configuration JSON. This allows fine-tuning of 
                  theme variables, colors, and advanced diagram settings.
                </Typography>
                
                {configError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {configError}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={configJson}
                  onChange={(e) => handleConfigChange(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{
                    fontFamily: 'monospace',
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }
                  }}
                />

                <Box display="flex" gap={1} mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleConfigApply}
                    disabled={!!configError}
                    size="small"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleConfigReset}
                    size="small"
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </StyledConfigSection>

        <Divider />

        {/* Export Options */}
        <StyledConfigSection>
          <StyledSectionHeader>
            <DownloadIcon color="primary" />
            <Typography variant="h6">Export Options</Typography>
          </StyledSectionHeader>

          <FormControl fullWidth margin="normal">
            <InputLabel>Export Format</InputLabel>
            <Select
              value={selectedExportFormat}
              onChange={(e) => setSelectedExportFormat(e.target.value)}
              label="Export Format"
            >
              {exportFormats.map((format) => (
                <MenuItem 
                  key={format.value} 
                  value={format.value}
                  disabled={format.disabled}
                >
                  <Box>
                    <Typography>{format.label}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {format.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            fullWidth
            sx={{ mt: 2 }}
          >
            Download {selectedExportFormat.toUpperCase()}
          </Button>
        </StyledConfigSection>
      </StyledDrawerContent>
    </StyledDrawer>
  );
}; 