import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RTL from './components/RTL';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chatbots from './pages/Chatbots';
import CreateChatbot from './pages/CreateChatbot';
import EditChatbot from './pages/EditChatbot';
import Login from './pages/Login';

// יצירת ערכת נושא מותאמת אישית
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#6B73FF',
      light: '#8B92FF',
      dark: '#4B54FF',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FF8B8B',
      dark: '#FF4B4B',
    },
    background: {
      default: '#F8F9FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(107, 115, 255, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8B92FF 0%, #6B73FF 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
          boxShadow: '0 4px 20px rgba(107, 115, 255, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RTL>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="chatbots" element={<Chatbots />} />
              <Route path="chatbots/create" element={<CreateChatbot />} />
              <Route path="chatbots/:id/edit" element={<EditChatbot />} />
            </Route>
          </Routes>
        </Router>
      </RTL>
    </ThemeProvider>
  );
}

export default App; 