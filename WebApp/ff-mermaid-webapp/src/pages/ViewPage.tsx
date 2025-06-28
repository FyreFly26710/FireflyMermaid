import React from 'react';
import { Box } from '@mui/material';
import { DiagramView } from '../components/View';

const ViewPage: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <DiagramView shouldShowGrid={false} />
    </Box>
  );
};

export default ViewPage; 