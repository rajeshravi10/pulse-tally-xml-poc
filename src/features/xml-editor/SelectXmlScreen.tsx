import React from 'react';
import { Box, Typography, Grid, Paper, Stack, Alert } from '@mui/material';
import { SAMPLE_XML_FILES, type XmlFileItem } from '../../data/xmlFileManifest';
import { XmlCodePreview } from '../../components/XmlCodePreview';

interface SelectXmlScreenProps {
  selectedFile: XmlFileItem;
  onSelectFile: (file: XmlFileItem) => void;
  parseError: string | null;
}

export const SelectXmlScreen: React.FC<SelectXmlScreenProps> = ({
  selectedFile,
  onSelectFile,
  parseError,
}) => {
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
        Choose the Tally XML to review
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
        Four sample files ship with this prototype. Pick one and the preview updates. Next, the XML is
        parsed into form fields where only business-approved values can be edited.
      </Typography>

      {parseError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {parseError}
        </Alert>
      )}

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Left: Source Files List */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
              px: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              SOURCE FILES
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              {SAMPLE_XML_FILES.length} available
            </Typography>
          </Box>

          {/* Cards List */}
          <Stack spacing={1.5}>
            {SAMPLE_XML_FILES.map((file) => {
              const isSelected = selectedFile.id === file.id;

              return (
                <Paper
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #0d6e5a' : '1px solid #e2e8f0',
                    bgcolor: isSelected ? '#f2faf7' : '#ffffff',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected
                      ? '0 1px 3px 0 rgba(13, 110, 90, 0.1)'
                      : '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      borderColor: isSelected ? '#0d6e5a' : '#cbd5e1',
                      bgcolor: isSelected ? '#f2faf7' : '#f8fafc',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
                    {/* Custom Radio Button */}
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: isSelected ? '2px solid #0d6e5a' : '2px solid #94a3b8',
                        bgcolor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 0.3,
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: '#0d6e5a',
                          }}
                        />
                      )}
                    </Box>

                    {/* Card Content */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      {/* Top Row: Title, Default Badge, and Amount */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '15px',
                              fontWeight: 700,
                              color: '#0f172a',
                            }}
                          >
                            {file.displayName}
                          </Typography>
                          {file.isDefault && (
                            <Box
                              sx={{
                                bgcolor: '#0f172a',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: 600,
                                px: 0.9,
                                py: 0.1,
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Default
                            </Box>
                          )}
                        </Box>

                        <Typography
                          sx={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#0f172a',
                          }}
                        >
                          {file.amountFormatted}
                        </Typography>
                      </Box>

                      {/* Middle Row: Source Filename and Size */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            color: '#64748b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.filename}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#64748b',
                            flexShrink: 0,
                            ml: 1,
                          }}
                        >
                          {file.sizeText}
                        </Typography>
                      </Box>

                      {/* Bottom Row: Party and Voucher Number */}
                      <Typography
                        sx={{
                          fontSize: '12.5px',
                          color: '#64748b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {file.partyName} · {file.voucherNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        </Grid>

        {/* Right: Raw XML Preview Panel */}
        <Grid size={{ xs: 12, md: 7 }}>
          <XmlCodePreview
            xmlContent={selectedFile.rawXml}
            filename={selectedFile.filename}
            headerSubtitle="Raw XML · read-only preview"
            maxHeight={460}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
