import { useMemo, useSyncExternalStore } from 'react';

export interface ChartColors {
  /** Ordered series colours (DESIGN_SYSTEM.md 5.2 chart palette). */
  series: string[];
  grid: string;
  axis: string;
  text: string;
  surface: string;
  border: string;
}

function readVar(styles: CSSStyleDeclaration, name: string): string {
  return styles.getPropertyValue(name).trim();
}

function readChartColors(): ChartColors {
  const styles = getComputedStyle(document.documentElement);
  return {
    series: [1, 2, 3, 4, 5, 6].map((n) => readVar(styles, `--chart-${n}`)),
    grid: readVar(styles, '--border'),
    axis: readVar(styles, '--text-muted'),
    text: readVar(styles, '--text'),
    surface: readVar(styles, '--surface'),
    border: readVar(styles, '--border'),
  };
}

/** `_rootClass` is unused by the read itself; it ties the memo to theme changes. */
function readChartColorsFor(_rootClass: string): ChartColors {
  return readChartColors();
}

/** Re-render whenever the class on <html> changes (that is how the theme switches). */
function subscribeToRootClass(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

const getRootClass = () => document.documentElement.className;

/**
 * Theme-aware colours for Recharts (SVG attributes can't use CSS var() directly).
 * Values are read from the CSS variables, so the tokens in globals.css stay the only source.
 */
export function useChartColors(): ChartColors {
  const rootClass = useSyncExternalStore(subscribeToRootClass, getRootClass);
  // rootClass is passed in only to make the dependency explicit: a new class → re-read CSS.
  return useMemo(() => readChartColorsFor(rootClass), [rootClass]);
}
