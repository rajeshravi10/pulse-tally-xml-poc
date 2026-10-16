import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { XmlEditorApp } from './features/xml-editor/XmlEditorApp';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d6e5a',
      dark: '#095243',
      light: '#149177',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f172a',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    warning: {
      main: '#f59e0b',
      dark: '#d97706',
      light: '#fef3c7',
    },
    success: {
      main: '#10b981',
      dark: '#059669',
      light: '#ecfdf5',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
});

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <XmlEditorApp />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
