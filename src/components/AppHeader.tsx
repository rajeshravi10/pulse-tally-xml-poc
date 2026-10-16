import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const AppHeader: React.FC = () => {
  return (
    <Box
      component="header"
      sx={{
        height: 64,
        flexShrink: 0,
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        px: { xs: 2, sm: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}
    >
      {/* Left: Branding */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '8px',
            bgcolor: '#0d6e5a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 2px rgba(13, 110, 90, 0.2)',
          }}
        >
          {/* Pulse heartbeat SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '18px',
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          Pulse
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '14px',
            fontWeight: 400,
            ml: 0.5,
          }}
        >
          Tally XML export
        </Typography>
      </Box>

      {/* Right: Informational Badge */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          bgcolor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '9999px',
          px: 1.75,
          py: 0.6,
          color: '#92400e',
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 16, color: '#b45309' }} />
        <Typography
          sx={{
            fontSize: { xs: '11px', sm: '12.5px' },
            fontWeight: 500,
            color: '#92400e',
          }}
        >
          POC · runs in your browser, nothing is sent to a server
        </Typography>
      </Box>
    </Box>
  );
};
