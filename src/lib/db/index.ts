import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL || 'postgres://dummy:dummy@dummy/dummy';

if (!process.env.POSTGRES_URL) {
    console.warn('⚠️ POSTGRES_URL is not defined in environment variables.');
}

const client = neon(connectionString);
export const db = drizzle(client, { schema });
