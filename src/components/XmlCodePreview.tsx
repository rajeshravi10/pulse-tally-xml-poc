import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';

interface XmlCodePreviewProps {
  xmlContent: string;
  filename?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  footerNote?: string;
  highlightedKeywords?: string[];
  maxHeight?: string | number;
  minHeight?: string | number;
}

// Simple and robust XML syntax token renderer
function renderSyntaxHighlightedLine(line: string) {
  if (line.trim().startsWith('<!--')) {
    return <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{line}</span>;
  }

  const parts = line.split(/(<\/?[a-zA-Z0-9_.:-]+(?:\s+[^>]*?)?>)/g);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith('<') && part.endsWith('>')) {
      const tagMatch = part.match(/^(<\/?[a-zA-Z0-9_.:-]+)([\s\S]*?)(\/?>)$/);
      if (tagMatch) {
        const [, tagName, attrString, closing] = tagMatch;
        return (
          <span key={idx}>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{tagName}</span>
            {attrString && (
              <span style={{ color: '#c084fc' }}>
                {attrString}
              </span>
            )}
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{closing}</span>
          </span>
        );
      }
      return (
        <span key={idx} style={{ color: '#38bdf8' }}>
          {part}
        </span>
      );
    }

    return (
      <span key={idx} style={{ color: '#fef08a' }}>
        {part}
      </span>
    );
  });
}

export const XmlCodePreview: React.FC<XmlCodePreviewProps> = ({
  xmlContent,
  filename,
  headerTitle,
  headerSubtitle = 'Raw XML · read-only preview',
  footerNote,
  highlightedKeywords = [],
  maxHeight = 440,
  minHeight = 360,
}) => {
  const lines = useMemo(() => {
    if (!xmlContent) return [];
    return xmlContent.split('\n');
  }, [xmlContent]);

  return (
    <Box
      sx={{
        bgcolor: '#0b1120',
        borderRadius: '10px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
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
          {headerTitle || filename || 'XML Preview'}
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            color: '#94a3b8',
          }}
        >
          {headerSubtitle}
        </Typography>
      </Box>

      {/* Code viewport with line numbers */}
      <Box
        sx={{
          p: 1.5,
          height: maxHeight,
          minHeight,
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
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#475569',
          },
        }}
      >
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted =
            highlightedKeywords.length > 0 &&
            highlightedKeywords.some((kw) => kw && line.includes(kw));

          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                whiteSpace: 'pre',
                bgcolor: isHighlighted ? 'rgba(217, 119, 6, 0.18)' : 'transparent',
                borderLeft: isHighlighted ? '3px solid #f59e0b' : '3px solid transparent',
                px: 1,
                borderRadius: isHighlighted ? '2px' : 0,
                '&:hover': {
                  bgcolor: isHighlighted ? 'rgba(217, 119, 6, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: '38px',
                  flexShrink: 0,
                  textAlign: 'right',
                  pr: 2,
                  color: isHighlighted ? '#fbbf24' : '#475569',
                  userSelect: 'none',
                }}
              >
                {lineNumber}
              </Box>

              <Box component="span" sx={{ flexGrow: 1 }}>
                {renderSyntaxHighlightedLine(line)}
              </Box>
            </Box>
          );
        })}
      </Box>

      {footerNote && (
        <Box
          sx={{
            bgcolor: '#111927',
            borderTop: '1px solid #1e293b',
            px: 2,
            py: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: '11.5px',
              color: '#94a3b8',
              lineHeight: 1.4,
            }}
          >
            {footerNote}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
