import { useState, useEffect } from 'react';
import { Alert, Button, Snackbar, Typography, Box } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { registerSW } from 'virtual:pwa-register';

type UpdateStatus = 'none' | 'available' | 'offlineReady';

const ServiceWorkerUpdate = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('none');
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers not supported');
      return;
    }

    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateStatus('available');
      },
      onOfflineReady() {
        setUpdateStatus('offlineReady');
        // Auto-hide the offline ready notification after 3 seconds
        setTimeout(() => {
          if (updateStatus === 'offlineReady') {
            setUpdateStatus('none');
          }
        }, 3000);
      },
      onRegistered(registration) {
        console.log('Service worker registered:', registration);
        
        // Check if there's a waiting worker and save it
        if (registration?.waiting) {
          setWaitingWorker(registration.waiting);
        }
        
        // Check if we're running in a PWA context
        const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
        
        if (isPWA) {
          // Set up periodic checks for updates if running as PWA
          const checkInterval = setInterval(() => {
            console.log('Checking for service worker updates...');
            registration?.update().catch(err => {
              console.error('Error checking for SW updates:', err);
            });
          }, 60 * 60 * 1000); // Check every hour
          
          // Clear interval on component unmount
          return () => clearInterval(checkInterval);
        }
      },
      onRegisterError(error) {
        console.error('Service worker registration error:', error);
        setRegistrationError(error.message);
      }
    });

    // Add event listener for controlling service worker changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Controller changed, which means a new service worker has taken control
      console.log('Service worker controller changed - page will reload');
      window.location.reload();
    });

    // Check for existing waiting workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setUpdateStatus('available');
        }
      }).catch(err => {
        console.error('Error checking for waiting service workers:', err);
      });
    }

    return () => {
      // Cleanup function to unregister SW when component unmounts
      // This is generally not recommended in production, but can help during development
      if (process.env.NODE_ENV === 'development') {
        updateSW?.();
      }
    };
  }, []);

  // Handle reload click
  const handleReload = () => {
    if (waitingWorker) {
      // Send 'SKIP_WAITING' message to the waiting worker
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      console.log('Skip waiting message sent to worker:', waitingWorker);
    } else if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // If we don't have a direct reference to the waiting worker
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      console.log('Skip waiting message sent to controller');
    }
    
    // Clear the waiting worker reference
    setWaitingWorker(null);
    
    // Close notification
    setUpdateStatus('none');
    
    // Reload the page to activate the new service worker
    window.location.reload();
  };

  // Handle notification close
  const handleClose = () => {
    setUpdateStatus('none');
  };

  // If service worker registration failed, don't show anything
  if (registrationError) {
    console.error('PWA initialization error:', registrationError);
    return null;
  }

  return (
    <>
      {/* New version available notification */}
      <Snackbar
        open={updateStatus === 'available'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 1 }}
      >
        <Alert 
          severity="info"
          icon={<UpdateIcon />}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleReload}
            >
              UPDATE
            </Button>
          }
          onClose={handleClose}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2">New version available!</Typography>
            <Typography variant="caption">Update to get the latest features</Typography>
          </Box>
        </Alert>
      </Snackbar>

      {/* Offline ready notification */}
      <Snackbar
        open={updateStatus === 'offlineReady'}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleClose}
      >
        <Alert 
          severity="success"
          icon={<CloudDoneIcon />}
          onClose={handleClose}
        >
          <Typography variant="body2">App ready for offline use</Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ServiceWorkerUpdate; 