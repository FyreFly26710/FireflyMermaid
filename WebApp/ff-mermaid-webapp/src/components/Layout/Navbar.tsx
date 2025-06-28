import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Tooltip,
  Typography
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  History as HistoryIcon,
  Share as ShareIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import styled from 'styled-components';
import { History } from '../History';

const StyledAppBar = styled(AppBar)`
  && {
    background-color: #ffffff;
    color: #000000;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    
    [data-theme="dark"] & {
      background-color: #1e1e1e;
      color: #ffffff;
      border-bottom-color: #3a3a3a;
    }
  }
`;

const StyledToolbar = styled(Toolbar)`
  && {
    min-height: 56px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const StyledNavSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledBrandSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledNavButton = styled(IconButton)`
  && {
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
    
    &.active {
      background-color: #1976d2;
      color: #ffffff;
      
      &:hover {
        background-color: #1565c0;
      }
    }
    
    [data-theme="dark"] & {
      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }
  }
`;

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleGitHubClick = () => {
    window.open('https://github.com/FyreFly26710/FireflyMermaid', '_blank');
  };

  const handleHistoryToggle = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleShareClick = () => {
    // Placeholder - will implement sharing functionality later
    console.log('Share clicked - placeholder');
  };

  const handleDownloadClick = () => {
    // Placeholder - will implement download functionality later
    console.log('Download clicked - placeholder');
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

            <Tooltip title="Share (Coming soon)">
              <StyledNavButton
                onClick={handleShareClick}
                size="small"
                aria-label="Share diagram"
              >
                <ShareIcon />
              </StyledNavButton>
            </Tooltip>

            <Tooltip title="Download (Coming soon)">
              <StyledNavButton
                onClick={handleDownloadClick}
                size="small"
                aria-label="Download diagram"
              >
                <DownloadIcon />
              </StyledNavButton>
            </Tooltip>
          </StyledNavSection>
        </StyledToolbar>
      </StyledAppBar>

      <History 
        open={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </>
  );
}; 