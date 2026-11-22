/** Response body (inside `data`) of GET /api/v1/health. */
export interface HealthStatus {
  status: 'ok';
  db: 'up' | 'down';
  version: string;
  time: string;
}
