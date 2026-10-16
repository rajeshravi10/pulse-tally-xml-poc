import React, { useRef, useState } from 'react';
import { Box, Typography, Grid, Paper, Stack, Alert } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import type { XmlFileItem } from '../../data/xmlFileManifest';
import { XmlCodePreview } from '../../components/XmlCodePreview';

interface SelectXmlScreenProps {
  fileList: XmlFileItem[];
  selectedFile: XmlFileItem;
  onSelectFile: (file: XmlFileItem) => void;
  onUploadFile: (file: File) => void;
  parseError: string | null;
}

export const SelectXmlScreen: React.FC<SelectXmlScreenProps> = ({
  fileList,
  selectedFile,
  onSelectFile,
  onUploadFile,
  parseError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onUploadFile(files[0]);
    }
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
        Select any sample file below or upload your own Tally XML file. The XML is parsed 100% in your
        browser and converted into dynamic fields for review and editing.
      </Typography>

      {parseError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {parseError}
        </Alert>
      )}

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Left: Source Files List & Upload Box */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Upload Dropzone */}
          <Paper
            elevation={0}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            sx={{
              p: 2.25,
              mb: 2.5,
              borderRadius: '10px',
              border: isDragOver ? '2px dashed #0d6e5a' : '2px dashed #cbd5e1',
              bgcolor: isDragOver ? '#f0fdf4' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#0d6e5a',
                bgcolor: '#f8fafc',
              },
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".xml,text/xml,application/xml"
              hidden
              onChange={handleFileChange}
            />

            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '8px',
                bgcolor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0d6e5a',
                flexShrink: 0,
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#0f172a',
                  lineHeight: 1.3,
                }}
              >
                Upload your own Tally XML file
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#64748b', mt: 0.25 }}>
                Click to browse or drag & drop .xml file
              </Typography>
            </Box>
          </Paper>

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
              AVAILABLE FILES
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              {fileList.length} files
            </Typography>
          </Box>

          {/* Cards List */}
          <Stack spacing={1.5}>
            {fileList.map((file) => {
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
                      {/* Top Row: Title, Default/Uploaded Badge, and Amount */}
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

                          {file.isUploaded && (
                            <Box
                              sx={{
                                bgcolor: '#0284c7',
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
                              Uploaded
                            </Box>
                          )}

                          {file.isDefault && !file.isUploaded && (
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
            maxHeight={520}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
