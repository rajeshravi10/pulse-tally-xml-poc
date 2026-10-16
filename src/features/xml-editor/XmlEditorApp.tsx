import React from 'react';
import { Box } from '@mui/material';
import { AppHeader } from '../../components/AppHeader';
import { WorkflowStepper } from '../../components/WorkflowStepper';
import { FixedActionBar } from '../../components/FixedActionBar';
import { useXmlDocument } from './hooks/useXmlDocument';
import { SelectXmlScreen } from './SelectXmlScreen';
import { ReviewXmlScreen } from './ReviewXmlScreen';
import { DownloadXmlScreen } from './DownloadXmlScreen';

export const XmlEditorApp: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    selectedFile,
    handleSelectFile,
    handleParseAndReview,
    isParsing,
    parseError,
    dynamicFields,
    sections,
    fieldValues,
    originalFieldValues,
    handleFieldChange,
    handleReset,
    changedFields,
    modifiedCount,
    liveVoucherSnippet,
    originalVoucherSnippet,
    fullSerializedXml,
    getLatestSerializedXml,
  } = useXmlDocument();

  return (
    <Box
      sx={{
        height: '100vh',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        minHeight: '100dvh' as any,
        maxHeight: '100dvh' as any,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f8fafc',
        overflow: 'hidden',
        color: '#0f172a',
      }}
    >
      {/* 1. Fixed Header */}
      <AppHeader />

      {/* 2. Scrollable Central Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: { xs: 2, sm: 4 },
          py: { xs: 1.5, sm: 2.5 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1240px',
            mx: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Stepper Progress Indicator */}
          <WorkflowStepper currentStep={currentStep} />

          {/* Screen Content */}
          <Box sx={{ flexGrow: 1, mt: 1 }}>
            {currentStep === 1 && (
              <SelectXmlScreen
                selectedFile={selectedFile}
                onSelectFile={handleSelectFile}
                parseError={parseError}
              />
            )}

            {currentStep === 2 && (
              <ReviewXmlScreen
                selectedFile={selectedFile}
                fieldValues={fieldValues}
                originalFieldValues={originalFieldValues}
                sections={sections}
                dynamicFields={dynamicFields}
                changedFields={changedFields}
                modifiedCount={modifiedCount}
                liveVoucherSnippet={liveVoucherSnippet}
                onFieldChange={handleFieldChange}
              />
            )}

            {currentStep === 3 && (
              <DownloadXmlScreen
                selectedFile={selectedFile}
                changedFields={changedFields}
                modifiedCount={modifiedCount}
                originalVoucherSnippet={originalVoucherSnippet}
                liveVoucherSnippet={liveVoucherSnippet}
                fullSerializedXml={fullSerializedXml}
                onGetLatestXml={getLatestSerializedXml}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* 3. Fixed Bottom Action Bar */}
      <FixedActionBar
        currentStep={currentStep}
        selectedFile={selectedFile}
        isParsing={isParsing}
        onParse={handleParseAndReview}
        onBackToSelect={() => setCurrentStep(1)}
        onBackToEdit={() => setCurrentStep(2)}
        onReset={handleReset}
        onGenerateUpdated={() => setCurrentStep(3)}
      />
    </Box>
  );
};
