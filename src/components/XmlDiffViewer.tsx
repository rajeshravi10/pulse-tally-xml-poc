import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { computeXmlDiff } from '../features/xml-editor/utils/diffXml';

interface XmlDiffViewerProps {
  originalXml: string;
  updatedXml: string;
  maxHeight?: string | number;
}

export const XmlDiffViewer: React.FC<XmlDiffViewerProps> = ({
  originalXml,
  updatedXml,
  maxHeight = 440,
}) => {
  const diffResult = useMemo(() => {
    return computeXmlDiff(originalXml, updatedXml);
  }, [originalXml, updatedXml]);

  return (
    <Box
      sx={{
        bgcolor: '#0b1120',
        borderRadius: '10px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header bar */}
      <Box
        sx={{
          bgcolor: '#111927',
          borderBottom: '1px solid #1e293b',
          px: 2,
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '13px',
            fontWeight: 600,
            color: '#f8fafc',
          }}
        >
          Original vs updated XML
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            color: '#94a3b8',
          }}
        >
          {diffResult.removedCount} lines removed · {diffResult.addedCount} lines added
        </Typography>
      </Box>

      {/* Code diff viewport */}
      <Box
        sx={{
          p: 1.5,
          height: maxHeight,
          overflow: 'auto',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontSize: '12.5px',
          lineHeight: '1.65',
          bgcolor: '#0b1120',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0b1120',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#334155',
            borderRadius: '4px',
          },
        }}
      >
        {diffResult.lines.map((line, idx) => {
          const isAdded = line.type === 'added';
          const isRemoved = line.type === 'removed';

          return (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                whiteSpace: 'pre',
                px: 1,
                borderRadius: '2px',
                bgcolor: isRemoved
                  ? 'rgba(239, 68, 68, 0.22)'
                  : isAdded
                  ? 'rgba(16, 185, 129, 0.22)'
                  : 'transparent',
                borderLeft: isRemoved
                  ? '3px solid #ef4444'
                  : isAdded
                  ? '3px solid #10b981'
                  : '3px solid transparent',
              }}
            >
              {/* Prefix +/- */}
              <Box
                component="span"
                sx={{
                  width: '20px',
                  flexShrink: 0,
                  userSelect: 'none',
                  fontWeight: 700,
                  color: isRemoved ? '#f87171' : isAdded ? '#34d399' : '#475569',
                }}
              >
                {isRemoved ? '-' : isAdded ? '+' : ' '}
              </Box>

              {/* Line text */}
              <Box
                component="span"
                sx={{
                  color: isRemoved ? '#fca5a5' : isAdded ? '#6ee7b7' : '#94a3b8',
                  fontWeight: isAdded || isRemoved ? 600 : 400,
                }}
              >
                {line.content}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
