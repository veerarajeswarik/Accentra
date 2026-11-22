import { describe, expect, it } from 'vitest';
import { MoneyError, formatINR, fromPaise, toPaise } from './index.js';

describe('toPaise', () => {
  it.each([
    ['0', 0],
    ['0.00', 0],
    ['0.01', 1],
    ['0.1', 10],
    ['1', 100],
    ['1500.5', 150050],
    ['1500.50', 150050],
    ['1,500.50', 150050],
    ['1,23,456.78', 12345678],
    ['123,456.78', 12345678],
    ['9,99,99,999.99', 9999999999],
    ['99999999.99', 9999999999],
    ['  42.10  ', 4210],
    ['007', 700],
  ])('parses %j as %i paise', (input, expected) => {
    expect(toPaise(input)).toBe(expected);
  });

  it('always returns an integer', () => {
    // The classic float trap: 0.1 + 0.2. As paise this is exact.
    expect(toPaise('0.1') + toPaise('0.2')).toBe(toPaise('0.3'));
    expect(Number.isInteger(toPaise('19.99'))).toBe(true);
  });

  it('rejects more than 2 decimal places', () => {
    expect(() => toPaise('1.234')).toThrow(/more than 2 decimal places/);
    expect(() => toPaise('0.001')).toThrow(MoneyError);
  });

  it('rejects negatives unless allowed', () => {
    expect(() => toPaise('-5')).toThrow(/cannot be negative/);
    expect(toPaise('-5.25', { allowNegative: true })).toBe(-525);
    expect(toPaise('-1,500.50', { allowNegative: true })).toBe(-150050);
    expect(Object.is(toPaise('-0.00', { allowNegative: true }), 0)).toBe(true);
  });

  it.each([
    '',
    '   ',
    'abc',
    '12abc',
    '1.2.3',
    '1500.',
    '.50',
    '1e5',
    'Infinity',
    'NaN',
    '+5',
    '₹100',
    '1,50,0',
    '1,5000',
    ',100',
    '100,',
    '1 000',
    '--5',
  ])('rejects invalid input %j', (input) => {
    expect(() => toPaise(input, { allowNegative: true })).toThrow(MoneyError);
  });

  it('rejects non-string input', () => {
    expect(() => toPaise(1500 as unknown as string)).toThrow(MoneyError);
    expect(() => toPaise(null as unknown as string)).toThrow(MoneyError);
  });

  it('rejects amounts beyond the safe integer range', () => {
    expect(() => toPaise('90071992547409.92')).toThrow(/too large/);
    expect(toPaise('90071992547409.91')).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe('fromPaise', () => {
  it.each([
    [0, '0.00'],
    [1, '0.01'],
    [10, '0.10'],
    [100, '1.00'],
    [150050, '1500.50'],
    [9999999999, '99999999.99'],
    [-525, '-5.25'],
    [-1, '-0.01'],
  ])('converts %i to %j', (paise, expected) => {
    expect(fromPaise(paise)).toBe(expected);
  });

  it('round-trips with toPaise', () => {
    for (const value of [0, 1, 99, 100, 150050, 9999999999]) {
      expect(toPaise(fromPaise(value))).toBe(value);
    }
  });

  it.each([1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects %d', (bad) => {
    expect(() => fromPaise(bad)).toThrow(MoneyError);
  });
});

describe('formatINR', () => {
  it.each([
    [0, '₹0.00'],
    [1, '₹0.01'],
    [99, '₹0.99'],
    [100, '₹1.00'],
    [99999, '₹999.99'],
    [100000, '₹1,000.00'],
    [150050, '₹1,500.50'],
    [12345678, '₹1,23,456.78'],
    [10000000, '₹1,00,000.00'],
    [9999999999, '₹9,99,99,999.99'],
    [123456789012, '₹1,23,45,67,890.12'],
    [-5000, '-₹50.00'],
    [-12345678, '-₹1,23,456.78'],
  ])('formats %i as %j', (paise, expected) => {
    expect(formatINR(paise)).toBe(expected);
  });

  it.each([
    [0, '₹0.00'],
    [99999, '₹999.99'],
    [100000, '₹1K'],
    [125000, '₹1.3K'],
    [9_996_000, '₹1L'],
    [12_000_000, '₹1.2L'],
    [10_000_000, '₹1L'],
    [999_500_000, '₹1Cr'],
    [3_400_000_000, '₹3.4Cr'],
    [1_234_500_000_000, '₹1,234.5Cr'],
    [-12_000_000, '-₹1.2L'],
  ])('compact-formats %i as %j', (paise, expected) => {
    expect(formatINR(paise, { compact: true })).toBe(expected);
  });

  it.each([0.5, NaN, -Infinity])('rejects %d', (bad) => {
    expect(() => formatINR(bad)).toThrow(MoneyError);
  });
});
