import React, { useMemo } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import type { XmlFileItem } from '../../data/xmlFileManifest';
import type { DynamicSection, DynamicFieldConfig } from './utils/parseXml';
import { XmlSectionCard } from '../../components/XmlSectionCard';
import { EditableXmlField } from '../../components/EditableXmlField';
import { XmlCodePreview } from '../../components/XmlCodePreview';
import type { ChangedField } from './utils/diffXml';

interface ReviewXmlScreenProps {
  selectedFile: XmlFileItem;
  fieldValues: Record<string, string>;
  originalFieldValues: Record<string, string>;
  sections: DynamicSection[];
  dynamicFields: DynamicFieldConfig[];
  changedFields: ChangedField[];
  modifiedCount: number;
  liveVoucherSnippet: string;
  onFieldChange: (key: string, value: string) => void;
}

export const ReviewXmlScreen: React.FC<ReviewXmlScreenProps> = ({
  selectedFile,
  fieldValues,
  originalFieldValues,
  sections,
  changedFields,
  modifiedCount,
  liveVoucherSnippet,
  onFieldChange,
}) => {
  // Keywords to highlight in the live XML preview
  const highlightedKeywords = useMemo(() => {
    return changedFields
      .map((cf) => cf.newValue)
      .filter((val) => Boolean(val && val.length > 1));
  }, [changedFields]);

  return (
    <Box sx={{ width: '100%', pb: 3 }}>
      {/* Page Title & Subtitle with Legend */}
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
        Review and edit XML values
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: '14px',
            color: '#64748b',
            lineHeight: 1.5,
          }}
        >
          Parsed from <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedFile.filename}</span>. Edits
          change the XML export only, not the invoice.
        </Typography>

        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <EditOutlinedIcon sx={{ fontSize: 16, color: '#0d6e5a' }} />
            <Typography sx={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
              Editable
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LockOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
              Locked by business rule (First 2 fields)
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 700,
              color: modifiedCount > 0 ? '#d97706' : '#64748b',
            }}
          >
            {modifiedCount} {modifiedCount === 1 ? 'field edited' : 'fields edited'}
          </Typography>
        </Box>
      </Box>

      {/* Two Column Layout: Dynamic Form Sections vs Live XML Preview */}
      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        {/* Left: Dynamic Form Sections */}
        <Grid size={{ xs: 12, md: 6 }}>
          {sections.map((sec) => (
            <XmlSectionCard key={sec.key} title={sec.title}>
              <Grid container spacing={2}>
                {sec.fields.map((field) => (
                  <Grid
                    key={field.key}
                    size={{
                      xs: 12,
                      sm: field.inputType === 'textarea' ? 12 : 6,
                    }}
                  >
                    <EditableXmlField
                      config={field}
                      value={fieldValues[field.key] ?? ''}
                      originalValue={originalFieldValues[field.key] ?? ''}
                      onChange={(val) => onFieldChange(field.key, val)}
                    />
                  </Grid>
                ))}
              </Grid>
            </XmlSectionCard>
          ))}
        </Grid>

        {/* Right: Live XML Preview */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            position: { md: 'sticky' },
            top: { md: 24 },
          }}
        >
          <XmlCodePreview
            xmlContent={liveVoucherSnippet}
            headerTitle="Live XML preview"
            headerSubtitle="Highlighted lines reflect your edits"
            footerNote="Envelope, header and import tags stay exactly as in the source file. Only the highlighted values differ."
            highlightedKeywords={highlightedKeywords}
            maxHeight={640}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
