import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { store } from './app/store';
import { AppRouter } from './routes';
import { useAppSelector } from './shared/hooks';
import { useWebSocket } from './shared/hooks/useWebSocket';
import { API_ERROR_EVENT } from './services/api';


function DarkModeInitializer() {
  const { darkMode } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return null;
}

function WebSocketInitializer() {
  // Initialize WebSocket connection based on auth state
  useWebSocket();
  return null;
}

function AppContent() {
  useEffect(() => {
    const onApiError = (event: Event) => {
      const customEvent = event as CustomEvent<{ status?: number; message?: string }>;
      const message = customEvent.detail?.message || 'Something went wrong. Please try again later.';
      toast.error(message);
    };

    window.addEventListener(API_ERROR_EVENT, onApiError as EventListener);
    return () => window.removeEventListener(API_ERROR_EVENT, onApiError as EventListener);
  }, []);

  return (
    <>
      <DarkModeInitializer />
      <WebSocketInitializer />
      <AppRouter />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{ top: 16 }}
        toastOptions={{
          duration: 2000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            fontSize: '13px',
            fontWeight: '500',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            padding: '10px 14px',
            maxWidth: '340px',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
            style: {
              borderLeft: '3px solid #16a34a',
            },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
            style: {
              borderLeft: '3px solid #dc2626',
            },
          },
        }}
      />
    </>
  );
}

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppContent />
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
