// src/App.tsx

import { useState, useEffect } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  Container, 
  Box, 
  PaletteMode
} from '@mui/material';
import LinkConverterCard from './components/LinkConverterCard';
import createAppTheme from './theme';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  // Theme state setup
  const [mode, setMode] = useState<PaletteMode>('light');

  // Initialize theme preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Check for system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

  // Toggle theme mode
  const toggleThemeMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Create theme
  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh'
        }}
      >
        <Header toggleTheme={toggleThemeMode} />
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <LinkConverterCard />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
