/**
 * Database Configuration
 * Database connection settings and pool configuration
 */

import env from './env';

export const databaseConfig = {
  // Connection pool settings
  pool: {
    min: 2,
    max: 10,
  },
  
  // Connection timeout
  connectionTimeout: 30000,
  
  // Query timeout
  queryTimeout: 30000,
  
  // Retry configuration
  retry: {
    max: 3,
    backoff: 1000,
  },
  
  // Logging
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
  
  // Environment-specific settings
  ...(env.NODE_ENV === 'development' && {
    log: ['query', 'info', 'warn', 'error'],
  }),
  
  ...(env.NODE_ENV === 'production' && {
    log: ['error', 'warn'],
  }),
} as const;

export default databaseConfig;
