import { useEffect, useState } from 'react';
import { Snackbar, Button, Alert } from '@mui/material';
import { useRegisterSW } from 'virtual:pwa-register/react';

const ServiceWorkerUpdate = () => {
  const [showReload, setShowReload] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered:', registration);
    },
    onRegisterError(error: Error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    setShowReload(needRefresh);
  }, [needRefresh]);

  const handleReload = () => {
    updateServiceWorker(true);
    setShowReload(false);
    setNeedRefresh(false);
  };

  const handleClose = () => {
    setShowReload(false);
  };

  return (
    <Snackbar
      open={showReload}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 90, sm: 24 } }}
    >
      <Alert
        severity="info"
        sx={{ width: '100%' }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleReload}
          >
            Update & Reload
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