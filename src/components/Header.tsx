import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  useTheme,
  Link
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface HeaderProps {
  toggleTheme: () => void;
}

const Header = ({ toggleTheme }: HeaderProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ backgroundColor: theme.palette.background.paper }}
    >
      <Toolbar>
        <img 
          src="/icons/icon-192x192.png" 
          alt="Syrez Logo" 
          style={{ 
            width: 28, 
            height: 28, 
            marginRight: theme.spacing(1)
          }} 
        />
        <Typography 
          variant="h6" 
          component={Link}
          href="https://syrez.co.in"
          underline="none"
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            color: theme.palette.text.primary
          }}
        >
          Syrez Affiliate Tool
        </Typography>
        
        <Box>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? (
              <Brightness7Icon sx={{ color: theme.palette.text.primary }} />
            ) : (
              <Brightness4Icon sx={{ color: theme.palette.text.primary }} />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 