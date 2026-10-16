import dayjs, { Dayjs } from 'dayjs';

/**
 * Parses an 8-digit YYYYMMDD string (e.g. "20261014") into a dayjs object without timezone shifts.
 */
export function parseXmlDateToDayjs(val: string): Dayjs | null {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim();

  // Validate exact 8-digit format YYYYMMDD
  if (/^\d{8}$/.test(trimmed)) {
    const year = parseInt(trimmed.substring(0, 4), 10);
    const month = parseInt(trimmed.substring(4, 6), 10) - 1; // 0-indexed in Date
    const day = parseInt(trimmed.substring(6, 8), 10);

    const d = dayjs(new Date(year, month, day));
    // Verify that date components didn't overflow (e.g. month 13 or Feb 31)
    if (d.isValid() && d.year() === year && d.month() === month && d.date() === day) {
      return d;
    }
  }

  return null;
}

/**
 * Converts a Dayjs object directly to exact 8-digit YYYYMMDD string format.
 * Uses direct component formatting to completely avoid timezone-related shifts.
 */
export function formatDayjsToXmlDate(d: Dayjs | null): string {
  if (!d || !d.isValid()) return '';
  const y = String(d.year()).padStart(4, '0');
  const m = String(d.month() + 1).padStart(2, '0');
  const day = String(d.date()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/**
 * Formats YYYYMMDD into user-friendly DD/MM/YYYY for labels or change displays
 */
export function formatXmlDateForDisplay(val: string): string {
  if (!val || typeof val !== 'string') return '(empty)';
  const trimmed = val.trim();
  if (/^\d{8}$/.test(trimmed)) {
    const y = trimmed.substring(0, 4);
    const m = trimmed.substring(4, 6);
    const d = trimmed.substring(6, 8);
    return `${d}/${m}/${y}`;
  }
  return val;
}
