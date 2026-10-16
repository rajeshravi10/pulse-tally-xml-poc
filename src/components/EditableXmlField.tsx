import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import type { DynamicFieldConfig } from '../features/xml-editor/utils/parseXml';
import {
  parseXmlDateToDayjs,
  formatDayjsToXmlDate,
  formatXmlDateForDisplay,
} from '../features/xml-editor/utils/dateUtils';

interface EditableXmlFieldProps {
  config: DynamicFieldConfig;
  value: string;
  originalValue: string;
  onChange: (val: string) => void;
}

export const EditableXmlField: React.FC<EditableXmlFieldProps> = ({
  config,
  value,
  originalValue,
  onChange,
}) => {
  const isEdited = config.isEditable && (value ?? '').trim() !== (originalValue ?? '').trim();
  const isDateField = config.inputType === 'date';

  // Parse YYYYMMDD string safely to Dayjs
  const parsedDate = isDateField ? parseXmlDateToDayjs(value) : null;

  return (
    <Box sx={{ mb: 2 }}>
      {/* Label and Tag Name Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#1e293b',
          }}
        >
          {config.label}
        </Typography>

        <Typography
          sx={{
            fontSize: '10.5px',
            fontFamily: 'monospace',
            color: '#64748b',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {config.tagName}
        </Typography>
      </Box>

      {/* DatePicker for any field containing DATE in tag name */}
      {isDateField ? (
        <DatePicker
          value={parsedDate}
          disabled={!config.isEditable}
          format="DD/MM/YYYY"
          slots={
            !config.isEditable
              ? {
                  openPickerIcon: () => <LockOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />,
                }
              : undefined
          }
          onChange={(newDate: Dayjs | null) => {
            if (newDate && newDate.isValid()) {
              const xmlDateStr = formatDayjsToXmlDate(newDate);
              onChange(xmlDateStr);
            } else if (newDate === null) {
              onChange('');
            }
          }}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              sx: {
                bgcolor: !config.isEditable ? '#f1f5f9' : '#ffffff',
                fontSize: '13.5px',
                fontWeight: 500,
                borderRadius: '6px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isEdited ? '#d97706' : !config.isEditable ? '#e2e8f0' : '#cbd5e1',
                  borderWidth: isEdited ? '1.5px' : '1px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isEdited ? '#b45309' : !config.isEditable ? '#e2e8f0' : '#0d6e5a',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isEdited ? '#b45309' : '#0d6e5a',
                },
                '&.Mui-disabled': {
                  bgcolor: '#f1f5f9',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#334155',
                  color: '#334155',
                },
              },
            },
          }}
        />
      ) : !config.isEditable ? (
        // Read-only / Locked field (First two fields)
        <TextField
          fullWidth
          size="small"
          value={value ?? ''}
          disabled
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <LockOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: '#f1f5f9',
                color: '#334155 !important',
                fontSize: '13.5px',
                fontWeight: 500,
                borderRadius: '6px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0',
                },
                '&.Mui-disabled': {
                  color: '#334155',
                  WebkitTextFillColor: '#334155',
                  bgcolor: '#f1f5f9',
                },
              },
            },
          }}
        />
      ) : (
        // Editable text / textarea field
        <TextField
          fullWidth
          size="small"
          multiline={config.inputType === 'textarea'}
          rows={config.inputType === 'textarea' ? 3 : 1}
          value={value ?? ''}
          placeholder={`Enter ${config.label.toLowerCase()}...`}
          onChange={(e) => onChange(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <EditOutlinedIcon sx={{ fontSize: 16, color: '#0d6e5a' }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 500,
                borderRadius: '6px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isEdited ? '#d97706' : '#cbd5e1',
                  borderWidth: isEdited ? '1.5px' : '1px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isEdited ? '#b45309' : '#0d6e5a',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isEdited ? '#b45309' : '#0d6e5a',
                },
              },
            },
          }}
        />
      )}

      {/* Edited indicator badge and Was: ... label */}
      {isEdited && (
        <Stack direction="row" sx={{ alignItems: 'center', mt: 0.75 }} spacing={1}>
          <Box
            sx={{
              bgcolor: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              px: 0.8,
              py: 0.15,
              borderRadius: '4px',
              fontSize: '10.5px',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Edited
          </Box>
          <Typography
            sx={{
              fontSize: '11.5px',
              color: '#64748b',
              fontWeight: 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
            }}
          >
            Was:{' '}
            {isDateField
              ? `${formatXmlDateForDisplay(originalValue)} (${originalValue || 'empty'})`
              : originalValue || '(empty)'}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};
