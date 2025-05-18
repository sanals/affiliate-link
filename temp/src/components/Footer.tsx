import { Box, Typography, Link as MuiLink, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
      >
        {'© '}
        {currentYear}
        {' '}
        <MuiLink 
          color="inherit" 
          href="https://syrez.co.in"
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          Syrez.co.in
        </MuiLink>
        {' | '}
        <MuiLink
          color="inherit"
          href="https://syrez.co.in/privacy"
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </MuiLink>
        {' | '}
        <MuiLink
          color="inherit"
          href="https://syrez.co.in/contact"
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Footer; 