import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '../config';
import * as schema from './schema';

const DATABASE_URL = env.DATABASE_URL;

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export * from './schema';
