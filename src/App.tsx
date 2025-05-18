// src/App.tsx

import { useState, useEffect, useCallback } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  Container, 
  Box, 
  PaletteMode,
  Snackbar,
  Alert
} from '@mui/material';
import LinkConverterCard from './components/LinkConverterCard';
import createAppTheme from './theme';
import Header from './components/Header';
import Footer from './components/Footer';

// Type for service worker message event
interface ShareTargetMessageEvent extends MessageEvent {
  data: {
    type: string;
    url?: string;
    text?: string;
    title?: string;
  };
}

const App = () => {
  // Theme state setup
  const [mode, setMode] = useState<PaletteMode>('light');
  // Initial URL for the link converter (for share targets)
  const [initialUrl, setInitialUrl] = useState<string>('');
  // Notification for share success
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'info' | 'warning' | 'error'
  });

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

  // Handle service worker messages
  const handleServiceWorkerMessage = useCallback((event: ShareTargetMessageEvent) => {
    if (event.data && event.data.type === 'SHARE_TARGET') {
      console.log('Received shared content via postMessage:', event.data);
      
      // Handle shared URL directly if available
      if (event.data.url) {
        setInitialUrl(event.data.url);
        setNotification({
          open: true,
          message: 'Link received from share!',
          severity: 'success'
        });
      } 
      // Otherwise try to extract URL from text
      else if (event.data.text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = event.data.text.match(urlRegex);
        if (matches && matches.length > 0) {
          setInitialUrl(matches[0]);
          setNotification({
            open: true,
            message: 'Link extracted from shared text!',
            severity: 'success'
          });
        } else {
          setInitialUrl(event.data.text);
          setNotification({
            open: true,
            message: 'Received shared text!',
            severity: 'info'
          });
        }
      }
    }
  }, []);

  // Set up service worker message listener
  useEffect(() => {
    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage as EventListener);
    
    // Clean up listener on unmount
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage as EventListener);
    };
  }, [handleServiceWorkerMessage]);

  // Handle Web Share Target API via URL parameters
  useEffect(() => {
    // Check URL parameters for direct shares
    const urlParams = new URLSearchParams(window.location.search);
    
    // Handle success notification
    if (urlParams.has('share-success')) {
      setNotification({
        open: true,
        message: 'Content shared successfully!',
        severity: 'success'
      });
    }
    
    // Process shared data from URL parameters
    const urlParam = urlParams.get('url');
    const textParam = urlParams.get('text');
    
    if (urlParam) {
      setInitialUrl(urlParam);
      setNotification({
        open: true,
        message: 'Link received!',
        severity: 'success'
      });
    } else if (textParam) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const matches = textParam.match(urlRegex);
      if (matches && matches.length > 0) {
        setInitialUrl(matches[0]);
        setNotification({
          open: true,
          message: 'Link extracted from shared text!',
          severity: 'success'
        });
      } else {
        setInitialUrl(textParam);
        setNotification({
          open: true,
          message: 'Text received!',
          severity: 'info'
        });
      }
    }
    
    // Clear URL parameters after processing
    if ((urlParam || textParam) && window.history.replaceState) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Toggle theme mode
  const toggleThemeMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(prev => ({...prev, open: false}));
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
        
        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default App;
