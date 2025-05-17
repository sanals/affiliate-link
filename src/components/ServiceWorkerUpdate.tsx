import { useState, useEffect } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';
import { registerSW } from 'virtual:pwa-register';

const ServiceWorkerUpdate = () => {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  // Initialize the refresh update function - we don't use the returned function
  // but we need to call registerSW
  registerSW({
    onNeedRefresh() {
      setShowReload(true);
    },
    onOfflineReady() {
      console.log('App is ready for offline use');
    },
    onRegisteredSW(_swUrl: string, swRegistration: ServiceWorkerRegistration | undefined) {
      // Check if there's a waiting worker
      if (swRegistration?.waiting) {
        setWaitingWorker(swRegistration.waiting);
        setShowReload(true);
      }
    }
  });

  // Handle reload click
  const handleReload = () => {
    if (waitingWorker) {
      // Send 'SKIP_WAITING' message to the waiting worker
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    
    // Close notification
    setShowReload(false);
    
    // Reload the page to activate the new service worker
    window.location.reload();
  };

  // Handle notification close
  const handleClose = () => {
    setShowReload(false);
  };

  // Check for updates on mount
  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setShowReload(true);
        }
      });
    }
  }, []);

  return (
    <Snackbar
      open={showReload}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        severity="info"
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleReload}
          >
            REFRESH
          </Button>
        }
        onClose={handleClose}
      >
        New version available!
      </Alert>
    </Snackbar>
  );
};

export default ServiceWorkerUpdate; 