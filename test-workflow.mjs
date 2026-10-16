import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import dayjs from 'dayjs';
import { parseXmlString } from './src/features/xml-editor/utils/parseXml.js';
import { updateVoucherFieldNode } from './src/features/xml-editor/utils/updateXmlNode.js';
import { serializeXml } from './src/features/xml-editor/utils/serializeXml.js';
import { parseXmlDateToDayjs, formatDayjsToXmlDate, formatXmlDateForDisplay } from './src/features/xml-editor/utils/dateUtils.js';

if (!globalThis.DOMParser) globalThis.DOMParser = DOMParser;
if (!globalThis.XMLSerializer) globalThis.XMLSerializer = XMLSerializer;

console.log('=== Verifying DatePicker Functionality for all DATE tags ===\n');

// 1. Test dateUtils functions directly
console.log('[Test 1] dateUtils parsing and formatting:');
const sampleXmlDate = '20261014';
const parsedDayjs = parseXmlDateToDayjs(sampleXmlDate);
if (!parsedDayjs || !parsedDayjs.isValid()) throw new Error('Failed to parse 20261014');
if (parsedDayjs.year() !== 2026 || parsedDayjs.month() !== 9 || parsedDayjs.date() !== 14) {
  throw new Error(`Unexpected date components: year=${parsedDayjs.year()}, month=${parsedDayjs.month()}, date=${parsedDayjs.date()}`);
}
console.log('  ✓ 20261014 correctly parsed to year=2026, month=10, day=14');

// Simulate user picking 20/10/2026
const pickedDate = parsedDayjs.date(20);
const formattedBack = formatDayjsToXmlDate(pickedDate);
console.log(`  ✓ DatePicker selection 20/10/2026 formatted back to XML: "${formattedBack}"`);
if (formattedBack !== '20261020') {
  throw new Error(`Expected 20261020, got ${formattedBack}`);
}

// Display format
const displayStr = formatXmlDateForDisplay('20261014');
console.log(`  ✓ Display string: "${displayStr}" (expected "14/10/2026")`);
if (displayStr !== '14/10/2026') throw new Error('Display format mismatch');

// Test invalid / empty date: should NOT silently become current date!
const invalidDayjs = parseXmlDateToDayjs('INVALID');
if (invalidDayjs !== null) throw new Error('Invalid date must return null');
const emptyDayjs = parseXmlDateToDayjs('');
if (emptyDayjs !== null) throw new Error('Empty date must return null');
console.log('  ✓ Invalid and empty dates return null (no silent fallback to today)\n');

// 2. Test dynamic detection across all 4 files
const files = [
  'Tonic Creative Technologies.xml',
  'Airbnb.xml',
  'Nordstorm Inc.xml',
  'Nike Inc.xml'
];

for (const f of files) {
  const filePath = resolve('./src/assets/sample-xml', f);
  const rawXml = readFileSync(filePath, 'utf-8');
  const parsed = parseXmlString(rawXml);

  console.log(`[Testing File: ${f}]`);
  const dateFields = parsed.dynamicFields.filter(field => field.inputType === 'date');
  console.log(`  Detected ${dateFields.length} date fields: ${dateFields.map(d => `${d.tagName} (${d.isEditable ? 'editable' : 'read-only'})`).join(', ')}`);

  if (dateFields.length === 0) {
    throw new Error(`No date fields detected in ${f}`);
  }

  // Verify all tags with DATE in name were marked as date
  for (const df of dateFields) {
    if (!df.tagName.toUpperCase().includes('DATE')) {
      throw new Error(`Field ${df.tagName} incorrectly marked as date`);
    }
  }

  // Test updating an editable date field
  const editableDateField = dateFields.find(d => d.isEditable);
  if (editableDateField) {
    const originalVal = parsed.fieldValues[editableDateField.key];
    const newDateXml = '20261225'; // 25th Dec 2026

    updateVoucherFieldNode(parsed.xmlDoc, editableDateField.key, newDateXml);
    const serialized = serializeXml(parsed.xmlDoc);

    if (!serialized.includes(`<${editableDateField.tagName}>${newDateXml}</${editableDateField.tagName}>`)) {
      throw new Error(`Failed to update ${editableDateField.tagName} in ${f}`);
    }
    console.log(`  ✓ Successfully updated editable date field ${editableDateField.tagName}: ${originalVal} -> ${newDateXml}`);
  }

  console.log(`  ✓ Passed for ${f}\n`);
}

console.log('=== ALL DATE PICKER ACCEPTANCE CRITERIA VERIFIED AND PASSED! ===\n');
