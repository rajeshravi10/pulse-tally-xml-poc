import React from 'react';
import { Box, Typography, Grid, Paper, Button, Stack, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import type { XmlFileItem } from '../../data/xmlFileManifest';
import type { ChangedField } from './utils/diffXml';
import { getUpdatedFilename, triggerXmlDownload } from './utils/downloadXml';
import { XmlDiffViewer } from '../../components/XmlDiffViewer';

interface DownloadXmlScreenProps {
  selectedFile: XmlFileItem;
  changedFields: ChangedField[];
  modifiedCount: number;
  originalVoucherSnippet: string;
  liveVoucherSnippet: string;
  fullSerializedXml: string;
  onGetLatestXml?: () => string;
}

export const DownloadXmlScreen: React.FC<DownloadXmlScreenProps> = ({
  selectedFile,
  changedFields,
  modifiedCount,
  originalVoucherSnippet,
  liveVoucherSnippet,
  fullSerializedXml,
  onGetLatestXml,
}) => {
  const updatedFilename = getUpdatedFilename(selectedFile.filename);

  const handleDownload = () => {
    const content = onGetLatestXml ? onGetLatestXml() : fullSerializedXml;
    triggerXmlDownload(updatedFilename, content);
  };

  return (
    <Box sx={{ width: '100%', pb: 3 }}>
      {/* Page Title & Subtitle */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontSize: { xs: '22px', sm: '28px' },
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        Updated XML is ready
      </Typography>

      <Typography
        sx={{
          fontSize: '14px',
          color: '#64748b',
          lineHeight: 1.5,
          maxWidth: '820px',
          mb: 3,
        }}
      >
        {modifiedCount} {modifiedCount === 1 ? 'value' : 'values'} changed. The envelope, hierarchy
        and every locked field are identical to the source file, so it can go straight into the Tally
        import.
      </Typography>

      {/* Two Column Layout: Download & Changes Summary vs Diff Panel */}
      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        {/* Left Column: Download Card & What Changed */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Card 1: Download Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              mb: 2.5,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  bgcolor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  flexShrink: 0,
                }}
              >
                <DescriptionOutlinedIcon sx={{ fontSize: 24 }} />
              </Box>

              <Box sx={{ overflow: 'hidden' }}>
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    color: '#0f172a',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {updatedFilename}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#64748b', mt: 0.25 }}>
                  {selectedFile.displayName} · {selectedFile.sizeText} · generated in this browser tab
                </Typography>
              </Box>
            </Box>

            {/* Prominent Download Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              sx={{
                bgcolor: '#0d6e5a',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '15px',
                py: 1.35,
                borderRadius: '8px',
                boxShadow: 'none',
                mb: 1.5,
                '&:hover': {
                  bgcolor: '#095243',
                  boxShadow: 'none',
                },
              }}
            >
              Download updated XML
            </Button>

            <Typography sx={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
              Next, in Tally: Gateway of Tally, Import Data, Vouchers, then choose this file.
            </Typography>
          </Paper>

          {/* Card 2: What Changed */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
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
              WHAT CHANGED
            </Typography>

            {changedFields.length === 0 ? (
              <Typography sx={{ fontSize: '13px', color: '#64748b', mb: 2 }}>
                No changes made. The output XML matches the original source file.
              </Typography>
            ) : (
              <Box sx={{ mb: 2.5 }}>
                {changedFields.map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1.25,
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: '13px',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#475569',
                        textTransform: 'uppercase',
                      }}
                    >
                      {field.tagName}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          color: '#dc2626',
                          textDecoration: 'line-through',
                          fontSize: '13px',
                        }}
                      >
                        {field.oldValue || '(empty)'}
                      </Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '12px' }}>→</Typography>
                      <Typography
                        sx={{
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      >
                        {field.newValue || '(empty)'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Checklist items */}
            <Stack spacing={1.25}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography sx={{ fontSize: '12.5px', color: '#334155' }}>
                  Envelope, header and import tags preserved
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography sx={{ fontSize: '12.5px', color: '#334155' }}>
                  Locked fields untouched: voucher number, date, party ledger, amounts
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography sx={{ fontSize: '12.5px', color: '#334155' }}>
                  Same hierarchy and tag order as the source file
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: XML Comparison Diff Panel */}
        <Grid size={{ xs: 12, md: 7 }}>
          <XmlDiffViewer
            originalXml={originalVoucherSnippet}
            updatedXml={liveVoucherSnippet}
            maxHeight={520}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
