import { useState, useCallback, useMemo } from 'react';
import { SAMPLE_XML_FILES, type XmlFileItem } from '../../../data/xmlFileManifest';
import { parseXmlString, type ParsedVoucherData, type DynamicFieldConfig, type DynamicSection } from '../utils/parseXml';
import { updateVoucherFieldNode } from '../utils/updateXmlNode';
import { serializeXml, generateDynamicVoucherSnippet } from '../utils/serializeXml';
import { computeFieldChanges, type ChangedField } from '../utils/diffXml';

export function useXmlDocument() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<XmlFileItem>(SAMPLE_XML_FILES[0]);
  const [parsedData, setParsedData] = useState<ParsedVoucherData | null>(null);
  const [originalFieldValues, setOriginalFieldValues] = useState<Record<string, string>>({});
  const [currentFieldValues, setCurrentFieldValues] = useState<Record<string, string>>({});
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Select a new sample file
  const handleSelectFile = useCallback((file: XmlFileItem) => {
    setSelectedFile(file);
    setParsedData(null);
    setOriginalFieldValues({});
    setCurrentFieldValues({});
    setParseError(null);
  }, []);

  // Parse selected file and advance to Screen 2
  const handleParseAndReview = useCallback(async () => {
    setIsParsing(true);
    setParseError(null);

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const parsed = parseXmlString(selectedFile.rawXml);
      setParsedData(parsed);
      setOriginalFieldValues({ ...parsed.fieldValues });
      setCurrentFieldValues({ ...parsed.fieldValues });
      setCurrentStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse XML file.';
      setParseError(msg);
    } finally {
      setIsParsing(false);
    }
  }, [selectedFile]);

  // Update a dynamic field value
  const handleFieldChange = useCallback(
    (fieldKey: string, newValue: string) => {
      setCurrentFieldValues((prev) => {
        const updated = {
          ...prev,
          [fieldKey]: newValue,
        };
        return updated;
      });

      if (parsedData?.xmlDoc) {
        updateVoucherFieldNode(parsedData.xmlDoc, fieldKey, newValue);
      }
    },
    [parsedData]
  );

  // Reset to original
  const handleReset = useCallback(() => {
    if (!selectedFile) return;
    try {
      const freshParsed = parseXmlString(selectedFile.rawXml);
      setParsedData(freshParsed);
      setCurrentFieldValues({ ...originalFieldValues });
    } catch (err) {
      console.error('Reset error:', err);
    }
  }, [selectedFile, originalFieldValues]);

  // Dynamic fields & sections
  const dynamicFields: DynamicFieldConfig[] = useMemo(() => {
    return parsedData?.dynamicFields ?? [];
  }, [parsedData]);

  const sections: DynamicSection[] = useMemo(() => {
    return parsedData?.sections ?? [];
  }, [parsedData]);

  // Ordered tags for snippet generation
  const orderedTags = useMemo(() => {
    return dynamicFields.map((f) => f.tagName);
  }, [dynamicFields]);

  // Calculate changed fields
  const changedFields: ChangedField[] = useMemo(() => {
    return computeFieldChanges(originalFieldValues, currentFieldValues, dynamicFields);
  }, [originalFieldValues, currentFieldValues, dynamicFields]);

  const modifiedCount = changedFields.length;

  // Live voucher snippet (updates whenever currentFieldValues changes)
  const liveVoucherSnippet = useMemo(() => {
    return generateDynamicVoucherSnippet(currentFieldValues, orderedTags);
  }, [currentFieldValues, orderedTags]);

  // Original voucher snippet
  const originalVoucherSnippet = useMemo(() => {
    return generateDynamicVoucherSnippet(originalFieldValues, orderedTags);
  }, [originalFieldValues, orderedTags]);

  // Function to serialize latest XML with all current field values guaranteed to be applied
  const getLatestSerializedXml = useCallback((): string => {
    if (!parsedData?.xmlDoc) return selectedFile.rawXml;

    // Apply all current edited field values to the in-memory XML document
    for (const [key, val] of Object.entries(currentFieldValues)) {
      updateVoucherFieldNode(parsedData.xmlDoc, key, val);
    }

    return serializeXml(parsedData.xmlDoc);
  }, [parsedData, currentFieldValues, selectedFile]);

  // Full XML document serialized - explicitly depends on currentFieldValues!
  const fullSerializedXml = useMemo(() => {
    return getLatestSerializedXml();
  }, [getLatestSerializedXml]);

  return {
    currentStep,
    setCurrentStep,
    selectedFile,
    handleSelectFile,
    handleParseAndReview,
    isParsing,
    parseError,
    dynamicFields,
    sections,
    fieldValues: currentFieldValues,
    originalFieldValues,
    handleFieldChange,
    handleReset,
    changedFields,
    modifiedCount,
    liveVoucherSnippet,
    originalVoucherSnippet,
    fullSerializedXml,
    getLatestSerializedXml,
  };
}
