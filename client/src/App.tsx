/**
 * TEMPORARY root (Phase 2a–2c): shows the component showcase directly.
 * Phase 2d replaces this with the real router; the showcase moves to /dev/components.
 */
import { MemoryRouter } from 'react-router';
import { ComponentsShowcase } from './dev/ComponentsShowcase';

export function App() {
  return (
    <MemoryRouter>
      <ComponentsShowcase />
    </MemoryRouter>
  );
}
