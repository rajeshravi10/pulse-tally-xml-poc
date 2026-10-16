import React from 'react';
import { Box, Button, Typography, Stack, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { XmlFileItem } from '../data/xmlFileManifest';

interface FixedActionBarProps {
  currentStep: 1 | 2 | 3;
  selectedFile: XmlFileItem;
  isParsing?: boolean;
  onParse?: () => void;
  onBackToSelect?: () => void;
  onBackToEdit?: () => void;
  onReset?: () => void;
  onGenerateUpdated?: () => void;
}

export const FixedActionBar: React.FC<FixedActionBarProps> = ({
  currentStep,
  selectedFile,
  isParsing = false,
  onParse,
  onBackToSelect,
  onBackToEdit,
  onReset,
  onGenerateUpdated,
}) => {
  return (
    <Box
      component="footer"
      sx={{
        flexShrink: 0,
        bgcolor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        py: 1.75,
        px: { xs: 2, sm: 4 },
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          maxWidth: '1240px',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Step 1 Actions */}
        {currentStep === 1 && (
          <>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748b',
                  letterSpacing: '0.06em',
                  lineHeight: 1.2,
                }}
              >
                SELECTED
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                {selectedFile.displayName} · <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{selectedFile.filename}</span>
              </Typography>
            </Box>

            <Button
              variant="contained"
              disabled={isParsing}
              onClick={onParse}
              endIcon={isParsing ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
              sx={{
                bgcolor: '#0d6e5a',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14.5px',
                px: 3,
                py: 1.1,
                borderRadius: '8px',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#095243',
                  boxShadow: 'none',
                },
              }}
            >
              {isParsing ? 'Parsing XML...' : 'Parse XML and review fields →'}
            </Button>
          </>
        )}

        {/* Step 2 Actions */}
        {currentStep === 2 && (
          <>
            <Button
              variant="outlined"
              onClick={onBackToSelect}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: '#1e293b',
                borderColor: '#cbd5e1',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 2.2,
                py: 1,
                borderRadius: '8px',
                bgcolor: '#ffffff',
                '&:hover': {
                  borderColor: '#94a3b8',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              Choose another file
            </Button>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                onClick={onReset}
                startIcon={<RefreshIcon />}
                sx={{
                  color: '#1e293b',
                  borderColor: '#cbd5e1',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  px: 2.2,
                  py: 1,
                  borderRadius: '8px',
                  bgcolor: '#ffffff',
                  '&:hover': {
                    borderColor: '#94a3b8',
                    bgcolor: '#f8fafc',
                  },
                }}
              >
                Reset to original
              </Button>

              <Button
                variant="contained"
                onClick={onGenerateUpdated}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#0d6e5a',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14.5px',
                  px: 2.75,
                  py: 1,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#095243',
                    boxShadow: 'none',
                  },
                }}
              >
                Generate updated XML →
              </Button>
            </Stack>
          </>
        )}

        {/* Step 3 Actions */}
        {currentStep === 3 && (
          <>
            <Button
              variant="outlined"
              onClick={onBackToEdit}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: '#1e293b',
                borderColor: '#cbd5e1',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 2.2,
                py: 1,
                borderRadius: '8px',
                bgcolor: '#ffffff',
                '&:hover': {
                  borderColor: '#94a3b8',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              Back to editing
            </Button>

            <Button
              variant="outlined"
              onClick={onBackToSelect}
              sx={{
                color: '#1e293b',
                borderColor: '#cbd5e1',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 2.2,
                py: 1,
                borderRadius: '8px',
                bgcolor: '#ffffff',
                '&:hover': {
                  borderColor: '#94a3b8',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              Process another file
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
