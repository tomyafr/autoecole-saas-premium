import { sendEmail, buildReminderEmail } from './src/lib/mailer';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function testEmail() {
    console.log('Préparation de l\'email de test...');

    const html = buildReminderEmail(
        'Tom DURAND',
        'vendredi 6 mars 2026',
        '14:00',
        'Marc Leduc',
        'Leçon de conduite - Circulation'
    );

    console.log('Envoi vers tomdurand948@gmail.com...');

    const result = await sendEmail({
        to: 'tomdurand948@gmail.com',
        subject: `🚗 Rappel AutoDrive — Votre session du vendredi 6 mars 2026`,
        html,
    });

    if (result.success) {
        console.log('✅ Email envoyé avec succès ! Check ta boîte mail.');
    } else {
        console.error('❌ Échec de l\'envoi:', result.error);
    }
}

testEmail();
