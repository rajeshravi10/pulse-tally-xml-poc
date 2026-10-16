export interface DynamicFieldConfig {
  key: string;
  tagName: string;
  label: string;
  section: string;
  isEditable: boolean;
  inputType: 'text' | 'textarea' | 'date';
  defaultValue: string;
  index: number;
}

export interface DynamicSection {
  key: string;
  title: string;
  fields: DynamicFieldConfig[];
}

export interface ParsedVoucherData {
  xmlDoc: Document;
  voucherElement: Element;
  fieldValues: Record<string, string>;
  dynamicFields: DynamicFieldConfig[];
  sections: DynamicSection[];
  voucherTotalAmount: string;
}

export function formatFieldLabel(tagName: string): string {
  const overrides: Record<string, string> = {
    VOUCHERNUMBER: 'Voucher number',
    VOUCHERTYPENAME: 'Voucher type',
    DATE: 'Date',
    PARTYLEDGERNAME: 'Party ledger',
    PARTYGSTIN: 'Party GSTIN',
    PLACEOFSUPPLY: 'Place of supply',
    NARRATION: 'Narration',
    REFERENCE: 'Reference',
    AMOUNT: 'Amount (INR)',
    CMPGSTIN: 'Company GSTIN',
    CMPGSTSTATE: 'Company GST state',
    CMPGSTREGISTRATIONTYPE: 'Company GST registration type',
    GSTREGISTRATION: 'GST registration',
    GSTREGISTRATIONTYPE: 'GST registration type',
    VATDEALERTYPE: 'VAT dealer type',
    STATENAME: 'State name',
    COUNTRYOFRESIDENCE: 'Country of residence',
    PARTYNAME: 'Party name',
    BASICBUYERNAME: 'Buyer name',
    PARTYMAILINGNAME: 'Party mailing name',
    PARTYPINCODE: 'Party PIN code',
    BILLTOPLACE: 'Bill to place',
    DISPATCHFROMNAME: 'Dispatch from name',
    DISPATCHFROMPLACE: 'Dispatch from place',
    DISPATCHFROMSTATENAME: 'Dispatch from state',
    DISPATCHFROMPINCODE: 'Dispatch PIN code',
    SHIPTOPLACE: 'Ship to place',
    CONSIGNEEGSTIN: 'Consignee GSTIN',
    CONSIGNEEMAILINGNAME: 'Consignee mailing name',
    CONSIGNEEPINCODE: 'Consignee PIN code',
    CONSIGNEESTATENAME: 'Consignee state',
    CONSIGNEECOUNTRYNAME: 'Consignee country',
    IRN: 'IRN',
    IRNACKNO: 'IRN Ack number',
    IRNACKDATE: 'IRN Ack date',
    IRNQRCODE: 'IRN QR code',
    GUID: 'GUID',
    PERSISTEDVIEW: 'Persisted view',
    NUMBERINGSTYLE: 'Numbering style',
    BASICDUEDATEOFPYMT: 'Due date of payment',
    VCHENTRYMODE: 'Voucher entry mode',
    VCHGSTCLASS: 'Voucher GST class',
    ISINVOICE: 'Is invoice',
    ISSECURITYONWHENENTERED: 'Security on when entered',
    GSTOVRDNINELIGIBLEITC: 'GST override ineligible ITC',
    GSTOVRDNISREVCHARGEAPPL: 'GST reverse charge applicable',
    GSTOVRDNTAXABILITY: 'GST taxability',
    GSTOVRDNSTOREDNATURE: 'GST stored nature',
    GSTOVRDNTYPEOFSUPPLY: 'GST type of supply',
    ISDEEMEDPOSITIVE: 'Deemed positive',
    LEDGERNAME: 'Sales ledger',
  };

  if (overrides[tagName]) return overrides[tagName];

  // Convert CamelCase or UPPER_CASE into Title Case
  return tagName
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

export function categorizeTag(tagName: string): string {
  const upper = tagName.toUpperCase();
  if (
    upper.startsWith('VOUCHER') ||
    upper === 'DATE' ||
    upper === 'GUID' ||
    upper.startsWith('VCH') ||
    upper.includes('IRN') ||
    upper.includes('AUDIT')
  ) {
    return 'VOUCHER';
  }
  if (
    upper.includes('PARTY') ||
    upper.includes('BUYER') ||
    upper.includes('LEDGER')
  ) {
    return 'PARTY';
  }
  if (
    upper.includes('GST') ||
    upper.includes('VAT') ||
    upper.includes('TAX')
  ) {
    return 'TAX & GST';
  }
  if (
    upper.includes('DISPATCH') ||
    upper.includes('SHIP') ||
    upper.includes('BILL') ||
    upper.includes('PLACE') ||
    upper.includes('STATE') ||
    upper.includes('COUNTRY') ||
    upper.includes('CONSIGNEE') ||
    upper.includes('ADDRESS')
  ) {
    return 'ADDRESS & DISPATCH';
  }
  if (upper === 'NARRATION') {
    return 'NARRATION';
  }
  return 'OTHER DETAILS';
}

export function parseXmlString(xmlContent: string): ParsedVoucherData {
  if (!xmlContent || typeof xmlContent !== 'string') {
    throw new Error('XML content is empty or invalid.');
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

  // Check for parser errors
  const parserError = xmlDoc.getElementsByTagName
    ? xmlDoc.getElementsByTagName('parsererror')[0]
    : (xmlDoc as Document).querySelector?.('parsererror');

  if (parserError) {
    const errorMsg = parserError.textContent || 'Unknown XML parsing error';
    throw new Error(`XML Parse Error: ${errorMsg}`);
  }

  const voucherElement = xmlDoc.getElementsByTagName
    ? xmlDoc.getElementsByTagName('VOUCHER')[0]
    : (xmlDoc as Document).querySelector?.('VOUCHER');

  if (!voucherElement) {
    throw new Error('Could not find <VOUCHER> element in the XML document.');
  }

  // 1. Dynamically extract all leaf child elements from <VOUCHER>
  const rawFields: { tagName: string; value: string }[] = [];
  const seenTags = new Set<string>();

  const childNodes = Array.from(voucherElement.childNodes);
  for (const node of childNodes) {
    if (node.nodeType === 1) { // ELEMENT_NODE
      const child = node as Element;
      // Check if it has child elements
      const hasChildElements = Array.from(child.childNodes).some((n) => n.nodeType === 1);
      const tagName = child.tagName || child.localName || child.nodeName;

      // Exclude purely container/list elements that end in .LIST or have child elements
      if (!hasChildElements && !seenTags.has(tagName)) {
        const val = child.textContent?.trim() ?? '';
        if (val.length > 0 || tagName === 'REFERENCE') {
          seenTags.add(tagName);
          rawFields.push({ tagName, value: val });
        }
      }
    }
  }

  // Ensure VOUCHERTYPENAME and VOUCHERNUMBER appear at the top if present
  const priorityTags = ['VOUCHERTYPENAME', 'VOUCHERNUMBER'];
  const orderedFields: { tagName: string; value: string }[] = [];

  for (const pTag of priorityTags) {
    const foundIdx = rawFields.findIndex((f) => f.tagName === pTag);
    if (foundIdx !== -1) {
      orderedFields.push(rawFields[foundIdx]);
      rawFields.splice(foundIdx, 1);
    }
  }
  // Append remaining fields in document order
  orderedFields.push(...rawFields);

  // 2. Build DynamicFieldConfig
  // Requirement:
  // - First two fields are read-only, ALL subsequent fields are editable.
  // - Any field whose tag name contains 'DATE' (case-insensitive) has inputType: 'date'.
  const dynamicFields: DynamicFieldConfig[] = orderedFields.map((item, index) => {
    const isFirstTwo = index < 2;
    const isDateField = item.tagName.toUpperCase().includes('DATE');

    let inputType: 'text' | 'textarea' | 'date' = 'text';
    if (isDateField) {
      inputType = 'date';
    } else if (item.tagName === 'NARRATION' || item.value.length > 80) {
      inputType = 'textarea';
    }

    return {
      key: item.tagName,
      tagName: item.tagName,
      label: formatFieldLabel(item.tagName),
      section: categorizeTag(item.tagName),
      isEditable: !isFirstTwo, // First two are read-only, all others editable!
      inputType,
      defaultValue: item.value,
      index,
    };
  });

  const fieldValues: Record<string, string> = {};
  for (const f of dynamicFields) {
    fieldValues[f.key] = f.defaultValue;
  }

  // Group dynamic fields by section
  const sectionMap = new Map<string, DynamicFieldConfig[]>();
  const sectionOrder = ['VOUCHER', 'PARTY', 'ADDRESS & DISPATCH', 'TAX & GST', 'NARRATION', 'OTHER DETAILS'];

  for (const sName of sectionOrder) {
    sectionMap.set(sName, []);
  }

  for (const field of dynamicFields) {
    const sec = field.section;
    if (!sectionMap.has(sec)) {
      sectionMap.set(sec, []);
    }
    sectionMap.get(sec)!.push(field);
  }

  const sections: DynamicSection[] = [];
  for (const [secTitle, fields] of sectionMap.entries()) {
    if (fields.length > 0) {
      sections.push({
        key: secTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        title: secTitle,
        fields,
      });
    }
  }

  // Calculate amount if available
  let amount = '0.00';
  const amountEls = voucherElement.getElementsByTagName('AMOUNT');
  if (amountEls && amountEls.length > 0) {
    const num = Math.abs(parseFloat(amountEls[0].textContent || '0'));
    if (!isNaN(num)) {
      amount = num.toFixed(2);
    }
  }

  return {
    xmlDoc,
    voucherElement,
    fieldValues,
    dynamicFields,
    sections,
    voucherTotalAmount: amount,
  };
}
