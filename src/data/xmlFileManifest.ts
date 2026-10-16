import airbnbRaw from '../assets/sample-xml/Airbnb.xml?raw';
import nordstromRaw from '../assets/sample-xml/Nordstorm Inc.xml?raw';

export interface XmlFileItem {
  id: string;
  displayName: string;
  filename: string;
  voucherType: string;
  partyName: string;
  voucherNumber: string;
  amountFormatted: string;
  amountNumber: number;
  sizeText: string;
  sizeBytes: number;
  isDefault?: boolean;
  isUploaded?: boolean;
  rawXml: string;
}

export const SAMPLE_XML_FILES: XmlFileItem[] = [
  {
    id: 'airbnb',
    displayName: 'Airbnb',
    filename: 'Airbnb.xml',
    voucherType: 'Sales Domestic (A)',
    partyName: 'Airbnb Global Capability Center Pvt Ltd ISD',
    voucherNumber: 'AGDOM202610/239',
    amountFormatted: '₹ 71,980.00',
    amountNumber: 71980.0,
    sizeText: '93.1 KB',
    sizeBytes: 95298,
    isDefault: true,
    rawXml: airbnbRaw,
  },
  {
    id: 'nordstrom',
    displayName: 'Nordstrom Inc',
    filename: 'Nordstorm Inc.xml',
    voucherType: 'Sales Export (A)',
    partyName: 'Nordstrom Inc.',
    voucherNumber: 'AGEXP202610/503',
    amountFormatted: '₹ 6,61,259.70',
    amountNumber: 661259.7,
    sizeText: '47.5 KB',
    sizeBytes: 48600,
    isDefault: false,
    rawXml: nordstromRaw,
  },
];
