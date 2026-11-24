import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

const items = [
  { id: 'a', title: 'First question', content: 'First answer' },
  { id: 'b', title: 'Second question', content: 'Second answer' },
];

describe('Accordion', () => {
  it('opens one item at a time and exposes expanded state', async () => {
    render(<Accordion items={items} />);
    const first = screen.getByRole('button', { name: 'First question' });
    expect(first.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(first);
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('First answer')).toBeDefined();

    await userEvent.click(screen.getByRole('button', { name: 'Second question' }));
    expect(first.getAttribute('aria-expanded')).toBe('false');
  });

  it('wraps each question in a heading for page structure', () => {
    render(<Accordion items={items} headingLevel="h2" />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
  });

  it('works from the keyboard', async () => {
    render(<Accordion items={items} />);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('First answer')).toBeDefined();
  });
});
