import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMediaQuery } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lightTheme, darkTheme } from './styles/theme';
import { EditorPage, ViewPage } from './pages';
import { useAppStore } from './hooks/useAppStore';

const App: React.FC = () => {
  const { themeMode } = useAppStore();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const theme = useMemo(() => {
    if (themeMode === 'auto') {
      return prefersDarkMode ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/edit" replace />} />
          <Route path="/edit" element={<EditorPage />} />
          <Route path="/view" element={<ViewPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 