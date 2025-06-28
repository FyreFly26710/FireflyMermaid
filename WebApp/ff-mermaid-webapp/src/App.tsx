import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { lightTheme } from './styles/theme';

// Placeholder components for now
const EditorPage: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Mermaid Live Editor</h1>
        <p className="text-gray-600">Ready for development</p>
      </div>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/edit" replace />} />
          <Route path="/edit" element={<EditorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 