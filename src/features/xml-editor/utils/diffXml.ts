import { diffLines, type Change } from 'diff';
import type { DynamicFieldConfig } from './parseXml';

export interface ChangedField {
  key: string;
  label: string;
  tagName: string;
  oldValue: string;
  newValue: string;
}

export interface DiffLineItem {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffResult {
  lines: DiffLineItem[];
  removedCount: number;
  addedCount: number;
}

export function computeFieldChanges(
  originalValues: Record<string, string>,
  currentValues: Record<string, string>,
  dynamicFields?: DynamicFieldConfig[]
): ChangedField[] {
  const changes: ChangedField[] = [];

  if (dynamicFields && dynamicFields.length > 0) {
    for (const field of dynamicFields) {
      if (!field.isEditable) continue;
      const oldVal = (originalValues[field.key] ?? '').trim();
      const newVal = (currentValues[field.key] ?? '').trim();

      if (oldVal !== newVal) {
        changes.push({
          key: field.key,
          label: field.label,
          tagName: field.tagName,
          oldValue: oldVal,
          newValue: newVal,
        });
      }
    }
  } else {
    // Fallback: check all keys in currentValues
    for (const key of Object.keys(currentValues)) {
      const oldVal = (originalValues[key] ?? '').trim();
      const newVal = (currentValues[key] ?? '').trim();

      if (oldVal !== newVal) {
        changes.push({
          key,
          label: key,
          tagName: key,
          oldValue: oldVal,
          newValue: newVal,
        });
      }
    }
  }

  return changes;
}

export function computeXmlDiff(originalXml: string, updatedXml: string): DiffResult {
  const changes: Change[] = diffLines(originalXml, updatedXml);
  const diffLinesList: DiffLineItem[] = [];

  let removedCount = 0;
  let addedCount = 0;

  for (const part of changes) {
    const rawLines = part.value.split('\n');
    if (rawLines.length > 0 && rawLines[rawLines.length - 1] === '') {
      rawLines.pop();
    }

    for (const line of rawLines) {
      if (part.added) {
        addedCount++;
        diffLinesList.push({
          type: 'added',
          content: line,
        });
      } else if (part.removed) {
        removedCount++;
        diffLinesList.push({
          type: 'removed',
          content: line,
        });
      } else {
        diffLinesList.push({
          type: 'unchanged',
          content: line,
        });
      }
    }
  }

  return {
    lines: diffLinesList,
    removedCount,
    addedCount,
  };
}
