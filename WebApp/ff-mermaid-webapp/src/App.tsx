import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lightTheme, darkTheme } from './styles/theme';
import { EditorPage, ViewPage } from './pages';

const App: React.FC = () => {
  // For now, use light theme - we can add theme management later
  const theme = lightTheme;

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