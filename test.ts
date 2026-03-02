import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getStudentDashboardData } from './src/lib/db/queries';

async function test() {
    console.log("Starting test.. env POSTGRES_URL length:", process.env.POSTGRES_URL?.length);
    try {
        const d = await getStudentDashboardData('c2d29867-3d0b-d497-9191-18a9d8ee7830');
        console.log("OK", d);
    } catch (e) {
        console.error("FAIL", e);
    }
}
test();
