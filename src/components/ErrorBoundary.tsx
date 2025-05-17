import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleClearCache = async (): Promise<void> => {
    if ('caches' in window) {
      try {
        const cacheNames = await window.caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => window.caches.delete(cacheName))
        );
        console.log('Cache cleared successfully');
        // Reload after clearing cache
        window.location.reload();
      } catch (err) {
        console.error('Failed to clear cache:', err);
      }
    } else {
      alert('Cache API not supported in this browser');
    }
  };

  // Get browser and environment info
  getEnvironmentInfo = (): string => {
    const info = [
      `URL: ${window.location.href}`,
      `User Agent: ${navigator.userAgent}`,
      `Window Size: ${window.innerWidth}x${window.innerHeight}`,
      `Device Pixel Ratio: ${window.devicePixelRatio}`,
      `Platform: ${navigator.platform}`,
      `PWA: ${window.matchMedia('(display-mode: standalone)').matches ? 'Yes' : 'No'}`,
      `Online: ${navigator.onLine ? 'Yes' : 'No'}`,
      `Date: ${new Date().toISOString()}`
    ];

    return info.join('\n');
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              textAlign: 'center'
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The application encountered an unexpected error. You can try the following solutions:
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleClearCache}
              >
                Clear Cache & Reload
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Technical Details Accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Technical Details (for developers)</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>Error Message:</Typography>
                <Typography 
                  variant="body2" 
                  component="pre"
                  sx={{ 
                    bgcolor: 'background.paper', 
                    p: 1, 
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.8rem'
                  }}
                >
                  {error?.toString() || 'Unknown error'}
                </Typography>
                
                {errorInfo && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Component Stack:</Typography>
                    <Typography 
                      variant="body2" 
                      component="pre"
                      sx={{ 
                        bgcolor: 'background.paper', 
                        p: 1, 
                        borderRadius: 1,
                        overflow: 'auto',
                        fontSize: '0.8rem'
                      }}
                    >
                      {errorInfo.componentStack}
                    </Typography>
                  </>
                )}
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Environment Info:</Typography>
                <Typography 
                  variant="body2" 
                  component="pre"
                  sx={{ 
                    bgcolor: 'background.paper', 
                    p: 1, 
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.8rem'
                  }}
                >
                  {this.getEnvironmentInfo()}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Box>
      );
    }

    // If no error occurred, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 