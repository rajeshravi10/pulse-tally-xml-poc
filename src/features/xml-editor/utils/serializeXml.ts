export function serializeXml(doc: Document): string {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}

export function escapeXml(text: string): string {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateDynamicVoucherSnippet(
  fieldValues: Record<string, string>,
  orderedTags?: string[]
): string {
  const vchType = fieldValues.VOUCHERTYPENAME || fieldValues.voucherType || 'Sales';
  const tags = orderedTags || Object.keys(fieldValues);

  const lines: string[] = [
    '<!-- ENVELOPE / HEADER / BODY unchanged -->',
    `<VOUCHER VCHTYPE="${escapeXml(vchType)}" ACTION="Create">`,
  ];

  for (const tag of tags) {
    const val = fieldValues[tag];
    if (val !== undefined && val !== null && val.trim().length > 0) {
      lines.push(`  <${tag}>${escapeXml(val)}</${tag}>`);
    }
  }

  lines.push('</VOUCHER>');
  return lines.join('\n');
}

export function formatVoucherFromDoc(doc: Document | null): string {
  if (!doc) return '';
  const voucher = doc.querySelector('VOUCHER');
  if (!voucher) return new XMLSerializer().serializeToString(doc);

  const serializer = new XMLSerializer();
  const raw = serializer.serializeToString(voucher);

  // Return formatted with indentation
  return '<!-- ENVELOPE / HEADER / BODY unchanged -->\n' +
    raw
      .replace(/>\s*</g, '>\n<')
      .split('\n')
      .map((l) => (l.startsWith('<VOUCHER') || l.startsWith('</VOUCHER') ? l : '  ' + l))
      .join('\n');
}
