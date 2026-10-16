import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface WorkflowStepperProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { step: 1, label: 'Select file' },
  { step: 2, label: 'Review and edit' },
  { step: 3, label: 'Download updated XML' },
];

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ currentStep }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        py: 2.5,
        userSelect: 'none',
      }}
    >
      {STEPS.map((s, index) => {
        const isCompleted = s.step < currentStep;
        const isActive = s.step === currentStep;

        return (
          <React.Fragment key={s.step}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  ...(isCompleted
                    ? {
                        bgcolor: '#10b981',
                        color: '#ffffff',
                      }
                    : isActive
                    ? {
                        bgcolor: '#0d6e5a',
                        color: '#ffffff',
                      }
                    : {
                        bgcolor: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        color: '#94a3b8',
                      }),
                }}
              >
                {isCompleted ? <CheckIcon sx={{ fontSize: 16 }} /> : s.step}
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: '13px', sm: '14px' },
                  fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                  color: isActive ? '#0f172a' : isCompleted ? '#334155' : '#94a3b8',
                }}
              >
                {s.label}
              </Typography>
            </Box>

            {/* Connecting line */}
            {index < STEPS.length - 1 && (
              <Box
                sx={{
                  width: { xs: 24, sm: 48 },
                  height: 2,
                  bgcolor: s.step < currentStep ? '#10b981' : '#e2e8f0',
                  borderRadius: 1,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};
