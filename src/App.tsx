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
  // Initial URL for the link converter (for share targets)
  const [initialUrl, setInitialUrl] = useState<string>('');

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

  // Handle Web Share Target API
  useEffect(() => {
    // Check if URL contains share target parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('url');
    const sharedText = urlParams.get('text');
    
    // If we have a URL or text shared, use it
    if (sharedUrl) {
      setInitialUrl(sharedUrl);
    } else if (sharedText) {
      // Try to extract a URL from text if possible
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const matches = sharedText.match(urlRegex);
      if (matches && matches.length > 0) {
        setInitialUrl(matches[0]);
      } else {
        setInitialUrl(sharedText);
      }
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
          <LinkConverterCard initialUrl={initialUrl} />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
