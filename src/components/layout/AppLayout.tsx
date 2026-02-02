import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Header } from './Header';
import { Sidebar, drawerWidth } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, isAdmin = false }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar isAdmin={isAdmin} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
