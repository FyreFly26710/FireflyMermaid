import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Share as ShareIcon,
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Link as LinkIcon,
  Description as SvgIcon,
  Apps as SampleIcon
} from '@mui/icons-material';
import styled from 'styled-components';
import { useAppStore } from '../../hooks/useAppStore';
import { serializeState } from '../../utils/serialization';
import { logEvent } from '../../utils/statistics';

const StyledActionsContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  
  [data-theme="dark"] & {
    border-bottom-color: #3a3a3a;
    background-color: #2a2a2a;
  }
`;

const StyledActionButton = styled(Button)`
  && {
    min-width: auto;
    text-transform: none;
    font-weight: 500;
  }
`;

const sampleDiagrams = [
  {
    name: 'Flowchart',
    code: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[Alternative]
    C --> E[End]
    D --> E`
  },
  {
    name: 'Sequence Diagram',
    code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`
  },
  {
    name: 'Class Diagram',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`
  },
  {
    name: 'Git Graph',
    code: `gitgraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`
  }
];

interface ActionsProps {
  className?: string;
}

export const Actions: React.FC<ActionsProps> = ({ className }) => {
  const { code, mermaid, updateState } = useAppStore();
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<null | HTMLElement>(null);
  const [sampleAnchorEl, setSampleAnchorEl] = useState<null | HTMLElement>(null);

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareAnchorEl(event.currentTarget);
    logEvent('actions_share_menu_open');
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAnchorEl(event.currentTarget);
    logEvent('actions_download_menu_open');
  };

  const handleSampleClick = (event: React.MouseEvent<HTMLElement>) => {
    setSampleAnchorEl(event.currentTarget);
    logEvent('actions_sample_menu_open');
  };

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      logEvent('actions_copy_code');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [code]);

  const handleCopyLink = useCallback(async () => {
    try {
      const serializedState = serializeState({ code, mermaid, updateDiagram: true, rough: false, panZoom: true, grid: true, editorMode: 'code' });
      const url = `${window.location.origin}${window.location.pathname}#${serializedState}`;
      await navigator.clipboard.writeText(url);
      logEvent('actions_copy_link');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }, [code, mermaid]);

  const handleShareTwitter = useCallback(() => {
    const serializedState = serializeState({ code, mermaid, updateDiagram: true, rough: false, panZoom: true, grid: true, editorMode: 'code' });
    const url = `${window.location.origin}${window.location.pathname}#${serializedState}`;
    const tweetText = 'Check out this Mermaid diagram I created!';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    logEvent('actions_share_twitter');
  }, [code, mermaid]);

  const handleDownloadSvg = useCallback(() => {
    const svgElement = document.querySelector('#diagram-view svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'diagram.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
      logEvent('actions_download_svg');
    }
  }, []);

  const handleDownloadPng = useCallback(() => {
    const svgElement = document.querySelector('#diagram-view svg');
    if (svgElement) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'diagram.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(pngUrl);
          }
        });
        URL.revokeObjectURL(url);
        logEvent('actions_download_png');
      };
      
      img.src = url;
    }
  }, []);

  const handleLoadSample = useCallback((sample: typeof sampleDiagrams[0]) => {
    updateState({ code: sample.code });
    setSampleAnchorEl(null);
    logEvent('actions_load_sample', { sample: sample.name });
  }, [updateState]);

  const closeMenus = () => {
    setShareAnchorEl(null);
    setDownloadAnchorEl(null);
    setSampleAnchorEl(null);
  };

  return (
    <StyledActionsContainer className={className}>
      <ButtonGroup variant="outlined" size="small">
        <Tooltip title="Copy mermaid code">
          <IconButton onClick={handleCopyCode} size="small">
            <CopyIcon />
          </IconButton>
        </Tooltip>
        
        <StyledActionButton
          startIcon={<ShareIcon />}
          onClick={handleShareClick}
        >
          Share
        </StyledActionButton>
        
        <StyledActionButton
          startIcon={<DownloadIcon />}
          onClick={handleDownloadClick}
        >
          Download
        </StyledActionButton>
        
        <StyledActionButton
          startIcon={<SampleIcon />}
          onClick={handleSampleClick}
        >
          Samples
        </StyledActionButton>
      </ButtonGroup>

      {/* Share Menu */}
      <Menu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={closeMenus}
      >
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText>Copy Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopyCode}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText>Copy Code</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleShareTwitter}>
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText>Share on Twitter</ListItemText>
        </MenuItem>
      </Menu>

      {/* Download Menu */}
      <Menu
        anchorEl={downloadAnchorEl}
        open={Boolean(downloadAnchorEl)}
        onClose={closeMenus}
      >
        <MenuItem onClick={handleDownloadSvg}>
          <ListItemIcon>
            <SvgIcon />
          </ListItemIcon>
          <ListItemText>Download SVG</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadPng}>
          <ListItemIcon>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText>Download PNG</ListItemText>
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon>
            <PdfIcon />
          </ListItemIcon>
          <ListItemText>Download PDF (Coming Soon)</ListItemText>
        </MenuItem>
      </Menu>

      {/* Sample Diagrams Menu */}
      <Menu
        anchorEl={sampleAnchorEl}
        open={Boolean(sampleAnchorEl)}
        onClose={closeMenus}
      >
        {sampleDiagrams.map((sample) => (
          <MenuItem key={sample.name} onClick={() => handleLoadSample(sample)}>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText>{sample.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </StyledActionsContainer>
  );
}; 