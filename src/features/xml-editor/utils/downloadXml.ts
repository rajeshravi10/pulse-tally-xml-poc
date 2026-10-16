export function getUpdatedFilename(originalFilename: string): string {
  const dotIndex = originalFilename.lastIndexOf('.');
  if (dotIndex !== -1) {
    const base = originalFilename.substring(0, dotIndex);
    const ext = originalFilename.substring(dotIndex);
    return `${base}_updated${ext}`;
  }
  return `${originalFilename}_updated.xml`;
}

export function triggerXmlDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
