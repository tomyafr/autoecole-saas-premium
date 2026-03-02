import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Required for neon serverless driver if you use a local driver
// neonConfig.fetchConnectionCache = true;

const connectionString = process.env.POSTGRES_URL!;

if (!connectionString) {
    console.warn('POSTGRES_URL is not defined in environment variables.');
}

const client = neon(connectionString);
export const db = drizzle(client, { schema });
