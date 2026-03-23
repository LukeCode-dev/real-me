/**
 * Real Me Scanner - General Helper Utilities
 */

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

/**
 * Formats a Date (or ISO string) into a human-readable string.
 *
 * @example formatDate(new Date()) // "Mar 23, 2026"
 * @example formatDate('2026-01-15T10:30:00Z') // "Jan 15, 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// getGreeting
// ---------------------------------------------------------------------------

/**
 * Returns a time-appropriate greeting based on the current hour.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---------------------------------------------------------------------------
// generateId
// ---------------------------------------------------------------------------

/**
 * Generates a short pseudo-unique ID (8 hex characters).
 * Not cryptographically secure — suitable for local keys and temp IDs.
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${timestamp.slice(-4)}${random}`;
}

// ---------------------------------------------------------------------------
// delay
// ---------------------------------------------------------------------------

/**
 * Promise-based delay.
 *
 * @example await delay(500); // wait 500ms
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// clamp
// ---------------------------------------------------------------------------

/**
 * Clamps a value between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------------------
// interpolateColor
// ---------------------------------------------------------------------------

/**
 * Linearly interpolates between two hex colours.
 *
 * @param color1 Start colour in "#RRGGBB" format.
 * @param color2 End colour in "#RRGGBB" format.
 * @param factor Interpolation factor 0-1 (0 = color1, 1 = color2).
 * @returns Interpolated colour as "#RRGGBB".
 *
 * @example interpolateColor('#000000', '#ffffff', 0.5) // "#808080"
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number,
): string {
  const t = clamp(factor, 0, 1);

  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function hex(n: number): string {
  return n.toString(16).padStart(2, '0');
}
