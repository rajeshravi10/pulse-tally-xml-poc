import React from 'react';
import { Box, Typography } from '@mui/material';

interface XmlSectionCardProps {
  title: string;
  children: React.ReactNode;
}

export const XmlSectionCard: React.FC<XmlSectionCardProps> = ({ title, children }) => {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        p: { xs: 2, sm: 2.5 },
        mb: 2.5,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }}
    >
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#64748b',
          textTransform: 'uppercase',
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
};
