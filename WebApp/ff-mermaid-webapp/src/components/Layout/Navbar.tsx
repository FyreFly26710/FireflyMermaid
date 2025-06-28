import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  History as HistoryIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { History } from '../History';
import { ConfigPanel } from '../UI';
import { useAppStore } from '../../hooks/useAppStore';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'light' 
    ? '0 1px 3px rgba(0, 0, 0, 0.12)' 
    : '0 1px 3px rgba(0, 0, 0, 0.3)',
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: 56,
  padding: '0 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledNavSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const StyledBrandSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

const StyledNavButton = styled(IconButton)(({ theme }) => ({
  padding: 8,
  borderRadius: 8,
  transition: 'all 0.2s ease',
  color: theme.palette.text.primary,
  
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { showConfig, toggleConfig } = useAppStore();

  const handleGitHubClick = () => {
    window.open('https://github.com/FyreFly26710/FireflyMermaid', '_blank');
  };

  const handleHistoryToggle = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleConfigToggle = () => {
    toggleConfig();
  };

  return (
    <>
      <StyledAppBar position="static" className={className}>
        <StyledToolbar>
          <StyledBrandSection>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Firefly Mermaid
            </Typography>
          </StyledBrandSection>

          <StyledNavSection>
            <Tooltip title="View on GitHub">
              <StyledNavButton
                onClick={handleGitHubClick}
                size="small"
                aria-label="GitHub repository"
              >
                <GitHubIcon />
              </StyledNavButton>
            </Tooltip>

            <Tooltip title="History">
              <StyledNavButton
                onClick={handleHistoryToggle}
                size="small"
                className={isHistoryOpen ? 'active' : ''}
                aria-label="Toggle history"
              >
                <HistoryIcon />
              </StyledNavButton>
            </Tooltip>

            <Tooltip title="Configuration">
              <StyledNavButton
                onClick={handleConfigToggle}
                size="small"
                className={showConfig ? 'active' : ''}
                aria-label="Toggle configuration"
              >
                <SettingsIcon />
              </StyledNavButton>
            </Tooltip>
          </StyledNavSection>
        </StyledToolbar>
      </StyledAppBar>

      <History 
        open={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />

      <ConfigPanel
        open={showConfig}
        onClose={() => toggleConfig()}
      />
    </>
  );
}; 