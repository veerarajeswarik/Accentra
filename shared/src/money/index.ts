/**
 * Money helpers. RULE: all money is stored and computed as INTEGER PAISE.
 *   ₹1,500.50  →  150050
 * Never use floats (0.1 + 0.2 !== 0.3) and never call parseFloat on money.
 * All parsing and formatting below uses integer / BigInt arithmetic only.
 */

export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoneyError';
  }
}

export interface ToPaiseOptions {
  /** Allow a leading "-" (e.g. for adjustments). Default: false. */
  allowNegative?: boolean;
}

/*
 * Accepted rupee formats (integer part):
 *   plain digits          1500
 *   Western grouping      1,500  /  123,456,789
 *   Indian grouping       1,23,456  /  9,99,99,999
 * Optional fraction: 1 or 2 digits after a dot.
 */
const PLAIN = String.raw`\d+`;
const WESTERN = String.raw`\d{1,3}(?:,\d{3})+`;
const INDIAN = String.raw`\d{1,2}(?:,\d{2})*,\d{3}`;
const RUPEE_PATTERN = new RegExp(String.raw`^(-)?(${PLAIN}|${WESTERN}|${INDIAN})(?:\.(\d{1,2}))?$`);

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

/**
 * Convert a rupee string typed by a user (e.g. "1,500.50") into integer paise (150050).
 * Throws MoneyError for anything that is not an exact amount with at most 2 decimals.
 */
export function toPaise(rupees: string, options: ToPaiseOptions = {}): number {
  if (typeof rupees !== 'string') {
    throw new MoneyError('Amount must be given as text, e.g. "1500.50"');
  }
  const input = rupees.trim();
  if (input === '') {
    throw new MoneyError('Amount is required');
  }
  if (/^-?[\d,]+\.\d{3,}$/.test(input)) {
    throw new MoneyError('Amount cannot have more than 2 decimal places');
  }
  const match = RUPEE_PATTERN.exec(input);
  if (!match) {
    throw new MoneyError(`"${rupees}" is not a valid amount`);
  }
  const [, sign, wholePart = '0', fractionPart = ''] = match;
  if (sign && !options.allowNegative) {
    throw new MoneyError('Amount cannot be negative');
  }

  const whole = BigInt(wholePart.replaceAll(',', ''));
  const fraction = BigInt(fractionPart.padEnd(2, '0'));
  const paise = whole * 100n + fraction;

  if (paise > MAX_SAFE) {
    throw new MoneyError('Amount is too large');
  }
  // Avoid returning -0 for "-0.00".
  return sign && paise !== 0n ? -Number(paise) : Number(paise);
}

function assertPaise(paise: number): void {
  if (!Number.isSafeInteger(paise)) {
    throw new MoneyError(`Paise must be a safe integer, received ${String(paise)}`);
  }
}

/** Convert integer paise to a plain rupee string with 2 decimals: 150050 → "1500.50". */
export function fromPaise(paise: number): string {
  assertPaise(paise);
  const negative = paise < 0;
  const abs = BigInt(Math.abs(paise));
  const whole = abs / 100n;
  const fraction = (abs % 100n).toString().padStart(2, '0');
  return `${negative ? '-' : ''}${whole.toString()}.${fraction}`;
}

/** Group a digit string the Indian way: "123456789" → "12,34,56,789". */
function groupIndian(digits: string): string {
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const groups: string[] = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) groups.unshift(rest);
  return `${groups.join(',')},${lastThree}`;
}

export interface FormatINROptions {
  /** Short form for dashboards: ₹1.2K, ₹1.2L (lakh), ₹3.4Cr (crore). Default: false. */
  compact?: boolean;
}

const PAISE_PER_THOUSAND = 100_000n; // ₹1,000
const PAISE_PER_LAKH = 10_000_000n; // ₹1,00,000
const PAISE_PER_CRORE = 1_000_000_000n; // ₹1,00,00,000

const COMPACT_UNITS = [
  { paise: PAISE_PER_CRORE, suffix: 'Cr' },
  { paise: PAISE_PER_LAKH, suffix: 'L' },
  { paise: PAISE_PER_THOUSAND, suffix: 'K' },
] as const;

/** Round abs paise to one decimal place of the unit (half-up), returned in tenths. */
function toTenths(abs: bigint, unit: bigint): bigint {
  return (abs * 10n + unit / 2n) / unit;
}

function formatCompact(abs: bigint): string | null {
  for (let i = 0; i < COMPACT_UNITS.length; i++) {
    const unit = COMPACT_UNITS[i]!;
    if (abs < unit.paise) continue;
    const tenths = toTenths(abs, unit.paise);
    // Rounding can push e.g. 99.96K up to "100.0K", which should read "₹1L".
    const bigger = COMPACT_UNITS[i - 1];
    if (bigger && tenths * unit.paise >= bigger.paise * 10n) {
      return formatTenths(toTenths(abs, bigger.paise), bigger.suffix);
    }
    return formatTenths(tenths, unit.suffix);
  }
  return null; // below ₹1,000: show the full amount
}

function formatTenths(tenths: bigint, suffix: string): string {
  const whole = tenths / 10n;
  const decimal = tenths % 10n;
  const wholeText = groupIndian(whole.toString());
  return decimal === 0n ? `${wholeText}${suffix}` : `${wholeText}.${decimal.toString()}${suffix}`;
}

/**
 * Format integer paise for display using Indian digit grouping.
 *   formatINR(12345678)                  → "₹1,23,456.78"
 *   formatINR(12000000, {compact: true}) → "₹1.2L"
 *   formatINR(-5000)                     → "-₹50.00"
 */
export function formatINR(paise: number, options: FormatINROptions = {}): string {
  assertPaise(paise);
  const sign = paise < 0 ? '-' : '';
  const abs = BigInt(Math.abs(paise));

  if (options.compact) {
    const compact = formatCompact(abs);
    if (compact !== null) return `${sign}₹${compact}`;
  }

  const whole = abs / 100n;
  const fraction = (abs % 100n).toString().padStart(2, '0');
  return `${sign}₹${groupIndian(whole.toString())}.${fraction}`;
}
