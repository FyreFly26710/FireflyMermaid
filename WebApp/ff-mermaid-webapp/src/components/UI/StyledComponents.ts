import styled from 'styled-components';
import { Button, Paper, Box } from '@mui/material';
import { Theme } from '@mui/material/styles';

// Interface for components that need theme access
interface StyledComponentProps {
  theme: Theme;
}

interface GridBackgroundProps extends StyledComponentProps {
  showGrid?: boolean;
}

// Styled MUI Button with Tailwind-inspired design
export const StyledGradientButton = styled(Button)`
  && {
    background: linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%);
    border-radius: 8px;
    border: 0;
    color: white;
    height: 48px;
    padding: 0 24px;
    box-shadow: 0 3px 5px 2px rgba(99, 102, 241, 0.3);
    text-transform: none;
    font-weight: 600;
    
    &:hover {
      background: linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%);
      box-shadow: 0 4px 8px 3px rgba(99, 102, 241, 0.4);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

// Styled Paper with custom shadow and animation
export const StyledAnimatedCard = styled(Paper)`
  && {
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
  }
`;

// Styled container for mermaid editor layout
export const StyledEditorContainer = styled(Box)<StyledComponentProps>`
  && {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: ${({ theme }) => 
      theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    };
    
    @media (max-width: 768px) {
      height: 100dvh; /* Dynamic viewport height for mobile */
    }
  }
`;

// Styled grid background for diagram view
export const StyledDiagramViewport = styled.div<GridBackgroundProps>`
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
  
  ${({ showGrid, theme }) => showGrid && `
    background-size: 30px 30px;
    background-image: radial-gradient(
      circle, 
      ${theme.palette.mode === 'dark' ? '#46464646' : '#e4e4e48c'} 2px, 
      transparent 2px
    );
  `}
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.palette.background.paper};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.palette.primary.main};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.palette.primary.dark};
    }
  }
`;

// Styled code editor wrapper
export const StyledCodeEditorWrapper = styled.div<StyledComponentProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  
  .monaco-editor {
    border-radius: 0 0 12px 12px;
  }
  
  /* Custom styles for Monaco Editor */
  .monaco-editor .margin {
    background-color: ${({ theme }) => theme.palette.background.default} !important;
  }
`; 