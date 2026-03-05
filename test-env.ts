import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

console.log('GMAIL:', process.env.GMAIL_USER);
console.log('PASS:', process.env.GMAIL_APP_PASSWORD);
