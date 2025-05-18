import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  Snackbar, 
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ClearIcon from '@mui/icons-material/Clear';
import { generateAffiliateLink } from '../utils/linkConverter';
import { resolveShortUrl } from '../utils/urlResolver';

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info';
}

const LinkConverterCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [inputUrl, setInputUrl] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
    setError(null);
  };

  const handleConvertClick = async () => {
    if (!inputUrl.trim()) {
      setError('Please enter an Amazon link');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, try to resolve short URL if it's an amzn.to link
      let urlToConvert = inputUrl.trim();
      
      if (urlToConvert.includes('amzn.to/')) {
        try {
          urlToConvert = await resolveShortUrl(urlToConvert);
        } catch (error) {
          setError('Could not resolve short link. Please expand it manually by opening in your browser first.');
          setIsLoading(false);
          return;
        }
      }
      
      // Now convert the link
      const result = generateAffiliateLink(urlToConvert);
      setAffiliateUrl(result);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to convert link');
      setIsLoading(false);
    }
  };

  const handleCopyClick = async () => {
    if (!affiliateUrl) return;
    
    try {
      await navigator.clipboard.writeText(affiliateUrl);
      setNotification({
        open: true,
        message: 'Link copied to clipboard!',
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to copy link',
        severity: 'error',
      });
    }
  };

  const handleOpenClick = () => {
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClearClick = () => {
    setInputUrl('');
    setAffiliateUrl('');
    setError(null);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputUrl.trim()) {
      handleConvertClick();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        maxWidth: '600px', 
        width: '100%',
        mx: 'auto',
        mt: 2
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Syrez Amazon Affiliate Tool
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Paste Amazon Link"
          variant="outlined"
          value={inputUrl}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="https://amzn.in/d/example"
          error={!!error}
          helperText={error || ''}
          disabled={isLoading}
          sx={{ mb: 2 }}
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleConvertClick}
          disabled={!inputUrl.trim() || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SwapHorizIcon />}
          sx={{ py: 1.2 }}
        >
          {isLoading ? 'Converting...' : 'Convert Link'}
        </Button>
      </Box>
      
      {affiliateUrl && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Affiliate Link:
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            value={affiliateUrl}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.action.hover,
              }
            }}
          />
          
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              flexDirection: isMobile ? 'column' : 'row',
              mt: 2 
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCopyClick}
              startIcon={<ContentCopyIcon />}
              fullWidth
            >
              Copy Link
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenClick}
              startIcon={<OpenInNewIcon />}
              fullWidth
            >
              Open in Amazon
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearClick}
              startIcon={<ClearIcon />}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        </Box>
      )}
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LinkConverterCard; 