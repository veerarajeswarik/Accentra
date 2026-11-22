import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useChartColors } from './chart-colors';

function Probe() {
  const colors = useChartColors();
  return <span data-testid="c1">{colors.series[0]}</span>;
}

describe('useChartColors', () => {
  it('re-reads CSS variables when the theme class changes', async () => {
    const root = document.documentElement;
    root.style.setProperty('--chart-1', 'teal-light');
    render(<Probe />);
    expect(screen.getByTestId('c1').textContent).toBe('teal-light');

    await act(async () => {
      root.style.setProperty('--chart-1', 'teal-dark');
      root.classList.add('dark');
      await new Promise((r) => setTimeout(r, 0)); // let MutationObserver fire
    });

    expect(screen.getByTestId('c1').textContent).toBe('teal-dark');
    root.style.removeProperty('--chart-1');
  });
});
